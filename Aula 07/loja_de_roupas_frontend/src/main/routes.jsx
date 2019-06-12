import React from 'react'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import Header from '../common/template/header';
import Dashboard from '../dashboard/dashboard';
import Carrinho from '../carrinho/carrinho';

export default props => (
    <Router history={hashHistory}>
        <Route path="/" component={Header}>
            <IndexRoute component={Dashboard}/>
            <Route path="/carrinho" component={Carrinho} />
        </Route>
    </Router>
)