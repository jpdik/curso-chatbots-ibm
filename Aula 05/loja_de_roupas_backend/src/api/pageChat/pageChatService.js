const PageChat = require('./pageChat') // Obtém o esquema de produtos (modelo de dados)

PageChat.methods(['get', 'post', 'put', 'delete']) //informa quais tipos de requisições serão permitidos 
PageChat.updateOptions({new: true, runValidators: true}) //Somente retorne o objeto novo inserido e use as validações do esquema

module.exports = PageChat //Exporta o serviço completo