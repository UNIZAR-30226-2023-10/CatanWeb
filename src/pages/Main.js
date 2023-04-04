import '../styles/Common.css'
import '../styles/Main.css'
import {useState} from 'react'
import { Link, useNavigate  } from 'react-router-dom'
import logo from '../Catan-logo-1.png'
//import io from 'socket.io-client';
// import {axios} from '../services/axs';
// import authHeader from '../services/authHeader'

const storage = require('./Storage');
const {authHeader}  = require('../services/authHeader');
const {http} = require('../services/axs');
const {GameService} = require('../services/game.service')

function Main() {
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState("");
   // const socket = io('http://localhost:8080/');

    const jugadores = {
        jugador2: "Esperando jugadores",
        jugador3: "Esperando jugadores",
        jugador4: "Esperando jugadores",
      }
    localStorage.setItem("nombreJugadores", JSON.stringify(jugadores));

    // console.log(authHeader());
    async function handleNewGame(event) {
        event.preventDefault(); // Evita que el formulario se envíe de manera predeterminada
        let data = await GameService.create()
        localStorage.setItem("gameToken", JSON.stringify(data.codigo_partida));
        console.log(data)
        navigate('/newGame');
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
