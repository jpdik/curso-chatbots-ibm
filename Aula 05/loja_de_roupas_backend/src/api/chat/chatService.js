const chat = require('./chat') // Obtém o esquema de produtos (modelo de dados)

chat.methods(['get', 'post', 'put', 'delete']) //informa quais tipos de requisições serão permitidos 
chat.updateOptions({new: true, runValidators: true}) //Somente retorne o objeto novo inserido e use as validações do esquema

module.exports = chat //Exporta o serviço completo