import './styles/Home.css'
import axios from 'axios'
import io from 'socket.io-client';
import Game from "./Game.js"
import logo from './Catan-logo-4.png'
import React, { createContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';


const {GameService} = require('./services/game.service')


export const SocketContext = createContext();

function Recover() {

    const navigate = useNavigate();
    const location = useLocation();
    const [passwordError, setPasswordError] = useState('')


    async function handleSubmit_PasswordRecovery (event) {
        event.preventDefault();



        const form = document.getElementById('recover-password');
        // Crea una instancia de FormData para los valores de los campos de entrada
        const formData = new FormData(form);
        // Crea un diccionario con los campos del formulario.
        const plainFormData = Object.fromEntries(formData.entries());

        const searchParams = new URLSearchParams(location.search);
        const  token = searchParams.get('token'); // replace 'yourParam' with the name of your query parameter

        let password = plainFormData.password;
        let repeatpassword = plainFormData.repeatpassword;

        if (repeatpassword != password) {
            setPasswordError("Las contraseñas no coinciden");
            return
        }

        let user = {};
        user.name        = 'null';
        user.accessToken = token
        sessionStorage.setItem('user', JSON.stringify(user));

        let data = await GameService.update(password);

        if (!data) {

        }
        else {
            navigate('/');
        }

    }

   return (
                <div className='common-header'>
                    <div className='common-container | flex-column-center-center'>
                        <img src={logo} className='common-logo' alt='catan-logo'></img>
                            <div className='common-content-container | flex-column-center-center'>
                                <div id='Home-up-form' className='flex-column-center-center'>
                                    <form id='recover-password' className='flex-column-center-center' onSubmit={handleSubmit_PasswordRecovery}>
                                        <input className='common-input' type="password" placeholder="Introduzca su nueva contraseña" name='password' id='password' required />
                                        <input className='common-input' type="password" placeholder="Repita la  contraseña" name='repeatpassword' id='repeatpassword' required />
                                        <button className='common-button | common-button-activated' type='submit'>Reestablecer</button>
                                        {passwordError && (
                                            <p style={{color: 'red', fontSize: '16px'}}> {passwordError} </p>
                                        )}
                                    </form>
                                </div>
                            </div>
                    </div>
                </div>
    )
}

export default Recover;



