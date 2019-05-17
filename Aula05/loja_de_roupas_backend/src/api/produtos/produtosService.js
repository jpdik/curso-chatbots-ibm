const produtos = require('./produtos') // Obtém o esquema de produtos (modelo de dados)

produtos.methods(['get', 'post', 'put', 'delete']) //informa quais tipos de requisições serão permitidos 
produtos.updateOptions({new: true, runValidators: true}) //Somente retorne o objeto novo inserido e use as validações do esquema

module.exports = produtos //Exporta o serviço completo