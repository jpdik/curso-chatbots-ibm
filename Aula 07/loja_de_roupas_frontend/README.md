# Loja de roupas (Frontend)
Projeto para construção de frontend do curso de chatbots

### Instalando project generator

Vamos utilizar o [Project generator]() criado por mim para usar um template padrão para o react. Para instalá-lo, basta rodar o seguinte comando:

```shell
$ npm install -g project_template_generator@latest
```

### Inicializando projeto

Após iniciar um projeto pelo git, dentro da pasta de nosso projeto, vamos iniciar o projeto utilizando um template com o comando:

```shell
$ generate
```

Depois é só escolher o projeto e dar um nome a ele:

```shell
? Qual template de projeto você quer gerar? (Use arrow keys)
❯ react-webpack 
  template2
  template3 
? Nome do Projeto: tmp
```

Todas as dependências do react já estão contidas em nosso template, no arquivo `package.json`.

Vamos mover todos os arquivos de dentro da pasta que nosso template criou para a raiz do projeto com o comando. No exemplo acima, o nome da pasta foi `tmp`:

```shell
$ mv tmp/* ../
```

### Instalando dependências

Como todas a dependencias estão referênciadas em `package.json`, vamos instalar as dependências deste arquivo utilizando o comando:

```shell
$ npm install
```

No `package.json` já temos todos os script configurados para iniciar a aplicação também.

## Criando componentes `Header` e `Footer` de toda aplicação

Toda aplicação react é divida em componentes. então devemos defini-los bem para que possam ser aproveitados em toda aplicação,

Como nossa aplicação vai ter um componente `header` que terá todos os links de rotas para as outras páginas e um componente `footer` padrão em todas elas, serão os primeiros componentes que iremos criar.

#### Compomente `Footer`

Vamos criar um novo arquivo chamado `footer.jsx` em `src/common/template/`. Nele vamos construir nosso componente.

Uma forma simples, de ter um componente react sem muitas propriedades, basta nós usarmos o `export default`.

Primeiro temos que importar o react no estilo `ES2015`:

```jsx
import React from 'react'
```

Depois utilizamos o método `export default` que simplesmente tem a propriedade `props` caso seja necessário exibir algum valor que pode ser passado de seu compoente pai.

```jsx
export default props => (
```

Por fim construimos um compoente que será retornado. Lembrando que só pode ser retornado um unico componente, por exemplo, `<div>ola</div>`:

```jsx
    <div className="footer">
        <div className="inner">
            <p>Loja de roupas, feito por <a href="https://github.com/jpdik">{props.nome}</a></p>
        </div>
    </div>
)
```

Neste exemplo, quando chamarmos o componente `<Footer/>`, temos que passar para ele a propriedade nome.

Exemplo:

```jsx
<Footer nome="joao" />
```

Nosso arquivo final `src/common/template/footer.jsx` ficará assim:

```jsx
import React from 'react'

export default props => (
    <div className="footer">
        <div className="inner">
            <p>Loja de roupas, feito por <a href="https://github.com/jpdik">{props.nome}</a></p>
        </div>
    </div>
)
```

Basta agora adicionarmos ele dentro de `src/main/app.jsx`, logo após o componente `Routes` para que seja exibido em todas as páginas:

```
<Footer nome="@seunome" />
```

#### Componente `Header`

Vamos criar um novo arquivo chamado `header.jsx` em `src/common/template/`. Nele vamos construir nosso componente.

Primeiro, dentro dele, vamos importar a biblioteca `react` e o componente `Link` da biblioteca `react-router` utilizando o estilo do `ES2015`:

```jsx
import React from 'react'
import { Link } from 'react-router'
```

Depois vamos criar a classe que representa o componente `Header`. Ele deve extender a `React.Component` já que ele será um componente react:

```jsx
class Header extends React.Component{
```

O `React.component` permite, por herança, que tenhamos agora o método `render()` que serve para renderizar um componente html dentro de nosso serviço (como o export default do componente footer fez). Da mesma forma, ele deve retornar um único componente entre parentêses, por exemplo o componente `<div>ola</div>`.

```jsx
    render(){
        return (
            <div>
                <div className="masthead clearfix">
                    <div className="inner">
                        <h3 className="masthead-brand">Loja de Roupas</h3>
                        <nav>
                            <ul className="nav masthead-nav">
                                <li className={this.props.location.pathname == '/' ? 'active' : ''}>
                                    <Link to={'/'}>
                                    Página incial
                                    </Link>
                                </li>
                                <li className={this.props.location.pathname == '/carrinho' ? 'active' : ''}>
                                    <Link to={'/carrinho'}>
                                    Carrinho
                                    </Link>
                                </li>

                            </ul>
                        </nav>
                    </div>
                </div>
                {this.props.children}
            </div>
        )
```

Aqui nos útilizamos o componente `Link` para gerar as rotas de navegação da nossa aplicação, já que o cabeçalho é que ficara responsável por isso. além disso, antes de fechar totalmente nosso componente, utilizamos o `props` através do `this` (como é uma classe, para obter acesso ao props devemos usar `this.props`) e chamamos a opção `children`.

A opção `this.props.children` é responsável por falar com seus componentes filhos para que ele possam realizar suas renderizações também. Exemplo:

```jsx
<Route path="/" component={Header}>
    <IndexRoute component={Dashboard}/>
    <Route path="/carrinho" component={Carrinho} />
</Route>
```

Como o componente `Route` de fora utiliza o componente `Header`, ele tem suas propriedades, porém como o `Header` tem a opção `children` internamente, ele permite que seus componentes filhos (`IndexRoute` e `Route`) possam se executar por contra própria, e pertencerem ainda ao componente `Header`.

Depois de tudo isso, devemos exportar, como em qualquer outro caso de um componente, nosso componente default, que no casso é nossa classe:

```jsx
export default Header
```

Nosso arquivo final `src/common/template/header.jsx` ficará assim:

```jsx
import React from 'react'
import { Link } from 'react-router'

class Header extends React.Component{
    render(){
        return (
            <div>
                <div className="masthead clearfix">
                    <div className="inner">
                        <h3 className="masthead-brand">Loja de Roupas</h3>
                        <nav>
                            <ul className="nav masthead-nav">
                                <li className={this.props.location.pathname == '/' ? 'active' : ''}>
                                    <Link to={'/'}>
                                    Página incial
                                    </Link>
                                </li>
                                <li className={this.props.location.pathname == '/carrinho' ? 'active' : ''}>
                                    <Link to={'/carrinho'}>
                                    Carrinho
                                    </Link>
                                </li>

                            </ul>
                        </nav>
                    </div>
                </div>
                {this.props.children}
            </div>
        )
    }
}
export default Header
```

### Ligando o componente `Header` as rotas

Como nosso componente `Header` será exibido em todas as páginas e definido como o nosso navegador, ele deverá ser encaixado dentro de `src/main/routes.jsx` para que possa funcionar corretamente.

Dentro deste arquivo, vamos adicionar a referência do Componente `Header`, e no componente `<Route path="/">` vamos adicioná-lo:

```diff 
import React from 'react'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
+ import Header from '../common/template/header';

export default props => (
    <Router history={hashHistory}>
-       <Route path="/">
+       <Route path="/" component={Header}>
            <IndexRoute />
        </Route>
    </Router>
)
```

ficará assim:


```jsx
import React from 'react'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import Header from '../common/template/header';

export default props => (
    <Router history={hashHistory}>
       <Route path="/" component={Header}>
            <IndexRoute />
        </Route>
    </Router>
)
```

Agora todas as páginas terão o cabeçalho de navegação, e caso queria adicionar uma rota nova, a adicionaremos aqui em `src/main/routes.jsx`.

### Criando página principal

Vamos criar um componente que representará toda nossa página inicial. ela terá todos os produtos que serão vendidos pela loja, que virá de uma requisição feita para o backend em `http://localhost:3003/api/produtos`.

Pra isto vamos iniciar criando a pasta `src/dashboard`, que irá conter todos os componentes dessa página.

#### Componente `ProdutosList`

Antes de criarmos nossa página inicial, vamos criar o conteúdo dela, que será a lista de produtos.

Para isso vamos criar uma pasta com 3 arquivos:

- `src/dashboard/produtos/produtosReducer.js`: este arquivo conterá o estado do nosso objeto representado em na store do `redux`;
- `src/dashboard/produtos/produtosActions.js`: este arquivo conterá todas as ações realizadas no componente `ProdutosList`. Por exemplo, requisição ao backend que traz os produtos;
- `src/dashboard/produtos/produtosList.jsx`: Este arquivo representa o componente de exibição dos produtos;

##### Arquivo `src/dashboard/produtos/produtosReducer.js`

Primeiramente neste arquivo, criamos o estado inicial da nossa store, que representará uma lista de produtos:

```jsx
const INICIAL_STATE = {
    list: []
}
```

depois exportamos uma função que representa as ações do reducer, ele recebe um `state` e uma `action como parâmetro:

```jsx
export default (state = INICIAL_STATE, action) => {
    switch(action.type){
        case 'PRODUTOS_FETCHED':
            return { ...state, list: action.payload.data }
        default:
            return state
    }
}
```

Usamos um `switch` para verificar cada tipo de ação. caso ela seja igual ao `case`, realizamos uma cópia do estado original utilizando o operador `spread`:

```jsx
{...state} //operador spread
```

Logo a frente ele, após a vírgula, modificamos o que queremos:

```jsx
{ ...state, list: action.payload.data } //atualizamos a lista de produtos copiando os dados que vieram da equisição pelo action.payload
```

Por fim retornamos o estado. Caso o estado não sofra modificações, somos obrigados a retornar por padrão o estádo atual. Por isso usamos o `default` no final do case.

Nosso arquivo final `src/dashboard/produtos/produtosReducer.js` ficará assim:

```jsx
const INICIAL_STATE = {
    list: []
}

export default (state = INICIAL_STATE, action) => {
    switch(action.type){
        case 'PRODUTOS_FETCHED':
            return { ...state, list: action.payload.data }
        default:
            return state
    }
}
```

##### Arquivo `src/dashboard/produtos/produtosActions.js`

Esse arquivo ficará responsável por realizar as devidas ações (como requisições, eventos de teclado, etc.) e repassar as ações que deverão ser executadas pelo arquivo `produtosReducer.js`.

Primeiro vamos importar algumas bibliotecas em `src/dashboard/produtos/produtosActions.js`:

```jsx
import axios from 'axios'
import consts from '../../main/consts'
```

Sendo:

- `axios`: biblioteca de requisições HTTP;
- `consts`: arquivo com um objeto de constantes, que iremos criar mais tarde para o uso;

A unica ação que o componente `ProdutosList` terá, é o de carregar os produtos que nosso serviço tem no `backend`.

Então a iremos criar:

```jsx
export const obterProdutos = () => {
    const request = axios.get(`${consts.BASE_URL}/produtos`)

    return {
        type: 'PRODUTOS_FETCHED',
        payload: request
    }
}
```

Simplesmente criamos um objeto que fará a requisição e passamos a responsabilidade para o `reducer`, já que temos 3 middlewares que nos auxiliam em ações `síncronas` que foram definidos no arquivo `src/index.jsx`. Eles permitem esperar a requisição, ou realizar mais de uma ao mesmo tempo, ou realizar em sequências essas requisições de forma que não precisemos tratar seu `then()` que seria a resposta, ou seja, traz mais praticidade. Assim que a promise for resolvida, os próprios midlewares disparam a ação para o arquivo `produtosReducer.js`.

##### Arquivo `src/dashboard/produtos/produtosList.jsx`

Por último o mais importante. Nele, além de criarmos o componente, faremos as conexões com a store direntamente na variável `props` que temos disponível no react através do método `connect`. Também temos o método `bindActionCreators()` para ligar as ações que estão vindo do arquivo `produtosActions.js`.

Primeiramente, importamos todas as nossas dependências no arquivo `src/dashboard/produtos/produtosList.jsx`:

```jsx
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { obterProdutos } from './produtosActions'
```

Criamos nosso componente como de costume:

```jsx
class ProdutosList extends React.Component{
```

Utilizaremos agora outra propriedade que herdamos do componente, `componentWillMount()`. Ele permite que realizemos ações antes de renderizar o componente com o método `render()`:

```jsx
    componentWillMount(){
        this.props.obterProdutos()
    }
```

isto irá fazer com que ele busque todos os produtos do `backend` e os insira na list da store.

Agora vamos criar um método nosso que possibilite pegar todos esses objetos e convertê-los em componentes:

```jsx
    renderCards(){
        const list = this.props.list || []
        return list.map(produto => (
            <div key={produto._id} className="col-6 col-sm-4 col-md-3 p2">
                <div className="card">
                    <img className="card-img-top" src={produto.imgUrl} />
                    <h4 className="card-title text-center">{produto.name}</h4>
                    <p className="card-text text-center">R$ {produto.value}.00</p>
                </div>
            </div>
        ))
    }
```

com isso, esse método pode retornar um array de componentes que podem ser usados no método `render()` porém ele precisa retornar sómente 1 componente, então temos que cercar essa lista com uma tag:

```jsx
    render(){
        return(
            <div className="row">
                {this.renderCards()}
            </div>
        )
    }
```

com isso teremos todo nosso componente construido.

Por fim, temos que:

- pegar os estados que vem da store para mapeá-los ao `this.props`:

```jsx
const mapStateToProps = state => ({ list: state.produtos.list })
```

Isso permite que tenhamos agora o `this.props.list` que está sendo usado no `renderCards()` e essa informação irá vir da nossa store do arquivo `produtosReducer.js`

- pegar as ações que vem de algum arquivo e mapeá-los ao `this.props` usando o `bindActionCreators()`:

```jsx
const mapDispatchToProps = dispatch => bindActionCreators({obterProdutos}, dispatch)
```

Isso permite que tenhamos agora o `this.props.obterProdutos()` que está sendo usado no `componentWillMount()` e essa informação irá vir do arquivo `produtosActions.js`

Por fim, devemos exportar conectando tudo ao componente da classe `ProdutosList` utilizando o método `connect()`:

```jsx
export default connect(mapStateToProps, mapDispatchToProps)(ProdutosList)
```

Nosso arquivo final `src/dashboard/produtos/produtosList.jsx` ficará assim:

```jsx
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { obterProdutos } from './produtosActions'

class ProdutosList extends React.Component{

    componentWillMount(){
        this.props.obterProdutos()
    }

    renderCards(){
        const list = this.props.list || []
        return list.map(produto => (
            <div key={produto._id} className="col-6 col-sm-4 col-md-3 p2">
                <div className="card">
                    <img className="card-img-top" src={produto.imgUrl} />
                    <h4 className="card-title text-center">{produto.name}</h4>
                    <p className="card-text text-center">R$ {produto.value}.00</p>
                </div>
            </div>
        ))
    }

    render(){
        return(
            <div className="row">
                {this.renderCards()}
            </div>
        )
    }

}

const mapStateToProps = state => ({ list: state.produtos.list })
const mapDispatchToProps = dispatch => 
bindActionCreators({obterProdutos}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ProdutosList)
```

#### Componente `Dashboard`

Agora iremos criar o componente `Dashboard` que representará a página inicial da nossa aplicação. Ela deverá conter a lista de produtos, que agora está representada pelo componente que criamos chamado `ProdutosList`.

Primeiramente, vamos criar o arquivo `src/dashboard/dashboard.jsx` e desenvolver como os arquivos anteriores, utilizando tags html e componentes criados:

```jsx
import React, { Component } from 'react'
import ProdutosList from './produtos/produtosList';

class Dashboard extends Component {

    render(){
        return (
            <div className="container">
                <div className="inner cover">
                    <h1 className="cover-heading">Conheça nossos produtos.</h1>
                    <p className="lead">Basta pedir no chat abaixo e nosso chat 
                    adiciona o produto no carrinho para você</p>
                    <ProdutosList />
                </div>
            </div>
        )
    }

}
export default Dashboard
```

Este já é o arquivo final `dashboard.jsx`. A principal diferença é que estamos usando o componente `ProdutosList` que criamos, ele já esta sendo reponsável por obter e atualizar sozinho para nós sua lista de produtos, tirando assim a responsabilidade da nossa página, que pode estar fazendo outra coisa. se quisermos novamente ter esse componente sendo exibido, basta que o importemos e chamar a tag dele (`ProdutosList`).

### ligando a página principal as rotas

Vamos voltar até o arquivo `src/main/routes.jsx` e informarmos ao componente `IndexRoute`, qual será o componente que será exibido sempre que nossa página principal for chamada, que no caso, é a dashboard:

```diff
import React from 'react'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import Header from '../common/template/header';

export default props => (
    <Router history={hashHistory}>
       <Route path="/" component={Header}>
-            <IndexRoute />
+            <IndexRoute component={Dashboard}/>
        </Route>
    </Router>
)
```

ficará assim:

```jsx
import React from 'react'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import Header from '../common/template/header';

export default props => (
    <Router history={hashHistory}>
       <Route path="/" component={Header}>
            <IndexRoute component={Dashboard}/>
        </Route>
    </Router>
)
```

Agora sempre que carregamos a página inicial do nosso serviço de frontend, será exibido a o componente principal que representa essa página com nome de `dashboard.jsx`.

## Registrando o `produtosReducer.js` na store

Precisamos registrar nosso arquivo de reducer na nossa store para que ele possa ser reconhecido. Vamos no arquivo `src/main/reducers.js` para fazer isso. Basta adicionar a referência desse arquivo dentro do `combineReducers`:

```diff
import { combineReducers } from 'redux'
+ import produtosReducer from '../dashboard/produtos/produtosReducer'

const rootReducer = combineReducers({
+    produtos: produtosReducer,
})

export default rootReducer
```

ficará assim;

```jsx
import { combineReducers } from 'redux'
import produtosReducer from '../dashboard/produtos/produtosReducer'

const rootReducer = combineReducers({
    produtos: produtosReducer,
})

export default rootReducer
```

No final do arquivo `src/dashboard/produtos/produtosList.jsx`, na constante `mapStateToProps`, acessamos essa store pelo caminho `state.produtos`(definido acima) e obtemos o objeto do reducer chamado `list` (definido em `src/dashboard/produtos/produtosReducer.js`), que no final ficou `state.produtos.list` e foi mapeado para o nome list, no qual nos deu acesso dentro do componente `ProdutosList` como `this.props.list`, por isso ela se chama mapStateToProps. Seu objetivo é mapear as variáveis da store para dentro do componente.

## Criando arquivo de constantes

Para que não precisemos alterar em várias páginas valores que iremos utilizar sempre (como a url do nosso serviço backend, chaves, etc.) vamos criar um arquivo que centraliza tudo, com caminho completo `src/main/consts`.

Vamos colocar nele:

```jsx
export default{
    BASE_URL: "http://localhost:3003/api",
    USER_SESSION: "user_id",
} 
```

com isso já temos essas constantes centralizadas, e sempre que precisarmos destes valores, basta que importemos este arquivo.

## Criando a página `Carrinho`

Além de nossa página principal, em nosso cabeçalho definimos também que teriamos a rota carrinho. Então também criaremos um componente que representará essa página. chamado `carrinho.jsx`.

Vamos criar o arquivo `src/carrinho/carrinho.jsx` e colocar o seguinte conteúdo:

```jsx
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { getCart } from '../chat/chatActions'

class Carrinho extends Component {

    componentWillMount(){
        this.props.getCart();
    }

    renderCart() {
        const list = this.props.cart || [];

        return list.map((item, index) => (
            <tr key={index}>
                <td className="col-md-2">
                    <img className="card-img-top" src={item.imgUrl} height="200" />
                </td>
                <td className="col-md-4 vertical-center">{item.name}</td>
                <td className="col-md-3">1</td>
                <td className="col-md-3">R$ {item.value}.00</td>
            </tr>
        ))
    }

    render() {
        return (
            <div className="container">
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th className="text-center">Imagem</th>
                                <th className="text-center">Nome</th>
                                <th className="text-center">Quantidade</th>
                                <th className="text-center">Preço por unidade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderCart()}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => ({ cart: state.chat.cart })
const mapDispatchToProps = dispatch => bindActionCreators({ getCart }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Carrinho)
```

Da mesma forma que fissemos com o componente `ProdutoList` aqui estamos obtendo informações sobre o carrinho e mapeando os objetos para componentes e mapeando a store e as ações para o `this.props` utilizando o `connect()`. Porém essas informações são obtidas das conversas de nosso chat, então serão criadas posteriormente.

### Dando funcionalidade ao Componente `chat`

Em nosso template, já temos um componente que representa nosso chat. Porém não foi definido nenhuma funcionalidade para ele ainda. Ele irá recuperar todas as mensagens, nosso carrinho de comprar, e fará as novas conversas, enviando requisições para o backend em `http://localhost:3003/api/chat`.

Dentro da pasta `src/chat/`, vamos criar 2 novos arquivos:

- `src/chat/chatReducer.js`: este arquivo conterá o estado do nosso objeto do chat representado em na store do `redux`;
- `src/dashboard/produtos/chatActions.js`: este arquivo conterá todas as ações realizadas nos componentes `chatSend` e `chatList`, que são componentes filhos de nosso componente principal `chat`. Ele enviará mensagens, recuperará o carrinho, e listará toda a conversa através de requisições ao backend.

##### Arquivo `src/chat/chatReducer.js`

Primeiramente neste arquivo, criamos o estado inicial da nossa store para o chat, que representará o estado da conversa.

```jsx
const INICIAL_STATE = {
    user: localStorage.getItem(consts.USER_SESSION),
    message: '',
    messages: [],
    cart: []
}
```

sendo:

- `user`: Sessão do usuário, que está sendo usado o `localStorage` que o navegador nos disponibiliza para armazenar informações úteis, como uma chave de sessão. Ele precisa de uma chave única para saber qual valor buscar, ela foi definida no arquivo de constantes (`src/main/consts.js`);
- `message`: Representa o campo que o usuário escreve, que é a mensagem que será enviada;
- `messages`: Uma lista com todo o histórico de conversa;
- `cart`: Carrinho com produtos que o usuário solicitou;


Depois exportamos uma função que representa as ações do reducer, ele recebe um `state` e uma `action como parâmetro:

```jsx
export default function (state = INICIAL_STATE, action){
    switch (action.type) {
        case 'MESSAGE_CHANGED':
            return { ...state, message: action.payload }
        case 'NEW_MESSAGE':
            let messages = state.messages || [];
            return { ...state, messages: messages.concat({ message: state.message, base: 'sent'})}
        case 'MESSAGE_SENT':
            return { ...state, message: '' }
        case 'CHAT_MESSAGES_FETCHED':
            return { ...state, messages: action.payload.data.messages }
        case 'USER_OBTAINED':
            localStorage.setItem(consts.USER_SESSION, action.payload.data.session_id)
            return { ...state, messages: action.payload.data.messages }
        case 'CART_FETCHED':
            let cartItems = action.payload.data.context ?
            action.payload.data.context.itens || [] : [];
            return { ...state, cart: cartItems }
        default:
            return state  
    }
}
```

Desta vez criamos várias ações. O nome de cada uma é por nossa escolha. Vamos descrever um pouco sobre cada uma;

- `MESSAGE_CHANGED`: Pega o estado, e atualiza a mensagem que será enviada. esse estado é evoluido sempre que o usuário apertar qualquer tecla;
- `NEW_MESSAGE`: Pega a lista de mensagens, e adiciona a nova no final da lista que se já tem. O valor atribuido é o que vem da variável `message`, definido na state;
- `MESSAGE_SENT`: Essa ação é quando uma mensagem foi enviada com sucesso para o backend, simplesmente limpamos a variável `message`, que foi a mensagem enviada pelo usuário;
- `CHAT_MESSAGES_FETCHED`: atualiza a variável `messages` com o novo histórico que foi recebido do backend;
- `USER_OBTAINED`: Essa ação é responsável por obter a sessão do usuário e mantê-la atualizada no localStorage. Mesmo que o usuário ainda não tenha uma sessão, ela fica repsonsável por capturar a primeira;
- `CART_FETCHED`: Essa ação vai pegar dos dados que o backend nos enviou, o carrinho de compras do usuário, caso ele tenha solicitado algo nessa troca de mensagens;

Cada ação tem sua responsabilidade, em nossas ações (no outro arquivo), podemos combiná=las, de forma a fazer todo um processo. Por exemplo:

1. Quando o usuário clicar enter, chamo a ação `NEW_MESSAGE`, que dará aquela impressão, como do whatsapp, de que a mensagem está sendo enviada.
2. Limpamos a caixa que o usuário estava digitando usando a ação `MESSAGE_SENT`.
3. Enviamos a mensagem para o backend usando uma requisição `axios.post`
4. Como agora temos uma resposta do backendo. Obtemos a sessão do usuário que está nessa resposta, com a ação `USER_OBTAINED`.
5. Atualizamos nosso carrinho com a ação `CART_FETCHED`, já que nossa resposta também tem esses dados.
6. Por ultimo, atualizamos o histório com a ação `CHAT_MESSAGES_FETCHED`, já que lá agora tem as respostas de nosso chatbot.

Com isso fizemos uma combinação de ações do chatReducer como você pode ver.

Nosso arquivo `src/chat/chatReducer.js` no final ficará assim:

```jsx
import consts from '../main/consts'

const INICIAL_STATE = {
    user: localStorage.getItem(consts.USER_SESSION),
    message: '',
    messages: [],
    cart: []
}

export default function (state = INICIAL_STATE, action){
    switch (action.type) {
        case 'MESSAGE_CHANGED':
            return { ...state, message: action.payload }
        case 'NEW_MESSAGE':
            let messages = state.messages || [];
            return { ...state, messages: messages.concat({ message: state.message, base: 'sent'})}
        case 'MESSAGE_SENT':
            return { ...state, message: '' }
        case 'CHAT_MESSAGES_FETCHED':
            return { ...state, messages: action.payload.data.messages }
        case 'USER_OBTAINED':
            localStorage.setItem(consts.USER_SESSION, action.payload.data.session_id)
            return { ...state, messages: action.payload.data.messages }
        case 'CART_FETCHED':
            let cartItems = action.payload.data.context ?
            action.payload.data.context.itens || [] : [];
            return { ...state, cart: cartItems }
        default:
            return state  
    }
}
```

##### Arquivo `src/chat/chatActions.js`

Assim como temos várias atualizações de estados, aqui teremos uma ação para cada uma delas. Nosso arquivo ficará assim:

```jsx
import consts from '../main/consts'
import axios from 'axios'

export const changeMessage = event => ({
    type: 'MESSAGE_CHANGED',
    payload: event.target.value
})

export const getMessages = () => {
    const session_id = localStorage.getItem(consts.USER_SESSION) ?
        `/${localStorage.getItem(consts.USER_SESSION)}` : '';
    const request = axios.get(`${consts.BASE_URL}/chat${session_id}`)
    return {
        type: 'CHAT_MESSAGES_FETCHED',
        payload: request
    }
}

export const storeUser = (request) => {
    return {
        type: 'USER_OBTAINED',
        payload: request
    }
}

export const clear = () => {
    return { type: 'MESSAGE_SENT' }
}

export const newMessage = () => {
    return { type: 'NEW_MESSAGE' }
}

export const getCart = () => {
    const session_id = localStorage.getItem(consts.USER_SESSION) ?
        `/${localStorage.getItem(consts.USER_SESSION)}` : '';
    const request = axios.get(`${consts.BASE_URL}/chat${session_id}`)
    return {
        type: 'CART_FETCHED',
        payload: request
    }
}

export const sendMessage = (message) => {
    const session_id = localStorage.getItem(consts.USER_SESSION);
    return dispatch => {
        dispatch(newMessage());
        dispatch(clear());
        axios.post(`${consts.BASE_URL}/chat`, { message, session_id})
            .then(res => dispatch(storeUser(res)))
            .then(() => dispatch(getCart()))
            .then(() => dispatch(getMessages()))
    }
}
```

Você pode ver facilmente que cada uma faz uma determinada requisição ou ação, ou até mesmo uma cadeia de ações, e depois passa a resposabilidade com os dados para o reducer, que simplesmente vai atualizar aquelas variáveis. Assim nosso componente vai detectar que ouve alterações e atualizar automaticamente.


## Registrando o `chatReducer.js` na store

Assim como registramos nosso `produtosReducer` na store, também precisamos registrar nosso arquivo de reducer `chatReducer` na nossa store para que ele possa ser reconhecido. Vamos voltar novamente no arquivo `src/main/reducers.js`. Para fazer isso. basta adicionar também a referência desse arquivo dentro do `combineReducers`:

```diff
import { combineReducers } from 'redux'
import produtosReducer from '../dashboard/produtos/produtosReducer'
+ import chatReducer from '../chat/chatReducer';

const rootReducer = combineReducers({
    produtos: produtosReducer,
+    chat: chatReducer
})

export default rootReducer
```

O novo arquivo ficará assim;

```jsx
import { combineReducers } from 'redux'
import produtosReducer from '../dashboard/produtos/produtosReducer'
import chatReducer from '../chat/chatReducer';

const rootReducer = combineReducers({
    produtos: produtosReducer,
    chat: chatReducer
})

export default rootReducer
```

com isso agora já podemos pegar as ações e defini-las nos subcomponentes `ChatList` e `ChatSend` do componente principal `Chat`

#### Modificando o componente `src/chat/chatList.jsx`

Vamos no arquivo e fazer as seguintes alterações:

```diff
import React, { Component } from 'react'
+ import { connect } from 'react-redux'
+ import { bindActionCreators } from 'redux'

+ import { getMessages } from './chatActions'

class ChatList extends Component {

    constructor(props) {
        super(props)

        this.renderMessages = this.renderMessages.bind(this)
    }

+    componentWillMount() {
+        this.props.getMessages();
+    }

    renderMessages() {
+       const list = this.props.messages || [];

+        if (list.length > 0) {
-           return (
+           return list.map((item, index) => (
+               <li key={index} className={`message ${item.base} appeared`}>
-               <li className={`message received appeared`}>
                    <div className="avatar"></div>
                    <div className="text_wrapper">
-                       <div className="text">teste</div>
+                       <div className="text">{item.message}</div>
                    </div>
                </li>
+           ))
-           )
+       }
+       else {
+           return (
+               <li>

+               </li>
+           )
+       }

    }

    render() {
        const messages = this.renderMessages()
        return (
            <ul className="messages">
                {messages}
            </ul>
        )
    }

    componentDidUpdate() {
        $('.messages').animate({ scrollTop: $('.messages').prop('scrollHeight') }, 300);
    }
}

- export default ChatList
+ const mapStateToProps = state => ({ messages: state.chat.messages })
+ const mapDispatchToProps = dispatch => bindActionCreators({ getMessages }, dispatch)
+ export default connect(mapStateToProps, mapDispatchToProps)(ChatList)
```

no final ficará assim:

```jsx
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getMessages } from './chatActions'

class ChatList extends Component {

    constructor(props) {
        super(props)

        this.renderMessages = this.renderMessages.bind(this)
    }

    componentWillMount() {
        this.props.getMessages();
    }

    renderMessages() {
        const list = this.props.messages || [];

        if (list.length > 0) {
            return list.map((item, index) => (
                <li key={index} className={`message ${item.base} appeared`}>
                    <div className="avatar"></div>
                    <div className="text_wrapper">
                        <div className="text">{item.message}</div>
                    </div>
                </li>
            ))
        }
        else {
            return (
                <li>

                </li>
            )
        }

    }

    render() {
        const messages = this.renderMessages()
        return (
            <ul className="messages">
                {messages}
            </ul>
        )
    }

    componentDidUpdate() {
        $('.messages').animate({ scrollTop: $('.messages').prop('scrollHeight') }, 300);
    }
}

const mapStateToProps = state => ({ messages: state.chat.messages })
const mapDispatchToProps = dispatch => bindActionCreators({ getMessages }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ChatList)
```

Assim estamos obtendo ligando as `messages` do reducer `chat` do arquivo `src/chat/chatReducer.js` a este subcomponente `ChatList`, podendo agora ter o histório de conversas.

#### Modificando o componente `src/chat/chatSend.jsx`

Vamos no arquivo e fazer as seguintes alterações:

```diff
import React, { Component } from 'react'
+ import { connect } from 'react-redux'
+ import { bindActionCreators } from 'redux'

+ import { changeMessage, sendMessage } from './chatActions'
class ChatSend extends Component {

    constructor(props) {
        super(props)
        this.keyHandler = this.keyHandler.bind(this)
    }

    keyHandler(e) {
+       const { message, sendMessage } = this.props;
        if (e.key === 'Enter') {
-           console.log('enviou')
+           sendMessage(message);
        }
    }

    render() {
+       const { message, changeMessage, sendMessage } = this.props;
        return (
            <div className="bottom_wrapper clearfix">
                <div className="message_input_wrapper">
-                    <input className="message_input" placeholder="Digite sua mensagem aqui..." onKeyUp={this.keyHandler} />
+                    <input className="message_input" placeholder="Digite sua mensagem aqui..." onKeyUp={this.keyHandler} onChange={changeMessage} value={message}/>
                </div>
-               <div className="send_message" onClick={() => console.log('teste')}>
+               <div className="send_message" onClick={() => sendMessage(message)}>
                    <div className="icon"></div>
                    <div className="text">Enviar</div>
                </div>
            </div>
        )
    }
}

- export default ChatSend
+ const mapStateToProps = state => ({ message: state.chat.message })
+ const mapDispatchToProps = dispatch => bindActionCreators({ changeMessage, sendMessage }, dispatch)
+ export default connect(mapStateToProps, mapDispatchToProps)(ChatSend)
```

no final ficará assim:

```jsx
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { changeMessage, sendMessage } from './chatActions'
class ChatSend extends Component {

    constructor(props) {
        super(props)
        this.keyHandler = this.keyHandler.bind(this)
    }

    keyHandler(e) {
        const { message, sendMessage } = this.props;
        if (e.key === 'Enter') {
            sendMessage(message);
        }
    }

    render() {
        const { message, changeMessage, sendMessage } = this.props;
        return (
            <div className="bottom_wrapper clearfix">
                <div className="message_input_wrapper">
                    <input className="message_input" placeholder="Digite sua mensagem aqui..." onKeyUp={this.keyHandler} onChange={changeMessage} value={message}/>
                </div>
                <div className="send_message" onClick={() => sendMessage(message)}>
                    <div className="icon"></div>
                    <div className="text">Enviar</div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({ message: state.chat.message })
const mapDispatchToProps = dispatch => bindActionCreators({ changeMessage, sendMessage }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ChatSend)
```

Agora temos todos os nosso componentes se comunicando com o reducer, assim, nosso chat já funciona, já obtém o histório de conversas, ja atualiza nosso carrinho de compras também.

## Finalização
Com isso temos todo nosso serviço frontend pronto para exibir e fazer chamadas ao backend. Basta rodar o serviço:

```shell
$ npm run dev
```

## Fazendo deploy do backend


#### Inicializando projeto caso não exista

De preferência, nosso projeto já precisa estar em um repositório. Caso não esteja, basta usar o comando:

```shell
$ npm init
```

Isso já permitirá que façamos envio do projeto para o heroku, que será o local de deploy que iremos utilizar.

#### Instalando e logando no heroku

Caso não tenha instalado, vamos instalar o cliente do heroku pelo próprio NPM:

```shell
$ npm install -g heroku
```

Após a instalação, se ainda não estiver logado, vamos logar utilizando o comando:

```shell
$ heroku login
```

Ele irá abrir o navegador para poder realizar o login.

#### Criando um serviço no heroku

Para criarmos o serviço, basta rodarmos o comando abaixo, passando o nome que queremos que nossa URL tenha:

```shell
$ heroku create <nome_para_o_deploy>
```

Exemplo:

```shell
$ heroku create lojajp-frontend
```

Com isso, teremos a url: [https://`lojajp-frontend`.herokuapp.com/](https://lojajp-frontend.herokuapp.com/) para acesso ao serviço.

#### Setando o projeto remoto que será utilizado pelo git

Para realizar isso, utlize o comando:

```shell
$ heroku git:remote -a <nome_para_o_deploy>
```

Utilizando o nome que foi definido anteriormente.

**Obs**: se já estiver dentro de um git e ter rodado o comando create. provavelmente esse passo já terá setado pelo comando.

#### Definindo dependências no `package.json`

Vamos declarar a dependência `http-server`, que é o serviço que vai rodar nosso react como uma página única.

Vamos adicionar as seguintes linhas no arquivo `package.json`:

```diff
{
  "name": "frontend",
  "version": "1.0.0",
  "description": "test",
  "main": "index.js",
  "scripts": {
    "dev": "webpack-dev-server --progress --colors --inline --hot",
    "production": "webpack --progress -p --define process.env.NODE_ENV='\"production\"'"
  },
  "keywords": [],
  "author": "João Paulo de Melo",
  "license": "ISC",
  "devDependencies": {
    "axios": "^0.19.0",
    "babel-core": "^6.26.3",
    "babel-loader": "6.2.10",
    "babel-plugin-react-html-attrs": "2.0.0",
    "babel-plugin-transform-object-rest-spread": "6.22.0",
    "babel-preset-env": "^1.7.0",
    "babel-preset-es2015": "^6.24.1",
    "babel-preset-react": "6.22.0",
    "bootstrap3": "^3.3.5",
    "css-loader": "0.26.1",
    "extract-text-webpack-plugin": "1.0.1",
    "file-loader": "0.9.0",
    "font-awesome": "4.7.0",
    "ionicons": "3.0.0",
    "jquery": "^3.4.1",
    "lodash": "^4.17.11",
    "popper.js": "^1.14.7",
    "react": "15.4.2",
    "react-dom": "15.4.2",
    "react-iframe": "^1.5.0",
    "react-redux": "4.4.6",
    "react-redux-toastr": "4.4.2",
    "react-router": "3.0.2",
    "redux": "3.6.0",
    "redux-form": "6.4.1",
    "redux-multi": "0.1.12",
    "redux-promise": "0.5.3",
    "redux-thunk": "2.1.0",
    "style-loader": "0.13.1",
    "webpack": "1.14.0",
    "webpack-dev-server": "1.16.2"
  },
+  "dependencies": {
+    "http-server": "0.10.0"
+  }
}
```

Ficará assim:

```js
{
  "name": "frontend",
  "version": "1.0.0",
  "description": "test",
  "main": "index.js",
  "scripts": {
    "dev": "webpack-dev-server --progress --colors --inline --hot",
    "production": "webpack --progress -p --define process.env.NODE_ENV='\"production\"'"
  },
  "keywords": [],
  "author": "João Paulo de Melo",
  "license": "ISC",
  "devDependencies": {
    "axios": "^0.19.0",
    "babel-core": "^6.26.3",
    "babel-loader": "6.2.10",
    "babel-plugin-react-html-attrs": "2.0.0",
    "babel-plugin-transform-object-rest-spread": "6.22.0",
    "babel-preset-env": "^1.7.0",
    "babel-preset-es2015": "^6.24.1",
    "babel-preset-react": "6.22.0",
    "bootstrap3": "^3.3.5",
    "css-loader": "0.26.1",
    "extract-text-webpack-plugin": "1.0.1",
    "file-loader": "0.9.0",
    "font-awesome": "4.7.0",
    "ionicons": "3.0.0",
    "jquery": "^3.4.1",
    "lodash": "^4.17.11",
    "popper.js": "^1.14.7",
    "react": "15.4.2",
    "react-dom": "15.4.2",
    "react-iframe": "^1.5.0",
    "react-redux": "4.4.6",
    "react-redux-toastr": "4.4.2",
    "react-router": "3.0.2",
    "redux": "3.6.0",
    "redux-form": "6.4.1",
    "redux-multi": "0.1.12",
    "redux-promise": "0.5.3",
    "redux-thunk": "2.1.0",
    "style-loader": "0.13.1",
    "webpack": "1.14.0",
    "webpack-dev-server": "1.16.2"
  },
  "dependencies": {
    "http-server": "0.10.0"
  }
}
```

#### Definindo incialização do servilo via `Procfile`

Pra iniciar o nosso frontend, vamos utilizar o serviço de Procfile que o heroku nos disponibiliza. Pra isso, criamos um arquivo na raiz de nosso projeto chamado `Procfile`

Vamos adicionar essa linha no arquivo `Procfile`:

```shell
web: http-server -p $PORT
```

Antes dos dois pontos, é o nome que será dado ao processo que será criado. Isso facilita a identificação do que está rodando no shell quando formos analisar erros. o que está escrito após os dois pontos, é o comando que o heroku terá que rodar para iniciar o nosso serviço. `$PORT` é a variavel de ambiente da porta que o heroku disponibiliza para rodar o serviço.

Com isso o heroku já saberá como rodar nosso serviço na inicialização.

O `http-server` é um serviço que utiliza a pasta public para rodar um serviço estático. ele busca pelo arquivo `index.html` para rodar como primeira página, que é a unica página de entrada que nosso frontend react tem.

#### Gerando os arquivos em produção

Basta rodarmos o script de produção:

```shell
$ npm run production
```

Agora basta enviar tudo para o heroku.

#### Enviando todo o serviço para o heroku para o deploy

Para fazer isto, basta realizar os 3 passos simples de um commit.

Adicionar todos os arquivos do projeto para o commit:

```shell
$ git add .
```

Dar um texto de referência ao que está sendo realizado neste commit:

```shell
$ git commit -m "deploy da versão x"
```

Por fim, basta enviá-lo para o heroku com o comando push:

```shell
$ git push heroku master
```

Se tudo ocorrer corretamente, no final deste comando terá algo do tipo:

```shell
...
remote:        Released v28
remote:        https://lojajp-frontend.herokuapp.com/ deployed to Heroku
remote: 
remote: Verifying deploy... done.
To https://git.heroku.com/lojajp-frontend.git
   8293bba..d758e58  master -> master
```

No exemplo acima, o servidor estará rodando em [https://lojajp-frontend.herokuapp.com/](https://lojajp-frontend.herokuapp.com/).

Caso ocorra algum erro você pode analisá-lo pelo comando:

```shell
$ heroku logs --tail
```

## Créditos

Criado por: [João Paulo de Melo](https://www.jpmdik.com.br/)