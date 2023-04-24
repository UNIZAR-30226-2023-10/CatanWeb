import React, { useState } from 'react';
import '../styles/NewGame.css';
import '../styles/Common.css'
import logo from '../Catan-logo-1.png'
import { Link } from 'react-router-dom';
// import { socket } from '../services/socket';
const socket = require('../services/socket')

const {authHeader}  = require('../services/authHeader');


function NewGame() {

    const codigoPartidaJSON = localStorage.getItem("gameToken");
    const codigoPartida = JSON.parse(codigoPartidaJSON);
    const userJSON = localStorage.getItem("user");
    const user = JSON.parse(userJSON);
    // const userName = user.name;
    
    socket.emit('joinGame', user.accessToken, codigoPartida);

    const nombreJugadoresJSON = localStorage.getItem("nombreJugadores");
    const nombreJugadores = JSON.parse(nombreJugadoresJSON);
    let jugador1 = nombreJugadores.jugador1;
    let jugador2 = nombreJugadores.jugador2;
    let jugador3 = nombreJugadores.jugador3;
    let jugador4 = nombreJugadores.jugador4;


    socket.on('error', (err)=> {console.log(err)})

    socket.on('new_player', (data) => {
        console.log(data)
        console.log('dentro new player')
        const nombreJugadoresJSON = localStorage.getItem("nombreJugadores");
        const nombreJugadores = JSON.parse(nombreJugadoresJSON);
        console.log(nombreJugadores)
        if (nombreJugadores.numJugadores === 0) {
            nombreJugadores.jugador2 = data.username;
            nombreJugadores.numJugadores = 1;
            console.log('dentro 0 jugadores');
            jugador2 = nombreJugadores.jugador2;
            
        }
        else if (nombreJugadores.numJugadores === 1) {
            nombreJugadores.jugador3 = data.username;
            nombreJugadores.numJugadores = 2;
            console.log('dentro 1 jugadores');
        }
        else if (nombreJugadores.numJugadores === 2) {
            nombreJugadores.jugador4 = data.username;
            nombreJugadores.numJugadores = 3;
            console.log('dentro 2 jugadores');
        }
        localStorage.setItem("nombreJugadores", JSON.stringify(nombreJugadores));
    })

    return (
        <div className="Main-Header | Common-Header">
             <img src={logo} className="newGame-logo" alt="logo" />
            <div className='pantalla-container'>
                <h2>GAME CODE:  {codigoPartida} </h2>
                <div className='usuario-container'>
                    {jugador1}
                </div>
                <div className={` ${jugador2 === 'Esperando jugadores' ? 'esperando-container' : 'usuario-container'}`}>
                    {jugador2}
                </div>
                <div className={` ${jugador3 === 'Esperando jugadores' ? 'esperando-container' : 'usuario-container'}`}>
                    {jugador3}
                </div>
                <div className={` ${jugador4 === 'Esperando jugadores' ? 'esperando-container' : 'usuario-container'}`}>
                    {jugador4}
                </div>
                
                <button className='newGame-btn'>
                        <Link to="/Game" className='linkado' >Empezar</Link>
                </button>
                <button className='lleno-button'>
                    Llenar Sala
                </button>
            </div>
        </div>
    );
}

export default NewGame;
