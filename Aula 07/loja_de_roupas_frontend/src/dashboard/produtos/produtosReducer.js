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