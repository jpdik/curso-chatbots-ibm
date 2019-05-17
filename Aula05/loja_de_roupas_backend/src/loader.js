/* 
    Este é o arquivo de iniciação da aplicação
    
    No primero import, rodamos o servidor express e o armazenamos em uma constante.
    
    No segundo, iniciamos a conexão com o nosso banco de dados.

    No terceiro import, passamos a instância do servidor para o arquivo routes, para
    que ele possa criar as novas rotas que nosso servidor vai ter.
*/
const server = require('./config/server')
require('./config/database')
require('./config/routes')(server)