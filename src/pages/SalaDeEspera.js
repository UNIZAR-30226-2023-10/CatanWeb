import React, { useState } from 'react';
import logo from '../Catan-logo-1.png';
import { Link, useNavigate } from 'react-router-dom';

function SalaDeEspera() {


    const codigoPartidaJSON = localStorage.getItem("gameToken");
    const codigoPartida = JSON.parse(codigoPartidaJSON);
    const userJSON = localStorage.getItem("user");
    const user = JSON.parse(userJSON);
    const userName = user.name;


    const nombreJugadoresJSON = localStorage.getItem("nombreJugadores");
    const nombreJugadores = JSON.parse(nombreJugadoresJSON);
    const jugador2 = nombreJugadores.jugador2;
    const jugador3 = nombreJugadores.jugador3;
    const jugador4 = nombreJugadores.jugador4;
    console.log(jugador2);

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
                        <Link to="/Game" className='linkado'>Empezar</Link>) : (
                        <span className="disabled">Esperando
                        </span>)}
                </button>
                <button className='lleno-button' onClick={handleNuevoClick} disabled={empezarHabilitado}>
                    Llenar Sala
                </button>
            </div>
        </div>
    );
}

export default SalaDeEspera;