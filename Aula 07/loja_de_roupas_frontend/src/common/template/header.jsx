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