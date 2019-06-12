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