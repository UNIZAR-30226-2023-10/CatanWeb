import React , { useState }from 'react';
import {json, Link, useNavigate} from 'react-router-dom'
import logo from '../Catan-logo-1.png'
import '../styles/JoinGame.css'
import '../styles/Common.css'
import axios from 'axios';
import io from 'socket.io-client';

const {GameService} = require('../services/game.service')
const {authHeader}  = require('../services/authHeader');

function JoinGame() {



        const navigate = useNavigate()

        const userJSON = localStorage.getItem("user");
        const user = JSON.parse(userJSON);
        const userName = user.name;

        // Enviar los datos del formulario a través de una solicitud
        const [errorMessage, setErrorMessage] = useState("")

        const socket = io('http://localhost:8080/');
        socket.on('error', (err)=> {console.log(err)})
        socket.on('new_player', (x) => {
            console.log(x.id)
          })

        async function handleJoinGame(event) {
          event.preventDefault();
          const form = document.getElementById('JoinGameId'); // Obtiene la referencia del formulario que se envió
          const formData = new FormData(form); // Crea una instancia de FormData para los valores de los campos de entrada
          const plainFormData = Object.fromEntries(formData.entries());
          var gamecode = plainFormData.gamecode;
          console.log(gamecode);

          let data = await GameService.join(gamecode);
          console.log(data)
          socket.emit('joinGame', user.accessToken, gamecode);
          //console.log(data.status);

          if (data.status == 'sussces'){
            const nombreJugadoresJSON = localStorage.getItem("nombreJugadores");
            const nombreJugadores = JSON.parse(nombreJugadoresJSON);
            
            if (data.jugadores[0] != null){
              //console.log('entro')
              nombreJugadores.jugador2 = data.jugadores[0];
              //console.log( nombreJugadores.jugadores2);
              console.log( data.jugadores[0]);
            }
            if (data.jugadores[1] != null){
              nombreJugadores.jugador3 = data.jugadores[1];
              //console.log( nombreJugadores.jugadores3);
              console.log( data.jugadores[1]);
            }
            if (data.jugadores[2] != null){
              nombreJugadores.jugador4 = data.jugadores[2];
              // console.log( nombreJugadores.jugadores4);
              console.log( data.jugadores[2]);
            }
            console.log(nombreJugadores);
            localStorage.setItem("nombreJugadores", JSON.stringify(nombreJugadores));
            
            navigate('/waitingroom');
          }
        }
    return (
        <div className='JoinGame-header | Common-Header'>
            <div className='JoinGame-container'>
                <img src={logo} className="JoinGame-logo" alt="logo" />
                <form id='JoinGameId' onSubmit={handleJoinGame} className='JoinGame-form'>
                    <div className="JoinGame-cover">
                        <h1>INSERT GAME CODE:</h1>
                        {errorMessage && (
                          <p style={{ color: 'red' }}> {errorMessage} </p>
                        )}
                        <input className='input-joinGame' type="text" placeholder="" name='gamecode' id='gamecode' />
                        <button type='submit' className='Register-btn'>
                            <a className='linkado'>JOIN GAME</a>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default JoinGame;
