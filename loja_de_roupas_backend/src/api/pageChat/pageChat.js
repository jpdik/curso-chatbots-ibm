const restful = require('node-restful')
const mongoose = restful.mongoose

const messageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    base: { type: String, default: 'sent' },
    sendAt: { type: Date, default: Date.now }
})

const pageChatSchema = new mongoose.Schema({
    session_id: { type: String },
    context: {},
    userName: { type: String },
    input: {},
    messages: [messageSchema]
}, { usePushEach: true })

/* Estrutura que terá cada novo chat.
    Exemplo:
    {
        "context": {}
        "input": {
            "text":"meu carrinho"
        },
        "session_id": "5cd86922ec890655869be80c"
        "messages": [
            { 
                "message":"carrinho",
                "sendAt":"2019-05-12T18:42:43.758Z",
                "base":"sent"
            },
            {
                "message":"Você tem 0 produtos no seu carrinho. ",
                "sendAt":"2019-05-12T18:42:43.760Z",
                "base":"received"
            }
        ]
    }
*/

// Cria o modelo do esquema (rest) e o exporta
module.exports = restful.model('PageChat', pageChatSchema)