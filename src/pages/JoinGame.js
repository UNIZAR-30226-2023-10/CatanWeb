import React , { useState }from 'react';
import {json, Link} from 'react-router-dom'
import logo from '../Catan-logo-1.png'
import '../styles/JoinGame.css'
import '../styles/Common.css'
import axios from 'axios';
import io from 'socket.io-client';

const {GameService} = require('../services/game.service')
const {authHeader}  = require('../services/authHeader');

function JoinGame() {




        // Enviar los datos del formulario a través de una solicitud
        const [errorMessage, setErrorMessage] = useState("")

        async function handleJoinGame(event) {
          event.preventDefault();
          const form = document.getElementById('JoinGameId'); // Obtiene la referencia del formulario que se envió
          const formData = new FormData(form); // Crea una instancia de FormData para los valores de los campos de entrada
          const plainFormData = Object.fromEntries(formData.entries());
          var gamecode = plainFormData.gamecode;
          console.log(gamecode);

          let data = await GameService.join(gamecode);
          console.log(data)
                  /*axios
            .post("/api/game/join", {
               codigo_partida : gameCode,
            })
            .then((response) => {
              if (response) { // si respuesta correcta
                console.log(response.data)
              } else {
                return response.json().then(err => { throw new Error(err.error.message) })
              }
            }).catch((error) => {
                console.log(error.response.data);
                setErrorMessage(error.toString())
            });
          */
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
