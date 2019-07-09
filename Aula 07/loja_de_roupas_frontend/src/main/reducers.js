import { combineReducers } from 'redux'
import produtosReducer from '../dashboard/produtos/produtosReducer'
import chatReducer from '../chat/chatReducer';


const rootReducer = combineReducers({
    produtos: produtosReducer,
    chat: chatReducer
})

export default rootReducer