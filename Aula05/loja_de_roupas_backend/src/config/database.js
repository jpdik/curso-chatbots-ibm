// Cria uma conexão com o banco de dados e exporta.

const mongoose = require('mongoose')
mongoose.Promise = global.Promise
module.exports = mongoose.connect('mongodb://localhost/loja_de_roupas', {useMongoClient: true})