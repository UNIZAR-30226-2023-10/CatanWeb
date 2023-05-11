const {http} = require('./axs')
const {authHeader} = require('./authHeader')
const Routes = require('./routes')

const GameService = {
    async create() {
        //console.log('GameService.create(): Routes create: ', Routes.create)
        let x = await http.post(Routes.create, {}, {headers: authHeader()}).then(
            (response) => {
                //console.log(response.data.codigo_partida)
                return response.data
            },
            (error) => {
                //console.log(error)
                return {}
            }
        )
        return x
    },
    async join(gameCode){
        let x = await http.post(Routes.join, {codigo_partida: gameCode}, {headers: authHeader()}).then(
            (response) => {
                //console.log("GAMESERVICE JOIN: ", response.data)
                return response.data
            },
            (error) => {
                //console.log(error)
                return {}
            }
        )
        return x
    },
    async start(gameCode) {
        let x = await http.post(Routes.start, {codigo_partida: gameCode}, {headers: authHeader()}).then(
            (response) => {
                //console.log("GAMESERVICE START: ", response.data)
                return response.data
            }, 
            (error) => {
                return {}
            }
        )
        return x
    }
}

export {GameService}