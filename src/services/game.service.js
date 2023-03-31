import axios from '../services/axs';
import { Navigate } from "react-router-dom";
const authHeader = require('./authHeader')
const Routes = require('./routes')

const GameService  = {
    create(){
        axios.post(Routes.create, {headers: authHeader()}).then(
            (response) => {
                return response.data
            },
            (error) => {
                console.log(error)
                return {}
            }
        )
    },
    join(codigo_partida){
        axios.post(Routes.join, {headers: authHeader()}).then(
            (response) => {
                return response.data
            },
            (error) => {
                console.log(error)
                return {}
            }
        )
    },
    start(codigo_partida){
        axios.post(Routes.start, {headers: authHeader()}).then(
            (response) => {
                return response.data
            },
            (error) => {
                console.log(error)
                return {}
            }
        )
    }

}

module.exports = GameService
