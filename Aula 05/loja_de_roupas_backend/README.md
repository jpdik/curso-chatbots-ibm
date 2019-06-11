# Loja de roupas (Backend)
Projeto para construção de backend do curso de chatbots

### Instalando NVM e NPM

Vamos primeiramente instalar o [nvm](https://github.com/nvm-sh/nvm) (Node version managem) usando CURL para instalarmos uma versão do nodejs juntamente com o [npm]() (Node package manager):

```shell
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
```

Após instalar o nvm, vamos instalar o NodeJS:

```shell
$ nvm install v8.15.1
```

### Inicializando projeto

Após iniciar um projeto pelo git, dentro da pasta de nosso projeto, vamos iniciar o package.json usando o comando:

```shell
$ npm init -y
```

### Instalando dependencias

Vamos instalar as dependências do nosso projeto com o comando:

```shell
$ npm install body-parser@1.15.2 dotenv@6.2.0 express@4.14.0 express-query-int@1.0.1 mongoose@4.7.0 node-restful@0.2.5 nodemon@1.11.0 pm2@2.1.5 watson-developer-cloud@3.15.1 --save
```

Onde:
- [`body-parser`](https://www.npmjs.com/package/body-parser): Realiza um parse (conversão) dos dados da requisição de forma a converter o dado original (string), em seus devidos formatos (JSON, XML, urlencoded, etc);
- [`dotenv`](https://www.npmjs.com/package/dotenv): Permite criar um arquivo .env na pasta raiz do projeto para simular variáveis de ambiente;
- [`express`](https://expressjs.com/pt-br/): Framework web para desenvolver aplicativos ou APIs de forma rápida, flexível e minimalista;
- [`express-query-int`](https://www.npmjs.com/package/express-query-int): Modulo responsável por converter argumentos de url em objeto;
- [`mongoose`](https://mongoosejs.com/): O Mongoose fornece uma solução direta e baseada em esquema para modelagem de dados. Ele inclui validação de dados, construção de consulta, ganchos de lógica de negócios e muito mais;
- [`node-restful`](https://github.com/baugarten/node-restful): Jutamente com o mongoose, ele permite gerar recursos e rotas RESTful automaticamente (GET, POST, PUT, DELETE);
- [`nodemon`](https://nodemon.io/): é uma ferramenta que monitora as mudanças do servidor que esta rodando e reinicia o serviço automaticamente durante as mudanças. Perfeito para desenvolvimento;
- [`pm2`](http://pm2.keymetrics.io/): Gerenciador de processos em produção para o NodeJS;
- [`watson-developer-cloud`](https://github.com/watson-developer-cloud/node-sdk): Biblioteca responsável pelas comunicações com o watson da IBM;

### Criando scripts

Em nosso `package.json`, vamos criar scripts para realizar a execução de nosso projeto de forma fácil.

Em `"scripts"` vamos criar nossos comandos para rodar os serviços:

```js
"scripts": {
    "dev": "nodemon",
    "production": "pm2 start src/loader.js --name chat_api",
    "production-stop": "pm2 stop chat_api"
}
```

### Referênciando inicio da aplicação

Vamos referênciar o arquivo onde o `nodemon` deve buscar a entrada (primeiro arquivo a ser executado, a entrada da nossa aplicação), no parâmetro `"main"`:

```js
"main": "src/loader.js",
```

### Definindo engines padrões

Também vamos definir as versões que estamos utilizando do `NodeJS` e `npm` no parâmetro `"engines"`:

```js
"engines": {
    "node": "8.15.1",
    "npm": "6.4.1"
}
```

Nosso `package.json` final deverá ficar assim:

```js
{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "src/loader.js",
  "scripts": {
    "dev": "nodemon",
    "production": "pm2 start src/loader.js --name chat_api",
    "production-stop": "pm2 stop chat_api"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "body-parser": "^1.15.2",
    "dotenv": "^6.2.0",
    "express": "^4.14.0",
    "express-query-int": "^1.0.1",
    "mongoose": "^4.7.0",
    "node-restful": "^0.2.5",
    "nodemon": "^1.11.0",
    "pm2": "^2.1.5",
    "watson-developer-cloud": "^3.15.1"
  },
  "engines": {
    "node": "8.15.1",
    "npm": "6.4.1"
  }
}
```

## Ignorando arquivos desnecessários

Não precisamos enviar para nosso repositório no GitHub a pasta `node_modules` nem os arquivos de `.log`, principalmente não devemos enviar nenhum segredo da aplicação (`.env`) então vamos criar um arquivo `.gitignore` na raiz do nosso projeto para evitar o envio desses arquivos.

Arquivo `.gitignore`:

```
node_modules
*.log
.env
```

Ao baixar nosso projeto novamente, podemos recuperar as dependencias de `node_modules` utilizando o comando:

```shell
$ npm i
```

Ele irá utilizar o arquivo `package.json` para identificar e baixar as dependências.
Já o `.env` deverá ser preenchido novamente. Alguns gostam de manter um arquivo de exemplo para facilitar. Por exemplo:

Arquivo `.env.example`:

```
WATSON_WORKSPACE_ID=
WATSON_VERSION=
WATSON_USERNAME=
WATSON_PASSWORD=
MONGODB_URI=
```

Com isso basta copiarmos o arquivo de exemplo, renomearmos ele para `.env` e preencher com os segredos.

# Desenvolvendo da aplicação

## Entrada da aplicação

Dentro do nosso arquivo em `src/loader.js` teremos 3 entradas:

```js
const server = require('./config/server')
require('./config/database')
require('./config/routes')(server) 
```

1. Criamos o express dentro de `src/config/server.js` e retornamos para a variável `server`;
2. Criamos a conexão com banco de dados do MongoDB;
3. Criamos as rotas de acesso a aplicação, passando a instância do express (que está em `server`) para o arquivo `src/config/routes.js`;

### Arquivo `src/config/cors.js`

Vamos criar um middleware chamado de `cors` em `src/config/cors.js`. Ele será responsável por definir um meio para o nosso servidor permitir que seus recursos sejam acessados por uma página web de um domínio diferente.

O final (`src/config/cors.js`) ficará assim:

```js
module.exports = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
}
```

- `module.exports`: essa propriedade do NodeJS permite que o recurso seja importado em outros arquivos utilizando `require`.

- function(`req`): obtém as propriedades da requisição feita pelo usuário, como cabeçalhos, corpo.

- function(`res`): são as propriedades da requisição que será envida de volta ao usuário, como cabeçalhos, corpo.

- function(`next`): função que permite passar a responsabilidade de aplicar outras coisas (outros middlewares) a frente. Se `next()` não for chamado, a função deve finalizar a requisição usando um `res.send` ou ela ficará travada.

### Arquivo `src/config/server.js`

Aqui é onde iniciamos o servidor que terá as rotas para acesso a aplicação. Inicialmente só iremos criar um objeto que permitirá a conexão do nosso servidor pela rede local (`localhost`), porém não haverá rotas ainda. Então se tentarmos acessar a aplicação, Só teremos como retorno uma resposta `404` (not found ou Cannot GET).

Primeiro vamos criar um objeto que terá as informações de inicialização da conexão do servidor (endereço e porta). Vamos rodar o serviço em rede local (`localhost`) e vamos usar 2 confirações na porta.

```js
const options = {
    host: "localhost",
    port: process.env.PORT || 3003
};
```

Se a variável de ambiente `PORT` não estiver definida, o operador OU (`||`) forçará a chave `port` do objeto a ter valor `3003`.

Depois vamos referenciar todas as bibliotecas que utilizaremos como middlewares do nosso servidor, assim como a própria biblioteca do servidor (`express`). Inclusive o `cors.js` que é um middleware que nós mesmo criamos:

```js
const bodyParser = require('body-parser')
const express = require('express')
const allowCors = require('./cors')
const queryParser = require('express-query-int')
```

Agora criamos a instancia inicial do nosso servidor utilizando a constante `express`:

```js
const server = express()
```

Agora nos aplicamos os middlewares ao nosso servidor usando a função `use()` do express, no qual ela recebe as funções dos middlewares, que são as próprias constantes ou funções internas a elas (vai depender de cada middleware).

Por exemplo, nosso `cors` retorna uma função, então simplesmente passamos sua constante.

```js
server.use(bodyParser.urlencoded({ extended: true })) 
server.use(bodyParser.json()) 
server.use(allowCors) 
server.use(queryParser())
```

Após todas as configurações vamos iniciar o servidor usando o método `listen()` do express. Para ele passando a constante `options` com as configurações de IP e porta que definimos para nosso serviço, por fim, o segundo parametro é uma `callback anônima` que ele retorna com informações de sucesso ou não do nosso servidor. assim passamos uma mensagem via console para confirmar nosso serviço rodando naquele `IP:Porta`:

```js
server.listen(options, function(){
    console.log(`Backend está rodando em http://${options.host}:${options.port}/`);
})
```

Por fim, exportamos nosso objeto do servidor (`server`) instanciado utilizando o `module.exports` para que outros arquivos possam utilizá-lo:

```js
module.exports = server
```

Nosso arquivo final (`src/config/server.js`) ficará assim:

```js
const options = {
    host: "localhost",
    port: process.env.PORT || 3003
};

const bodyParser = require('body-parser')
const express = require('express')
const produtosMock = require('../api/produtos/produtosMock')
const allowCors = require('./cors')
const queryParser = require('express-query-int')

const server = express()

server.use(bodyParser.urlencoded({ extended: true })) 
server.use(bodyParser.json()) 
server.use(allowCors) 
server.use(queryParser())

server.listen(options, function(){
    console.log(`Backend está rodando em http://${options.host}:${options.port}/`);
})

module.exports = server
```

### Arquivo `src/config/database.js`

Vamos agora criar uma conexão com nosso banco de dados MongoDB.

Primeiro obtemos as variáveis de ambiente (do arquivo `.env`) que simulamos que podemos definir conexões de banco nela (URI, User, Senha).

```js
require('dotenv').config()
```

Agora vamos referenciar a biblioteca do MongoDB utilizando o mongoose:

```js
const mongoose = require('mongoose')
```

Criamos uma promise global para que nosso banco de dados possa ser chamado de qualquer lugar da nossa aplicação:

```js
mongoose.Promise = global.Promise
```

Definimos uma uri para nosso banco de dados utilizando o operador OU (`||`) novamente. Se existir a variavel de ambiente `MONGODB_URI` a utilizamos, caso contrário usamos o valor padrão `mongodb://localhost/loja_de_roupas`, que utiliza o banco local como database usando o nome `loja_de_roupas`:

```js
const uri = process.env.MONGODB_URI || 'mongodb://localhost/loja_de_roupas'
```

Por fim, iniciamos a conexão. A exportação é opcional, somente se quiser obter algum detalhe sobre a conexão:

```js
module.exports = mongoose.connect(uri, {useMongoClient: true})
```

Nosso arquivo final (`src/config/database.js`) ficará assim:

```js
require('dotenv').config()
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const uri = process.env.MONGODB_URI || 'mongodb://localhost/loja_de_roupas'

module.exports = mongoose.connect(uri, {useMongoClient: true})
```

## Gerando nossos modelos de dados e suas REST's

Vamos utilizar a biblioteca `node-restful` que funciona juntamente com o `mongoose` para gerar as 4 rotas (`GET`, `POST`, `PUT`, `DELETE`) automaticamente, sem necessidade de criar uma por uma, além de possuir varias funcionalidades.

### Arquivo `src/api/produtos/produtos.js`

Vamos utilizar o `mongoose` para gerar os `schemas` de objetos. Isso permite que nós tenhamos modelos de dados que sejam validados pelo nosso banco, sem a necessidade de ficar fazendo uma validação manualmente (verificar tipo, tamanho, etc).

Primeiramente obtemos a instancia do node-restful, e obtemos o modelo do esquema de mongoose que se encontra dentro dele, e colocamos no arquivo `src/api/produtos/produtos.js`:

```js
const restful = require('node-restful')
const mongoose = restful.mongoose
```

Depois instanciamos modelo de `mongoose.Schema` no qual passamos um objeto que será o nosso modelo, juntamente com o que será validado nele:

```js
const produtosSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imgUrl: { type: String, required: true },
    value: { type: Number, min: 0, required: true }, 
})
```

Sendo:

- `name`: Variável onde representará o nome do produto. Deve ser uma string, e é obrigatória (`required: true`);
- `imgUrl`: Variável onde representará a url de imagem de um produto. Deve ser uma string e também e obrigatória (`required: true`);
- `value`: Variável que representará o valor monetário de um produto. Deve ser do tipo número. Valor minimo é 0 (não pode ser negativo). Campo é obrigatório (`required: true`);

Por fim, exportamos essa constante criada (`produtosSchema`) como um model restful, e damos um nome ao modelo como `'Produtos'`:

```js
module.exports = restful.model('Produtos', produtosSchema)
```

Nosso arquivo final (`src/api/produtos/produtos.js`) ficará assim:

```js
const restful = require('node-restful')
const mongoose = restful.mongoose

const produtosSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imgUrl: { type: String, required: true },
    value: { type: Number, min: 0, required: true }, 
})

module.exports = restful.model('Produtos', produtosSchema)
```

### Arquivo `src/api/produtos/produtosService.js`

Depois de criar nosso model restful em `src/api/produtos/produtos.js`, vamos utilzar esse model para gerar nossas rotas (`GET`, `POST`, `PUT`, `DELETE`) e depois exportamos o mesmo objeto para que nosso servidor possa registrar essas rotas, assim permitindo acesso a elas pelo nosso servidor (`localhost`).

Primeiro vamos importar nosso modelo do arquivo criado (`src/api/produtos/produtos.js`) no arquivo `src/api/produtos/produtosService.js`:

```js
const produtos = require('./produtos')
```

Assim informamos quais rotas queremos gerar para esse `model`, utilizando a função `methods()` que vem do node-restful, que veio dentro dessa constante `produtos`:

```js
produtos.methods(['get', 'post', 'put', 'delete'])
```

Lembrando:
- `GET`: Requisição para obter informações;
- `POST`: Requisição para criar informações;
- `PUT`: Requisição para alterar informações;
- `DELETE`: Requisição para remover informações;

Para mais detalhes do que cada requisição pode fazer, visite [aqui](https://github.com/baugarten/node-restful).

Depois atualizamos as opções do nosso modelo rest utilizando a função `updateOptions()`:

```js
produtos.updateOptions({new: true, runValidators: true})
```

Sendo as opções passadas por um objeto para ele:

- `new`: Quando passamos `true`, falamos para nosso modelo que quando algo for criado ou alterado, queremos que ele retorne o novo objeto que foi gravado no banco, caso seja `false` ele retornará o objeto antigo, antes da alteração.

- `runValidators`: Quando passamos `true`, forçamos que nosso banco utilize as validações que foram definidas no `Schema`. Caso seja `false` ele não validará o nosso banco.

Por fim, exportamos nosso modelo atualizado:

```js
module.exports = produtos
```

Nosso arquivo final (`src/api/produtos/produtosService.js`) ficará assim:

```js
const produtos = require('./produtos')

produtos.methods(['get', 'post', 'put', 'delete']) 
produtos.updateOptions({new: true, runValidators: true})

module.exports = produtos
```

### Arquivo `src/api/chat/chat.js`

Novamente vamos utilizar o `mongoose` para gerar os `schemas` de objetos. Isso permite que nós tenhamos modelos de dados que sejam validados pelo nosso banco, sem a necessidade de ficar fazendo uma validação manualmente (verificar tipo, tamanho, etc).

Primeiramente obtemos a instancia do node-restful, e obtemos o modelo do esquema de mongoose que se encontra dentro dele, e colocamos no arquivo `src/api/chat/chat.js`:

```js
const restful = require('node-restful')
const mongoose = restful.mongoose
```

Depois instanciamos modelo de `mongoose.Schema` no qual passamos um objeto que será o nosso modelo, juntamente com o que será validado nele. Neste caso teremos dois modelos, um que representa a conversa do usuario, e dentro dele uma lista de mensagens, que também tem uma estrutura própria:

```js
const messageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    base: { type: String, default: 'sent' },
    sendAt: { type: Date, default: Date.now }
})

const chatSchema = new mongoose.Schema({
    session_id: { type: String },
    context: {},
    userName: { type: String },
    input: {},
    messages: [messageSchema]
}, { usePushEach: true })
```

Sendo no `messageSchema`:

- `message`: Variável onde representará uma mensagem. Deve ser uma string, e é obrigatória (`required: true`);
- `base`: Variável onde representará uma condicional de uma mensagem (se ela foi enviada, ou recebida). Deve ser uma string e também e obrigatória (`required: true`). Caso não seja preenchida, o banco preencherá automaticamente utilizando o valor de `default`;
- `sendAt`: Variável que representará a data que a mensagem foi enviada. Deve ser do tipo Date. Campo não é obrigatório e tem como valor o valor do campo `default` caso não seja preenchido;

E no `chatSchema`:

- `session_id`: Variável onde representa a sessão do usuário. Deve ser uma string. Não é obrigatória, pois se for a primeira conversa, o usuário ainda não terá uma sessão;
- `context`: Variável onde representará o objeto de contexto de conversação do watson. É um objeto vazio, porque isso depende da estrutura do `Watson`. Então não terá nenhuma validação; 
- `userName`: Variável que representará o nome do usuáro. Deve ser do tipo string e não é obrigatória, já que o usuário pode não querer se identificar;
- `input`: Variável onde representará objeto com informações de mensagem que será entrada da conversa do usuário. Também não possui validações porque também depende da estrutura do `Watson`;
- `messages`: Uma lista de utiliza objetos do `messageSchema`. Este será o histórico de conversas do nosso chat. será validado utilizando o `Schema` passado, ou seja, todo objeto inserido nessa lista, deve respeitar as regras que foram impostas por `messageSchema`;

Por fim, exportamos a constante criada (`messageSchema`) como um model restful, e damos um nome ao modelo como `'Chat'`:

```js
module.exports = restful.model('Chat', chatSchema)
```

Nosso arquivo final (`src/api/chat/chat.js`) ficará assim:

```js
const restful = require('node-restful')
const mongoose = restful.mongoose

const messageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    base: { type: String, default: 'sent' },
    sendAt: { type: Date, default: Date.now }
})

const chatSchema = new mongoose.Schema({
    session_id: { type: String },
    context: {},
    userName: { type: String },
    input: {},
    messages: [messageSchema]
}, { usePushEach: true })

module.exports = restful.model('Chat', chatSchema)
```

### Arquivo `src/api/chat/chatService.js`

Depois de criar nosso model restful em `src/api/chat/chat.js`, vamos utilzar novamente esse model para gerar nossas rotas (`GET`, `POST`, `PUT`, `DELETE`) e depois exportamos o mesmo objeto para que nosso servidor possa registrar essas rotas, assim permitindo acesso a elas pelo nosso servidor (`localhost`).

Primeiro vamos importar nosso modelo do arquivo criado (`src/api/chat/chat.js`) no arquivo `src/api/chat/chatService.js`:

```js
const chat = require('./chat')
```

Assim informamos quais rotas queremos gerar para esse `model`, utilizando a função `methods()` que vem do node-restful, que veio dentro dessa constante `chat`:

```js
chat.methods(['get', 'post', 'put', 'delete'])
```

Lembrando:
- `GET`: Requisição para obter informações;
- `POST`: Requisição para criar informações;
- `PUT`: Requisição para alterar informações;
- `DELETE`: Requisição para remover informações;

Depois atualizamos as opções do nosso modelo rest utilizando a função `updateOptions()`:

```js
chat.updateOptions({new: true, runValidators: true})
```

Sendo as opções passadas por um objeto para ele:

- `new`: Quando passamos `true`, falamos para nosso modelo que quando algo for criado ou alterado, queremos que ele retorne o novo objeto que foi gravado no banco, caso seja `false` ele retornará o objeto antigo, antes da alteração.

- `runValidators`: Quando passamos `true`, forçamos que nosso banco utilize as validações que foram definidas no `Schema`. Caso seja `false` ele não validará o nosso banco.

Por fim, exportamos nosso modelo atualizado:

```js
module.exports = chat
```

Nosso arquivo final (`src/api/chat/chatService.js`) ficará assim:

```js
const chat = require('./chat')

chat.methods(['get', 'post', 'put', 'delete'])
chat.updateOptions({new: true, runValidators: true})

module.exports = chat
```

## Registrando as REST's dos Model's no Express

Com isso agora, temos rotas para serem usadas, tanto de nossos produtos, como algo que representa um usuário de chat. Agora temos que registrá-las em nosso `express`.

Para isso, vamos ao terceiro arquivo que foi está sendo usado em `src/loader.js`, próprio para registrar as rotas (`src/config/routes.js`).

Primeiramente vamos importar a biblioteca `express` em `src/config/routes.js` que é a principal para criar os serviços de uma API e todas as bibliotecas que criamos que vamos precisar (`chatService` e `produtosService`):

```js
const express = require('express')
const chatService = require('../api/chat/chatService') 
const produtosService = require('../api/produtos/produtosService') 
```

Como nosso módulo recebe a instância que está rodando do express de `src/config/server.js` precisamos criar um export que recebe essa instância por parâmetro como uma função:

```js
module.exports = function (server) {
```

Agora dentro desta função, vamos garantir que todas as rotas tenham uma URL inicial igual, utilizando o `express.Router()` para garantir isso. Vamos criar uma instância desse Router:

```js
const api = express.Router()
```

Agora passamos para nosso `server` que foi recebido por parâmetro, a string que representará todas as rotas por começo usando a nova constante `api`:

```js
server.use('/api', api)
```

Agora sempre que definimos alguma nova rota usando a constante `api`, nosso servidor usará `http://localhost:3003/api`, por exemplo, como base.

Por fim vamos pegar o `chatService` e `produtosService` que são models rest, e usar seu `register` para criar os 4 métodos (`GET`, `POST`, `PUT`, `DELETE`) dentro de `api`:

```js
chatService.register(api, '/chat')
produtosService.register(api, '/produtos')
}
```

Agora temos um `CRUD` de acesso aos `produtos` pela url `http://localhost:3003/api/produtos` e outro `CRUD` de acesso ao `chat` pela url `http://localhost:3003/api/chat`.

Nosso arquivo final (`src/config/routes.js`) ficará assim:

```js
const express = require('express') 
const chatService = require('../api/chat/chatService')
const produtosService = require('../api/produtos/produtosService')

module.exports = function (server) {

    const api = express.Router()
    server.use('/api', api)

    chatService.register(api, '/chat')
    produtosService.register(api, '/produtos')
}
```

Agora temos um serviço de acesso completo a nossa API, o que nos falta agora é integrar o Watson ao serviço.

## Implementando uma chamada para a Watson

Para fazermos chamadas ao serviço do watson, precisamos criar métodos de chamadas ao serviço deles de nossa maneira, então vamos criar um arquivo especificamente para fazer isso e utilizar o model `chat` que criamos para armazenar as conversas e contexto que o Watson nos disponibiliza.

Vamos criar um arquivo em `src/api/chatBot/chatBot.js` que irá representar isto.

Primeiramente, em `src/api/chatBot/chatBot.js` vamos importar a biblioteca `dotenv` das variáveis de ambiente e a da `watson`. A instancia inicial da watson, depende de segredos da API que ela nos disponíbiliza em sua Skill, então vamos criar variáveis dentro arquivo `.env` na raiz do nosso projeto para que essa API possa as utilizar.

```js
require('dotenv').config()
const AssistantV1 = require('ibm-watson/assistant/v1');
const chatService = require('../chat/chatService')
const produtosService = require('../produtos/produtosService')
```

Agora, criamos uma instância para o serviço da watson, utilizando o `watson.AssistantV1` que vem da biblioteca do watson, passando os segredos que serão definidos em `.env`, no caso de testes de desenvolvimento:

```js
const assistant = new AssistantV1({
    username: process.env.WATSON_USERNAME,
    password: process.env.WATSON_PASSWORD,
    url: process.env.WATSON_URL,
    version: process.env.WATSON_VERSION
});
```
Sendo:

- `WATSON_USERNAME`: Nome de usuário da skill do watson (geralmente é `apikey`);
- `WATSON_PASSWORD`: Senha fornecida pela skill;
- `WATSON_URL`: Url para acesso as skills (usamos como valor: `https://gateway.watsonplatform.net/assistant/api`);
- `WATSON_VERSION`: Versão do watson. Nós utilizamos a data que a skill foi criada no formato YYYY-MM-DD (exemplo: `2019-04-17`);

Agora quando quisermos enviar uma pergunta para a watson resolver utilizando suas intenções, entidades e dialogos usamos a constante junto com a função `assistant.message()`.

Vamos criar uma função que retorna uma `promise` que ficará responsável de ver se já existe uma conversa para uma sessão. ela receberá como parametro um objeto deste modelo:

```js
{
    session_id: req.body.session_id,
    message: {
        text: req.body.message || undefined
    }
}
```

Onde:

- `session_id`: é o id que representa uma instância de uma conversa se ela existir;
- `message`: Objeto que contem um `text` que é a mensagem enviada pelo usuário (padrão que o watson usa para suas requisições);

### Função para checar conversas de chat existentes ou criar novos dentro do banco: `iniciarOuContinuarConversa(input)`

Agora em `src/api/chatBot/chatBot.js` vamos começar a desenvolver essa função fazendo sua entrada, o objeto usado no exemplo acima será representado pela variável `input`:

```js
iniciarOuContinuarConversa = (input) => new Promise((resolve, reject) => {
```

Essa promisse para que seja finalizada, precisa retornar com a função `resolve(dados)` ou `reject()`.

Primeiramente, dentro da função, vamos utilizar o `find` do `mongoose` para verificar se a `input.session_id` já existe dentro do banco `chatService`:

```js
chatService.find({ session_id: input.session_id }, (err, data) => {
```

Se ele encontrar algo, ele nos retorna na variável `data`. Se ocorrer algum problema ele nos retorna em err, então vamos fazer algumas verificações dentro da função `find`. Se não existir ainda uma conversa (tirer `erro` na busca, tamanho dos dados retornados forem `0` ou `indefindos`), nós criamos um novo objeto que será criado no banco posteriormente com uma nova session_id usando a variável `_id` que o mongoose cria para nós (é um valor unico, perfeito para usar como sessão) e por fim o retornamos. Caso já exista, nós simplesmente pegamos o primeiro objeto que foi encontrado pelo `find` no banco, e limpamos a antiga entrada do usuário nele, depois retornamos pelo `resolve(objeto)`.

```js
    if (err || data.length == 0 || data == undefined) {
        let chat = new chatService({
            input: input.message || undefined,
            session_id: undefined,
        });
        chat.session_id = chat._id;
        resolve(chat);
    }
    else {
            chat = data[0];
            chat.input = input.message || undefined,
            resolve(chat);
    }
```

Nossa função final `iniciarOuContinuarConversa(input)` dentro de `src/api/chatBot/chatBot.js` ficará assim:

```js
iniciarOuContinuarConversa = (input) => new Promise((resolve, reject) => {
    chatService.find({ session_id: input.session_id }, (err, data) => {
        if (err || data.length == 0 || data == undefined) {

            let chat = new chatService({
                input: input.message || undefined,
                session_id: undefined,
            });
            chat.session_id = chat._id;

            resolve(chat);
        }
        else {
            chat = data[0];
            chat.input = input.message || undefined,
            resolve(chat);
        }
    })
});
```

### Função para adaptar as conversas do watson, com novos elementos que podemos buscar em nosso bancos, ou outras coisas: `reconstruirIntencoesEntidadesContexto(watsonObject)`

Essa é a principal função do nosso serviço. Ela será responsável, por exemplo, identificar uma intenção chamada `#comprar` e forçar uma buscar em um banco de dados por uma entidade, por exemplo, `@produto:camisa azul`.

Depois da função `iniciarOuContinuarConversa(input)`, vamos criar uma nova entrada para uma nova função, que terá o nome de `reconstruirIntencoesEntidadesContexto(watsonObject)`. Igual a função anteriormente, esta também irá depender de uma `promise` para ser resolvida. esta receberá a resposta que o watson nos enviar para sofrer adaptações.

```js
reconstruirIntencoesEntidadesContexto = (watsonObject) => new Promise((resolve, reject) => {
```

#### Intenção #comprar

Primeiro vamos buscar pela intenção de comprar:

```js
    if (watsonObject.intents.length > 0 && watsonObject.intents[0].intent == 'Comprar') {
```

Na primeira linha desse if vamos criar uma lista, onde poderá conter várias `promises`:

```js
        allSearchs = []
```

Isso vai permitir que possamos realizar varias operações e somente permitir que nossa promise principal (`reconstruirIntencoesEntidadesContexto`) retorne após todas as promises que foram criadas dentro da variável `allSearchs` forem resolvidas.

Depois, vamos buscar todas as entidades que o usuário pode estar buscando (possíveis produtos). vamos usar um loop para fazer a varredura em entities:

```js
        for (let index = 0; index < watsonObject.entities.length; index++) {
            if (watsonObject.entities[index].entity == 'produto') {
                let search;
                if (index + 1 < watsonObject.entities.length) {
                    search = watsonObject.input.text.substring(
                        watsonObject.entities[index].location[0],
                        watsonObject.entities[index + 1].location[0]
                    )
                }
                else {
                    search = watsonObject.input.text.substring(
                        watsonObject.entities[index].location[0]
                    )
                }
```

o método de substring acima foi utilizado, para poder pegar tudo que uma intenção pode conter. Por exemplo, se o usuário entra com a frase: `quero comprar uma camisa verde e uma camisa azul` a variável location do `watsonObject` só pegara o valor `camisa`. Então fazemos com esse método acima uma varredura até a proxima intenção encontrada. No caso acima, `e` foi definida com uma entidade de adição. então ele pegará, no caso acima, `camisa verde` como a primeira entidade, complementando assim nossa entidade, pois estamos usando a localização de caracteres ao invés de somente o valor da entidade.

Como agora em search temos um nome completo para busca (como `camisa verde`) basta realizarmos uma busca utilizando expressões regulares em nosso banco.

Como o `find` do `mongoose`, nos retorna uma `promise`, por isso vamos forçá-lo a fazer parte da nossa lista de promises em `allSearchs`:

```js
        allSearchs.push(new Promise((resolve, reject) => {
            ProdutosService.find({ "name": { "$regex": search.trim(), "$options": "i" } }, (err, data) => {         
                if (err || data.length == 0 || data == undefined) {
                    watsonObject.output.text[0] += ", Este outro produto não foi encontrado.";
                    resolve(watsonObject);
                }
                else {
                    watsonObject.context.hasOwnProperty("itens") && watsonObject.context.itens != '' ? response.context.itens.push(data[0]) : response.context.itens = [data[0]];
                    watsonObject.output.text[0] += ` ${data[0].name}, `;
                    resolve(watsonObject);
                }
            });
        }));
    }
```

O caso acima é o seguinte: se não exitir um produto buscado no banco `produtosService` pelo regex, reconstruimos a saída pro usuário adicionando a mensagem `", Este outro produto não foi encontrado."` tendo em vista que podemos estar buscando varias entidades (objetos). Caso encontre, nós adicionamos esse objeto encontrado no banco dentro do contexto do usuário utilizando uma lista  dentro do objeto com o nome de `itens`. Se a lista não existe lá dentro, nós criamos. Se existe, nos apenas adicionamos o novo produto. Por fim, reconstruimos novamente a mensagem de saída para o usuário adicionando o nome do produto novo, que foi adicionado no carrinho.

Por fim, ainda dentro do if da intenção `#comprar`, esperamos todas as promises finalizarem dentro de `allSearchs` antes de finalizar a chamada, utilizando o `Promise.all()`, que verifica se toda aquela lista de promises foi finalizada. ai usamos o then como validação disso:

```js
Promise.all(allSearchs).then((res) => {
    resolve(watsonObject);
});
```

#### Intenção #ver_carrinho

Depois, podemos analisar outra intenção, usando um `else if` ligado a inteção de `#comprar`. A intenção agora será `#ver_carrinho`:

```js
else if (watsonObject.intents.length > 0 && watsonObject.intents[0].intent == 'ver_carrinho') {
        if (watsonObject.context.hasOwnProperty("itens") && watsonObject.context.itens != '') {
            watsonObject.output.text[0] += ` Eles são: ${watsonObject.context.itens.map(item => item.name).join(', ')}`;
        }
        resolve(watsonObject);
    }
```

A comparação de cima simplesmente vai pegar o nome de todos os produtos (objetos) dentro do `contexto` do `chatBot` e adicionar na saída do usuário, que formará o carrinho de comprar do usuário com o nome de todos os produtos. Exemplo: `"Você possui 2 produtos no seu carrinho: Eles são: camisa azul, camisa verde"`.

#### Intenção #remover_carrinho

Vamos analisar mais uma intenção, agora, depois de `#ver_carrinho` vamos analisar a intenção `#remover_carrinho`:

```js
    else if (watsonObject.intents.length > 0 && watsonObject.intents[0].intent == 'remover_carrinho') {
        let tem_numero = false;
        if (watsonObject.context.hasOwnProperty("itens") && watsonObject.context.itens != '') {
            watsonObject.entities.forEach(entity => {
                if (entity.entity == 'sys-number') {
                    let pos = parseInt(entity.value);
                    watsonObject.context.itens.splice(pos-1, 1);
                    tem_numero = true;                }
            });
        }
        else {
            watsonObject.output.text[0] = "Não tem nada no seu carrinho!";
        }

        if (!tem_numero) {
            watsonObject.output.text[0] = "Você precisa me informar um número";
        }

        resolve(watsonObject);
    }
```

Aqui nos verificamos se o usuário entrou com algum número junto com essa intenção. Por exemplo, se o usuário entrar com a frase: `"Quero remover o 1 produtodo meu carrinho"`, temos a entidade `@sys-number` no qual podemos buscar por indexação em nosso carrinho, que está dentro do `context` na chave `itens`. Então podemos usar o metódo de lista chamado `splice()` para remover um objeto de uma determinada posição de uma lista.

Com isso finalizamos todas as intenções que precisamos modificar a nosso gosto do retorno da `watson`. Não podemos esquecer de fazer um `else` final retornando o objeto original caso não haja modificações:

```js
    else {
        resolve(watsonObject);
    }
```

Por fim, nossa função `reconstruirIntencoesEntidadesContexto(watsonObject)` ficará assim:

```js
reconstruirIntencoesEntidadesContexto = (watsonObject) => new Promise((resolve, reject) => {

    if (watsonObject.intents.length > 0 && watsonObject.intents[0].intent == 'Comprar') {
        allSearchs = [] 
        
        for (let index = 0; index < watsonObject.entities.length; index++) {

            if (watsonObject.entities[index].entity == 'produto') {
                let search;

                if (index + 1 < watsonObject.entities.length) {
                    search = watsonObject.input.text.substring(
                        watsonObject.entities[index].location[0],
                        watsonObject.entities[index + 1].location[0]
                    )
                }
                else {
                    search = watsonObject.input.text.substring(
                        watsonObject.entities[index].location[0]
                    )
                }

                allSearchs.push(new Promise((resolve, reject) => {
                    produtosService.find({ "name": { "$regex": search.trim(), "$options": "i" } }, (err, data) => {
                        
                        if (err || data.length == 0 || data == undefined) {
                            watsonObject.output.text[0] += ", Este outro produto não foi encontrado.";
                            resolve(watsonObject);
                        }
                        else {
                            watsonObject.context.hasOwnProperty("itens") && watsonObject.context.itens != '' ? response.context.itens.push(data[0]) : response.context.itens = [data[0]];
                            watsonObject.output.text[0] += ` ${data[0].name}, `;
                            resolve(watsonObject);
                        }
                    });
                }));
            }
        }

        Promise.all(allSearchs).then(() => {
            resolve(watsonObject);
        });
    }
    else if (watsonObject.intents.length > 0 && watsonObject.intents[0].intent == 'ver_carrinho') {

        if (watsonObject.context.hasOwnProperty("itens") && watsonObject.context.itens != '') {
            watsonObject.output.text[0] += ` Eles são: ${watsonObject.context.itens.map(item => item.name).join(', ')}`;
        }
        resolve(watsonObject);
    }
    else if (watsonObject.intents.length > 0 && watsonObject.intents[0].intent == 'remover_carrinho') {
        let tem_numero = false;

        if (watsonObject.context.hasOwnProperty("itens") && watsonObject.context.itens != '') {
            watsonObject.entities.forEach(entity => {

                if (entity.entity == 'sys-number') {
                    let pos = parseInt(entity.value);

                    watsonObject.context.itens.splice(pos-1, 1);
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

        resolve(watsonObject); 
    }
    else {
        resolve(watsonObject);
    }
});
```

### Função que será exportada: `analisarConstruirMensagem(input)`

Essa é a função que interliga as anteriores criadas e que realiza achamada para a watson resolver. Ela recebe um objeto do mesmo modelo de exemplo `input` citado mais anteriormente.

Primeiro vamos definir o inicio da função, que também será uma `promise`:

```js
module.exports.analisarConstruirMensagem = (input) => new Promise((resolve, reject) => {
```

Com isso, simplesmente pegamos o objeto de entrada (`input`) e o repassamos para nossa função `iniciarOuContinuarConversa(input)`, que retornará o objeto do banco do usuário, ou criará um e retornará o novo objeto para nós. Com isso usamos o `.then()` para esperar a promise ser resolvida, que nós retornará esse objeto novo pela variável `user` no qual foi definida:

```js
    iniciarOuContinuarConversa(input).then((user) => {
```

agora pegamos esse objeto retornado e a variavel de ambiente de WORKSPACE da skill, e construimos a chamada para a `watson`, usando a constante criada bem no começo dessa parte, chamada de `assistant`:

```js
        assistant.message({
            workspace_id: process.env.WATSON_WORKSPACE_ID,
            session_id: user.session_id,
            context: user.context,
            input: user.input
        })
        .then((err, res) => {
```

Vamos verificar se a resposta ocorrer tudo certo pelas variável de retorno `err` e `res`. Se ouve erro simplesmente rejeitamos:

```js
                if (err) {
                    reject(err);
                }
```

Caso contrário, chamamos a outra função que criamos: `reconstruirIntencoesEntidadesContexto(res)`. Ela ira receber o objeto que o watson retornou, e fazer as adaptações que definimos. Por fim, ela retorna o watsonObject modificado por nós através da resolução da promise (método `.then()`):

```js
                else {
                    reconstruirIntencoesEntidadesContexto(res).then((resp) => { 
```

Após tudo ser adaptado, precisamos colocar essa conversa no objeto `user`, que seria o histório dessa conversação.

Primeiro adicionamos a mensagem que foi enviada pelo usuário:

```js
                        user.messages.push({
                            message: input.message.text
                        });
```

Segundo adicionamos as mensagens de resposta que foram recebidas e adaptadas da watson:

```js
                        resp.output.text.forEach(message => {
                            user.messages.push({
                                message: message,
                                base: 'received'
                            });
                        });
```

Por ultimo, atualizamos o contexto do objeto user:

```js
                        user.context = resp.context;
```

E finalmente resolvemos a promise de `analisarConstruirMensagem(input)` resolvendo a promise retornando o novo objeto user com todas as mensagens devidamente respondidas.

```js
                        resolve(user);
```

Ou seja, esse arquivo é responsável por toda a metodologia de conversas de nosso serviço. Ele cria o usuário que conversa no banco, obtém suas mensagens, adapta as mensagens, conversa com o watson, e retorna o novo objeto que foi construido, faltando assim somente o serviço salvar no banco antes de responder a requisição pelo `express`. 

Nosso arquivo final (`src/api/chatBot/chatBot.js`) ficará assim:

```js
require('dotenv').config()
const watson = require('watson-developer-cloud');
const chatService = require('../chat/chatService')
const produtosService = require('../produtos/produtosService')

const assistant = new watson.AssistantV1({
    username: process.env.WATSON_USERNAME,
    password: process.env.WATSON_PASSWORD,
    url: process.env.WATSON_URL,
    version: process.env.WATSON_VERSION
});

iniciarOuContinuarConversa = (input) => new Promise((resolve, reject) => {
    chatService.find({ session_id: input.session_id }, (err, data) => {
        if (err || data.length == 0 || data == undefined) {

            let chat = new chatService({
                input: input.message || undefined,
                session_id: undefined,
            });
            chat.session_id = chat._id;

            resolve(chat);
        }
        else {
            chat = data[0];
            chat.input = input.message || undefined,
            resolve(chat);
        }
    })
});

reconstruirIntencoesEntidadesContexto = (watsonObject) => new Promise((resolve, reject) => {
    if (watsonObject.intents.length > 0 && watsonObject.intents[0].intent == 'Comprar') {
        allSearchs = []
        
        for (let index = 0; index < watsonObject.entities.length; index++) {
            
            if (watsonObject.entities[index].entity == 'produto') {
                let search;
               
                if (index + 1 < watsonObject.entities.length) {
                    search = watsonObject.input.text.substring(
                        watsonObject.entities[index].location[0],
                        watsonObject.entities[index + 1].location[0]
                    )
                }
                else {
                    search = watsonObject.input.text.substring(
                        watsonObject.entities[index].location[0]
                    )
                }

                allSearchs.push(new Promise((resolve, reject) => {
                    
                    produtosService.find({ "name": { "$regex": search.trim(), "$options": "i" } }, (err, data) => {
                        
                        if (err || data.length == 0 || data == undefined) {
                            watsonObject.output.text[0] += ", Este outro produto não foi encontrado.";
                            resolve(watsonObject);
                        }
                        
                        else {
                            watsonObject.context.hasOwnProperty("itens") && watsonObject.context.itens != '' ? response.context.itens.push(data[0]) : response.context.itens = [data[0]];
                            watsonObject.output.text[0] += ` ${data[0].name}, `;
                            resolve(watsonObject);
                        }
                    });
                }));
            }
        }
        Promise.all(allSearchs).then(() => {
            resolve(watsonObject);
        });
    }
    else if (watsonObject.intents.length > 0 && watsonObject.intents[0].intent == 'ver_carrinho') {
        if (watsonObject.context.hasOwnProperty("itens") && watsonObject.context.itens != '') {
            watsonObject.output.text[0] += ` Eles são: ${watsonObject.context.itens.map(item => item.name).join(', ')}`;
        }
        resolve(watsonObject);
    }
    else if (watsonObject.intents.length > 0 && watsonObject.intents[0].intent == 'remover_carrinho') {
        let tem_numero = false;
       
        if (watsonObject.context.hasOwnProperty("itens") && watsonObject.context.itens != '') {
            watsonObject.entities.forEach(entity => {
                
                if (entity.entity == 'sys-number') {
                    let pos = parseInt(entity.value);
                    
                    watsonObject.context.itens.splice(pos-1, 1);
                    tem_numero = true;                }
            });
        }
        else {
            watsonObject.output.text[0] = "Não tem nada no seu carrinho!";
        }

        if (!tem_numero) {
            watsonObject.output.text[0] = "Você precisa me informar um número";
        }

        resolve(watsonObject);
    }
    else {
        resolve(watsonObject);
    }
});

module.exports.analisarConstruirMensagem = (input) => new Promise((resolve, reject) => {
   
    iniciarOuContinuarConversa(input).then((user) => {

        assistant.message({
            workspace_id: process.env.WATSON_WORKSPACE_ID,
            session_id: user.session_id,
            context: user.context,
            input: user.input
        })
        .then((err, res) => {
                if (err) {
                    reject(err);
                }
                else {
                    reconstruirIntencoesEntidadesContexto(res).then((resp) => { 
                    
                        user.messages.push({
                            message: input.message.text
                        });

                        resp.output.text.forEach(message => {
                            user.messages.push({
                                message: message,
                                base: 'received'
                            });
                        });

                        user.context = resp.context;

                        resolve(user);
                    });
                }
            });
    })
});
```

## Criando uma rota manual

Após criarmos todo o serviço de comunicação da watson, precisamos fazer uma rota para essa requisição acontecer. com isso, vamos criar nossa rota manual. Como não vamos usar a rota `POST` da url `http://localhost:3003/api/chat`, vamos substituí-la pela nossa rota que fará a chamada para o serviço que criamos: `analisarConstruirMensagem(input)` e responder ao usuário com o novo objeto criado e salvo.

Vamos voltar ao arquivo `src/config/routes.js` e adicionar a nova bilioteca que criamos no começo do arquivo:

```js
const chatBot = require('../api/chatBot/chatBot')
```

Agora, dentro da função exportada anonimamente, vamos criar essa nova rota, usando ainda a constante `api` para que nossa rota tenha a url prévida de `http://localhost:3003/api`. Como ela será um POST, fazemos da seguinte forma:

```js
    api.post('/chat', (req, res) => {
```

para que a requisição funcione, o usuário precisa enviar pelo menos um `JSON` contento a mensagem que fará toda a conversa. Se ele quiser manter a conversa ele terá que enviar a session_id também, que será gerada pela primeira conversa dele com o chat.

Então, primeiramente verificamos se a `req` (requisição feita pelo usuário) tem em seu corpo (`body`) uma `message`:

```js
        if (!req.body.message) {
            res.status(403).send({ errors: ['No message provided.'] })
            return;
        }
```

Se não existir, retornamos ao usuário um status 403 (`forbidden`) juntamente com um objeto `JSON`, informando que ele não proveu nenhuma mensagem para análise. Damos um return no fim para finalizar a função de requisição.

Caso contrário, exista essas informações, nós chamaos o método que criamos, que veio da constante `chatBot`, na qual importamos no começo deste tópico, passamos pra ele a sessão e a mensagem. Se não existir a `session_id` tudo bem, isso foi validado dentro da função `analisarConstruirMensagem()`.

```js
        chatBot.analisarConstruirMensagem({
            session_id: req.body.session_id,
            message: {
                text: req.body.message
            }
        })
```

Como ela é uma `promise` precisamos usar o método `.then()` para aguardar sua resposta. Ela nos retornará o objeto user com tudo já feito (Como você viu anteriormente). simplesmente salvamos o objeto novo no banco de dados, e retornamos o status 201 (`created`) como resposta ao usuário juntamente com o objeto user em formato `JSON`, com todas as informações:

```js
            .then((user) => {

                user.save((err) => {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    } else {
                        res.status(201).json(user);
                    }
                })
            })
```

Após essa adaptação. Nosso novo arquivo final (`src/config/routes.js`) ficará assim:

```js
const express = require('express')
const chatBot = require('../api/chatBot/chatBot')
const chatService = require('../api/chat/chatService')
const produtosService = require('../api/produtos/produtosService')


module.exports = function (server) {

    const api = express.Router()
    server.use('/api', api)

    api.post('/chat', (req, res) => {

        if (!req.body.message) {
            res.status(403).send({ errors: ['No message provided.'] })
            return;
        }

        chatBot.analisarConstruirMensagem({
            session_id: req.body.session_id,
            message: {
                text: req.body.message
            }
        })
            .then((user) => {

                user.save((err) => {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    } else {
                        res.status(201).json(user);
                    }
                })
            })
    })

    chatService.register(api, '/chat')
    produtosService.register(api, '/produtos')
}
```

## Finalização
Com isso temos todo nosso serviço pronto para chamadas. Basta rodar o serviço:

```shell
$ npm run dev
```

## Créditos

Criado por: [João Paulo de Melo](https://www.jpmdik.com.br/)