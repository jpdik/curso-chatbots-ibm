require('dotenv').config() //Obem as variáveis de ambiente do arquivo '.env'
const watson = require('watson-developer-cloud');
const pageChatService = require('../pageChat/pageChatService')
const ProdutosService = require('../produtos/produtosService')

// Configuração do asistente do IBM Watson (Chaves)
// todo process.env.<VALOR> é uma variável de ambiente
const assistant = new watson.AssistantV1({
    username: process.env.WATSON_USERNAME,
    password: process.env.WATSON_PASSWORD,
    url: process.env.WATSON_URL,
    version: process.env.WATSON_VERSION
});

/* Função que retorna um objeto que representa a conversa do usuário no banco.
    Caso não exista uma conversa, esta função a cria.
    Ela é uma promise, então ela roda em segundo plano para ser resolvida.
*/
construirCenario = (input) => new Promise((resolve, reject) => {
    // Pesquisa o contextID informado, se não existir, cria uma nova conversa e a retorna usando o resolve
    pageChatService.find({ contextId: input.contextId }, (err, data) => {
        if (err || data.length == 0 || data == undefined) {

            let pageChat = new pageChatService({
                input: input.message || undefined,
                session_id: undefined,
            });
            pageChat.session_id = pageChat._id; //define a sessão como o ID do objeto (tem que ser único, o _id é unico pelo mongoDB)

            resolve(pageChat);
        }
        else { // Se existir, retorna a conversa encontrada usando o resolve
            pageChat = data[0];
            pageChat.input = input.message || undefined,
            resolve(pageChat);
        }
    })
});

// Utilizando a resposta do Watson, cria novas questões dentro da reposta.
detectarProduto = (response) => new Promise((resolve, reject) => {
    allSearchs = [] // Lista que armazenará todas as promisses que tem que ser resolvidas.

    // Se existir uma inteção e ela for #Comprar
    if (response.intents.length > 0 && response.intents[0].intent == 'Comprar') {
        // Vou varrer todas as entidades procurando por produto
        for (let index = 0; index < response.entities.length; index++) {
            // Achei um produto
            if (response.entities[index].entity == 'produto') {
                let search;
                // Pego o nome dos produtos completo baseando na localização de caracteres que o watson fornece.
                if (index + 1 < response.entities.length) {
                    search = response.input.text.substring(
                        response.entities[index].location[0],
                        response.entities[index + 1].location[0]
                    )
                }
                // Se tiver só um produto na lista de entidades, essa é a forma simples de pegá-lo.
                else {
                    search = response.input.text.substring(
                        response.entities[index].location[0]
                    )
                }
                // Vou adicionar na minha lista, a nova busca que vou fazer deste produto
                allSearchs.push(new Promise((resolve, reject) => {
                    // Busco esse nome (que está na variável search) utilizando um regex
                    ProdutosService.find({ "name": { "$regex": search.trim(), "$options": "i" } }, (err, data) => {
                        // Se não achei, contateno a mensagem de que não foi encontrado aquele.
                        if (err || data.length == 0 || data == undefined) {
                            response.output.text[0] += ", Este outro produto não foi encontrado.";
                            resolve(response); //Return da promisse
                        }
                        // Caso ache, eu coloco na lista de contexto items e adiciono o nome do produto na mensagem de usuário.
                        else {
                            // Se eu tenho uma lista, adiciono a ela, se a lista não existe, crio ela.
                            response.context.hasOwnProperty("itens") && response.context.itens != '' ? response.context.itens.push(data[0]) : response.context.itens = [data[0]];
                            response.output.text[0] += ` ${data[0].name}, `; // Adicionando nome do produto na mensagem.
                            resolve(response); //Return da promisse
                        }
                    });
                }));
            }
        }
        // Depois de achar todos os produtos que busquei, simplesmente resolvo a função principal (detectarProduto).
        Promise.all(allSearchs).then((res) => {
            resolve(response); // Return da promise detectarProduto
        });
    }
    // Se a inteção for #ver_carrinho
    else if (response.intents.length > 0 && response.intents[0].intent == 'ver_carrinho') {
        // Pego todos os itens do meu carrinho que são objetos, e exibo seus nomes usando o map do nodejs.
        if (response.context.hasOwnProperty("itens") && response.context.itens != '') {
            response.output.text[0] += ` Eles são: ${response.context.itens.map(item => item.name).join(', ')}`;
        }
        resolve(response); // Return da promise detectarProduto 
    }
    // Se a inteção for #remover_carrinho
    else if (response.intents.length > 0 && response.intents[0].intent == 'remover_carrinho') {
        let tem_numero = false;
        // Vejo se meu carrinho tem algum item
        if (response.context.hasOwnProperty("itens") && response.context.itens != '') {
            response.entities.forEach(entity => {
                // Vejo se o usuário informou algum numero.
                if (entity.entity == 'sys-number') {
                    let pos = parseInt(entity.value);
                    // Removo do carrinho, a posição informada pelo usuároio
                    response.context.itens.splice(pos-1, 1);
                    tem_numero = true;                }
            });
        }
        else {
            response.output.text[0] = "Não tem nada no seu carrinho!";
        }

        if (!tem_numero) {
            response.output.text[0] = "Você precisa me informar um número";
        }

        resolve(response); // Return da promise detectarProduto
    }
    else {
        resolve(response); // Return da promise detectarProduto
    }
});

module.exports.analisarResponderMensagem = (input) => new Promise((resolve, reject) => {P
    // Primeiro, checo na entrada do usuário, se ele me passou um contextId, e retorno o novo ou antigo usuário dele (user)
    construirCenario(input).then((user) => {
        // envio ao watson a sessão do usuário e a mensagem que ele informou para análise.
        assistant.message({
            workspace_id: process.env.WATSON_WORKSPACE_ID,
            session_id: user.session_id,
            context: user.context,
            input: user.input
        },
            (err, res) => { // checo os erros e resposta do watson
                // Se tiver algum erro, simplesmente falho a promisse
                if (err) {
                    reject(err);
                }
                else {
                    detectarProduto(res).then((resp) => { 
                    // se tiver ok passo para o detectarProduto fazer as devidas alterações e retornar uma nova resposta (resp)

                        //Adiciono a nova mensagem do usuário no objeto do banco user
                        user.messages.push({
                            message: input.message.text
                        });

                        // Armazeno o fluxo de contexto da conversação que foi obtida como respota do watson na sessão do usuário.
                        user.context = resp.context;
                        user.save() //Salvo o novo usuário no banco de dados (com a nova mensagem e o novo contexto).

                        resolve([user, resp]); // retorno o objeto usuário e o objeto de resposta do watson.
                    });
                }
            });
    })
});