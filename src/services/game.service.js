import http from "axios";
import { Navigate } from "react-router-dom";
const authHeader = require('./authHeader')
const Routes = require('./routes')

const GameService  = {
    create(){
        http.post(Routes.create, {headers: authHeader()}).then(
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
        http.post(Routes.join, {headers: authHeader()}).then(
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
        http.post(Routes.start, {headers: authHeader()}).then(
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
