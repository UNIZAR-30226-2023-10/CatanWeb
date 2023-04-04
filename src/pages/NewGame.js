import React, { useState } from 'react';
import '../styles/NewGame.css';
import '../styles/Common.css'
import logo from '../Catan-logo-1.png'
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

const {authHeader}  = require('../services/authHeader');


function NewGame() {

    const socket = io('http://localhost:8080/');
    const codigoPartidaJSON = localStorage.getItem("gameToken");
    const codigoPartida = JSON.parse(codigoPartidaJSON);
    
    socket.emit('joinGame',authHeader(), codigoPartida);

    const userJSON = localStorage.getItem("user");
    const user = JSON.parse(userJSON);
    const userName = user.name;
    
    const nombreJugadoresJSON = localStorage.getItem("nombreJugadores");
    const nombreJugadores = JSON.parse(nombreJugadoresJSON);
    const jugador2 = nombreJugadores.jugador2;
    const jugador3 = nombreJugadores.jugador3;
    const jugador4 = nombreJugadores.jugador4;

    const [empezarHabilitado, setEmpezarHabilitado] = useState(false);
    const [jugadores, setJugadores] = useState(['Esperando jugador', 'Esperando jugador', 'Esperando jugador']);

    function handleNuevoClick() {
        setJugadores(['Menganito', 'Fulanito', 'Jose']);
        setEmpezarHabilitado(true);

    }
    return (
        <div className="Main-Header | Common-Header">
             <img src={logo} className="newGame-logo" alt="logo" />
            <div className='pantalla-container'>
                <h2>GAME CODE:  {codigoPartida} </h2>
                <div className='usuario-container'>
                    {userName}
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
                
                <button className='newGame-btn' disabled={!empezarHabilitado}>
                    {empezarHabilitado ? (
                        <Link to="/Game" className='linkado' >Empezar</Link>) : (
                            <span className="disabled">Esperando
                            </span>)
                    }
                </button>
                <button className='lleno-button' onClick={handleNuevoClick} disabled={empezarHabilitado}>
                    Llenar Sala
                </button>
            </div>
        </div>
    );
}

export default NewGame;
