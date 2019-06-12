require('dotenv').config() //Obtem as variáveis de ambiente do arquivo '.env'
const AssistantV1 = require('ibm-watson/assistant/v1');
const chatService = require('../chat/chatService')
const produtosService = require('../produtos/produtosService')

// Configuração do asistente do IBM Watson (Chaves)
// todo process.env.<VALOR> é uma variável de ambiente
const assistant = new AssistantV1({
    username: process.env.WATSON_USERNAME,
    password: process.env.WATSON_PASSWORD,
    version: process.env.WATSON_VERSION
});

/* Função que retorna um objeto que representa a conversa do usuário no banco.
    Caso não exista uma conversa, esta função a cria.
    Ela é uma promise, então ela roda em segundo plano para ser resolvida.
*/
iniciarOuContinuarConversa = (input) => new Promise((resolve, reject) => {
    // Pesquisa o contextID informado, se não existir, cria uma nova conversa e a retorna usando o resolve
    chatService.find({ session_id: input.session_id }, (err, data) => {
        if (err || data.length == 0 || data == undefined) {

            let chat = new chatService({
                input: input.message || undefined,
                session_id: undefined,
            });
            chat.session_id = chat._id; //define a sessão como o ID do objeto (tem que ser único, o _id é unico pelo mongoDB)

            resolve(chat);
        }
        else { // Se existir, retorna a conversa encontrada usando o resolve
            chat = data[0];
            chat.input = input.message || undefined,
                resolve(chat);
        }
    })
});

// Utilizando a resposta do Watson, cria novas questões dentro da reposta.
reconstruirIntencoesEntidadesContexto = (watsonObject) => new Promise((resolve, reject) => {
    // Se existir uma inteção e ela for #Comprar
    if (watsonObject.intents.length > 0 && watsonObject.intents[0].intent == 'Comprar') {
        allSearchs = [] // Lista que armazenará todas as promisses que tem que ser resolvidas.
        // Vou varrer todas as entidades procurando por produto
        for (let index = 0; index < watsonObject.entities.length; index++) {
            // Achei um produto
            if (watsonObject.entities[index].entity == 'produto') {
                let search;
                // Pego o nome dos produtos completo baseando na localização de caracteres que o watson fornece.
                if (index + 1 < watsonObject.entities.length) {
                    search = watsonObject.input.text.substring(
                        watsonObject.entities[index].location[0],
                        watsonObject.entities[index + 1].location[0]
                    )
                }
                // Se tiver só um produto na lista de entidades, essa é a forma simples de pegá-lo.
                else {
                    search = watsonObject.input.text.substring(
                        watsonObject.entities[index].location[0]
                    )
                }
                // Vou adicionar na minha lista, a nova busca que vou fazer deste produto
                allSearchs.push(new Promise((resolve, reject) => {
                    // Busco esse nome (que está na variável search) utilizando um regex
                    produtosService.find({ "name": { "$regex": search.trim(), "$options": "i" } }, (err, data) => {
                        // Se não achei, contateno a mensagem de que não foi encontrado aquele.
                        if (err || data.length == 0 || data == undefined) {
                            watsonObject.output.text[0] += ", Este outro produto não foi encontrado.";
                            resolve(watsonObject); //Return da promisse
                        }
                        // Caso ache, eu coloco na lista de contexto items e adiciono o nome do produto na mensagem de usuário.
                        else {
                            // Se eu tenho uma lista, adiciono a ela, se a lista não existe, crio ela.
                            watsonObject.context.hasOwnProperty("itens") && watsonObject.context.itens != '' ? watsonObject.context.itens.push(data[0]) : watsonObject.context.itens = [data[0]];
                            watsonObject.output.text[0] += ` ${data[0].name}, `; // Adicionando nome do produto na mensagem.
                            resolve(watsonObject); //Return da promisse
                        }
                    });
                }));
            }
        }
        // Depois de achar todos os produtos que busquei, simplesmente resolvo a função principal (reconstruirIntencoesEntidadesContexto).
        Promise.all(allSearchs).then(() => {
            resolve(watsonObject); // Return da promise reconstruirIntencoesEntidadesContexto
        });
    }
    // Se a inteção for #ver_carrinho
    else if (watsonObject.intents.length > 0 && watsonObject.intents[0].intent == 'ver_carrinho') {
        // Pego todos os itens do meu carrinho que são objetos, e exibo seus nomes usando o map do nodejs.
        if (watsonObject.context.hasOwnProperty("itens") && watsonObject.context.itens != '') {
            watsonObject.output.text[0] += ` Eles são: ${watsonObject.context.itens.map(item => item.name).join(', ')}`;
        }
        resolve(watsonObject); // Return da promise reconstruirIntencoesEntidadesContexto 
    }
    // Se a inteção for #remover_carrinho
    else if (watsonObject.intents.length > 0 && watsonObject.intents[0].intent == 'remover_carrinho') {
        let tem_numero = false;
        // Vejo se meu carrinho tem algum item
        if (watsonObject.context.hasOwnProperty("itens") && watsonObject.context.itens != '') {
            watsonObject.entities.forEach(entity => {
                // Vejo se o usuário informou algum numero.
                if (entity.entity == 'sys-number') {
                    let pos = parseInt(entity.value);
                    // Removo do carrinho, a posição informada pelo usuário
                    watsonObject.context.itens.splice(pos - 1, 1);
                    tem_numero = true;
                }
            });
        }
        else {
            watsonObject.output.text[0] = "Não tem nada no seu carrinho!";
        }

        if (!tem_numero) {
            watsonObject.output.text[0] = "Você precisa me informar um número";
        }

        resolve(watsonObject); // Return da promise reconstruirIntencoesEntidadesContexto
    }
    else {
        resolve(watsonObject); // Return da promise reconstruirIntencoesEntidadesContexto
    }
});

module.exports.analisarConstruirMensagem = (input) => new Promise((resolve, reject) => {
    // Primeiro, checo na entrada do usuário, se ele me passou um contextId, e retorno o novo ou antigo usuário dele (user)
    iniciarOuContinuarConversa(input).then((user) => {
        // envio ao watson a sessão do usuário e a mensagem que ele informou para análise.
        assistant.message({
            workspace_id: process.env.WATSON_WORKSPACE_ID,
            session_id: user.session_id,
            context: user.context,
            input: user.input
        })
            .then((res) => { // checo os erros e resposta do watson
                reconstruirIntencoesEntidadesContexto(res).then((resp) => {
                    // se tiver ok passo para o reconstruirIntencoesEntidadesContexto fazer as devidas alterações e retornar uma nova resposta (resp)

                    //Adiciono a nova mensagem do usuário no objeto do banco user
                    user.messages.push({
                        message: input.message.text
                    });

                    resp.output.text.forEach(message => {
                        //adicionando uma mensagem na lista.
                        user.messages.push({
                            message: message,
                            base: 'received'
                        });
                    });

                    // Armazeno o fluxo de contexto da conversação que foi obtida como respota do watson na sessão do usuário.
                    user.context = resp.context;

                    resolve(user); // retorno o objeto usuário e o objeto de resposta do watson.
                });

            }).catch((err) => {
                console.log(err);
                reject(err);
            });
    })
});