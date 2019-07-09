import axios from 'axios'
import consts from '../../main/consts'

export const obterProdutos = () => {
    const request = axios.get(`${consts.BASE_URL}/produtos`)

    return {
        type: 'PRODUTOS_FETCHED',
        payload: request
    }
}