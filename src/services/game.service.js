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
    }
}

export {GameService}