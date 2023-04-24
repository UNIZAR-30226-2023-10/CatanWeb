import '../styles/Common.css'
import '../styles/Main.css'
import {useState} from 'react'
import { Link, useNavigate , useSearchParams  } from 'react-router-dom'
import logo from '../Catan-logo-1.png'
//import io from 'socket.io-client';
// import {axios} from '../services/axs';
// import authHeader from '../services/authHeader'
const Storage = require('../services/userInfo.js')

const storage = require('./Storage');
const {authHeader}  = require('../services/authHeader');
const {http} = require('../services/axs');
const {GameService} = require('../services/game.service')

function Main() {
    const [searchParams, setSearchParams] = useSearchParams()
    const username = searchParams.get("username")
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState("");
   // const socket = io('http://localhost:8080/');
    //    const user = JSON.parse(userJSON);
   

    let user = Storage.getUserInfo(username)
    console.log(username)
    console.log(user)
    const nombreJugadores = {
        jugador1: user,
        jugador2: "Esperando jugadores",
        jugador3: "Esperando jugadores",
        jugador4: "Esperando jugadores",
        numJugadores: 0,
      }
    localStorage.setItem("nombreJugadores", JSON.stringify(nombreJugadores));

    // console.log(authHeader());
    async function handleNewGame(event) {
        event.preventDefault(); // Evita que el formulario se envíe de manera predeterminada
        let data = await GameService.create()
        localStorage.setItem("gameToken", JSON.stringify(data.codigo_partida));
        console.log(data)
        if (data.status == 'success'){
            navigate('/newGame');
        }
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
