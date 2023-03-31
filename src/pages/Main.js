import '../styles/Common.css'
import '../styles/Main.css'
import {useState} from 'react'
import {Link} from 'react-router-dom'
import logo from '../Catan-logo-1.png'
// import {axios} from '../services/axs';
// import authHeader from '../services/authHeader'

const storage = require('./Storage');
const {authHeader}  = require('../services/authHeader');
const {http} = require('../services/axs');
const {GameService} = require('../services/game.service')

function Main() {

    const [errorMessage, setErrorMessage] = useState("")

    // console.log(authHeader());
    async function handleNewGame(event) {
        event.preventDefault(); // Evita que el formulario se envíe de manera predeterminada
        let data = await GameService.create()
        console.log(data)
       
        // http.post("/game/create",{}, {
        //          headers : authHeader(),  //  se envia mal
        //          mode : 'cors'
        //      })
        //      .then((response) => {
        //        if (response.data.codigo_partida) {
        //         console.log(response.data.codigo_partida);
        //         localStorage.setItem("gamecode", JSON.stringify(response.data.codigo_partida));  // codigo partida a local storage
        //        } else {
        //          return response.json().then(err => { throw new Error(err.error.message) })
        //        }
        //      }).catch((error) => {
        //          console.log(error.response.data);
        //          setErrorMessage(error.toString())
        //      });
    }

    console.log(localStorage.getItem("user"));

    return (
        
        <div className="Main-Header | Common-Header">
            <div className='Main-container'>
                <img src={logo} className="Main-logo" alt="logo" />
                <div className="Main-cover">
                    <Link to='/login' className='Main-btn'>
                        <a className='linkado'>Volver pa' tras</a>
                    </Link>
                    <Link to='/newGame' onClick={handleNewGame} className='Main-btn'>
                        <a className='linkado'>New game</a>
                    </Link>
                    <Link to='/' className='Main-btn'>
                        <a className='linkado'>Continue Game</a>
                    </Link>
                    <Link to='/joinGame' className='Main-btn'>
                        <a className='linkado'>Join Game</a>
                    </Link>
                    {errorMessage && (
                        <p style={{ color: 'red' }}> {errorMessage} </p>
                    )}
                </div>
            </div> 
        </div>
    )
}

export default Main;
