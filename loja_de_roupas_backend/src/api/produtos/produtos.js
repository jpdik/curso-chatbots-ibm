const restful = require('node-restful')
const mongoose = restful.mongoose

const produtosSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imgUrl: { type: String, required: true },
    value: { type: Number, min: 0, required: true }, 
})

/* Estrutura que terá.
    Exemplo:
    {
        "name":"Camiseta Basica Masculina - Preto",
        "imgUrl":"https://static.zattini.com.br/produtos/camiseta-basica-masculina/06/FTL-0002-006/FTL-0002-006_zoom1.jpg",
        "value":25
    }
*/

module.exports = restful.model('Produtos', produtosSchema)