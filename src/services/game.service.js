const {http} = require('./axs');
const {authHeader} = require('./authHeader')
const Routes = require('./routes')

const GameService  = {


    async create(){
        console.log('routes create : ' +Routes.create)
        let x = await http.post(Routes.create, {},{headers: authHeader()}).then(
            (response) => {
                // console.log(response.data.codigo_partida)
                return response.data
                
            },
            (error) => {
                console.log(error)
                return {}
            }
        )

        return x
    },
    async join(codigo_partida){
        http.post(Routes.join, {},{headers: authHeader()}).then(
            (response) => {
                return response.data
            },
            (error) => {
                console.log(error)
                return {}
            }
        )
    },
    async start(codigo_partida){
        http.post(Routes.start, {},{headers: authHeader()}).then(
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

export {GameService}
