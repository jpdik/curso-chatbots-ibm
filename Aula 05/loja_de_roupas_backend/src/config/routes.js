const express = require('express') //Express para criarmos as rotas
const chatBot = require('../api/chatBot/chatBot') //Funções para o serviço Watson
const chatService = require('../api/chat/chatService') //Serviço o objeto que representa a mensagem de Chat (CRUD)
const produtosService = require('../api/produtos/produtosService') //Serviço de produtos (CRUD)

/* O modulo que será exportado, recebe um parametro, que é a instância do servidor que já
    está rodando, para que sejam adicionados as novas rotas.
*/
module.exports = function (server) {

    const api = express.Router()
    server.use('/api', api) //Obriga que todas as rotas em api usem o prefixo /api
    //Exemplo: http://localhost:3003/api

    // rota de inserção (manualmente construida) de mensagem no banco de dados chatService
    api.post('/chat', (req, res) => { // http://localhost:3003/api/chat (POST)

        // Verifica se a requisição (req) tem alguma mensagem em seu corpo
        if (!req.body.message) {
            res.status(403).send({ errors: ['No message provided.'] })
            /*Responde ao usuário 403 (Forbidden),
            informando em JSON que não foi fornecida nenhuma mensagem */
            return;
        }

        // Chama a função que vai analisar a mensagem do usuário, e responder
        chatBot.analisarConstruirMensagem({
            session_id: req.body.session_id, //id do contexto que será verificado para continuar a conversa
            message: {
                text: req.body.message //Mensagem que o usuário forneceu.
            }
        })
            .then((user) => { // Assim que a função finalizar, ela vai retornar o objeto novo de user, e toda a resposta do watson nova.

                // Salva o novo objeto do usuário no banco de dados que contém todas as repostas do watson.
                user.save((err) => {
                    if (err) {
                        console.log(err);
                        res.send(err);
                        // Se der erro, repsonde com o erro do porque não pode ser salvo no banco de dados
                    } else {
                        res.status(201).json(user);
                        // Responde ao usuario com o novo objeto user, onde ele contém todas as mensagens e contexto da conversa.
                    }
                })
            })
    })

    /* Gera o CRUD do chatService na rota http://localhost:3003/api/chat 
        Agora temos acesso a essa rota com GET(Obter), POST(Criar), PUT(Modificar) e DELETE(Remover).
    */
    chatService.register(api, '/chat')

    /* Gera o CRUD do produtosService na rota http://localhost:3003/api/produtos 
        Agora temos acesso a essa rota com GET(Obter), POST(Criar), PUT(Modificar) e DELETE(Remover).
    */
    produtosService.register(api, '/produtos')
}