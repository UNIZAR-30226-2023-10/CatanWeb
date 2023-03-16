import React, { useState } from 'react';
import '../styles/NewGame.css';
import '../styles/Common.css'
import logo from '../Catan-logo-1.png'
import { Link } from 'react-router-dom';

function NewGame() {
    
    const [empezarHabilitado, setEmpezarHabilitado] = useState(false);
    const [jugadores, setJugadores] = useState(['Esperando', 'Esperando', 'Esperando']);

    function handleNuevoClick() {
        setJugadores(['Menganito', 'Fulanito', 'Jose']);
        setEmpezarHabilitado(true);
    }
    return (
        <div className="Main-Header | Common-Header">
            <div className='pantalla-container'>
                <img src={logo} className="Main-logo" alt="logo" />
                <div className='usuario-container'>
                    Rael
                </div>
                <div className={` ${jugadores[0] === 'Menganito' ? 'usuario-container' : 'esperando-container'}`}>
                    {jugadores[0]}
                </div>
                <div className={` ${jugadores[1] === 'Fulanito' ? 'usuario-container' : 'esperando-container'}`}>
                    {jugadores[1]}
                </div>
                <div className={` ${jugadores[2] === 'Jose' ? 'usuario-container' : 'esperando-container'}`}>
                    {jugadores[2]}
                </div>
                
                <button className='empezar-button' disabled={!empezarHabilitado}>
                    {empezarHabilitado ? (
                        <Link to="/Game">Empezar</Link>) : (
                            <span className="empezar-button disabled">Empezar
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
