import './styles/Home.css'
import axios from 'axios'
import io from 'socket.io-client';
import logo from './Catan-logo-4.png'
import React, { useState } from 'react'

//import storage from './storage.js'
const {GameService} = require('./services/game.service')


//import cbg0 from '../Catan-bg0.jpg'
//import cbg1 from '../Catan-bg1.jpg'
//import cbg2 from '../Catan-bg2.jpg'
//import cbg3 from '../Catan-bg3.jpg'
//import cbg4 from '../Catan-bg4.jpg'
//var backgrounds = [cbg0, cbg1, cbg2, cbg3, cbg4]

/**
 * Cosas que faltan por hacer:
 *  - Mejorar los PUTOS mensajes de error. (PRIORIDAD MAXIMA).
 *  - Mantener la sesión iniciada.
 *  - Si el usuario ya ha iniciado sesión, no puede iniciar en otra parte.
 *  - Hacer el diseño responsive (muy opcional).
 */
function App() {

    //const [backgroundImg, setBackgroundImg] = useState(`url(${backgrounds[Math.floor(Math.random() * 5)]})`)
    //useEffect(() => {
    //    const intervalId = setInterval(() => {
    //        setBackgroundImg(`url(${backgrounds[Math.floor(Math.random() * 5)]})`)
    //    }, 5000);
    //})

    const [activeMenu, setActiveMenu] = useState('login')
    const handleMenuChange = (menu) => {
        setActiveMenu(menu);
    }

    const [errorMessage, setErrorMessage] = useState('')
    // ========================================================================
    // LOGIN STATE
    // ========================================================================
    function handleSubmit_Login(event) {

        // Evita que el formulario se envíe de manera predeterminada
        event.preventDefault(); 

        // Aquí se pueden agregar otras validaciones de entrada antes de enviar el formulario
        // Si algo no es válido, se puede detener la ejecución de esta función o mostrar un mensaje de error
    
        const user = {
            name: '',
            accessToken: ''
        };

        // Obtiene la referencia del formulario que se envió
        const form = document.getElementById('login');
        // Crea una instancia de FormData para los valores de los campos de entrada
        const formData = new FormData(form);
        // Crea un diccionario con los campos del formulario.
        const plainFormData = Object.fromEntries(formData.entries());
    
        // Enviar los datos del formulario a través de una solicitud
        var email    = plainFormData.email;
        var password = plainFormData.password;
        axios.post('http://localhost:8080/api/login', {
            email,
            password
        })
        .then((response) => {
            if (response.data.accessToken) {
                user.name        = response.data.username;
                user.accessToken = response.data.accessToken;
                sessionStorage.setItem('user', JSON.stringify(user))
                console.log("NEW LOGIN: ", response.data, user)
                handleMenuChange('main-menu')
            } else {
                return response.json().then(err => { throw new Error(err.error.message) })
            }
        })
        .catch((error) => {
            console.log(error.response.data);
            setErrorMessage(error.toString());
        })
    }

    // ========================================================================
    // REGISTER STATE
    // ========================================================================
    function handleSubmit_Register(event) {

        // Evita que el formulario se envíe de manera predeterminada
        event.preventDefault();

        // Aquí se pueden agregar otras validaciones de entrada antes de enviar el formulario
        // Si algo no es válido, se puede detener la ejecución de esta función o mostrar un mensaje de error
        const user = {
            name: '',
            accessToken: ''
        };

        // Obtiene la referencia del formulario que se envió
        const form = document.getElementById('register');
        // Crea una instancia de FormData para los valores de los campos de entrada
        const formData = new FormData(form);
        // Crea un diccionario con los campos del formulario.
        const plainFormData = Object.fromEntries(formData.entries());

        var username         = plainFormData.username;
        var email            = plainFormData.email;
        var password         = plainFormData.password;
        var confirm_password = plainFormData.confirm_password;
        if (password !== confirm_password) {
            setErrorMessage("Passwords must coincide.")
            return
        }

        // Enviar los datos del formulario a través de una solicitud
        axios.post('http://localhost:8080/api/register', {
            username,
            email,
            password,
            confirm_password
        })
        .then((response) => {
            if (response.data.accessToken) {
                user.name        = username;
                user.accessToken = response.data.accessToken;
                sessionStorage.setItem('user', JSON.stringify(user));
                console.log("NEW REGISTER: ", response.data, user)
                handleMenuChange('main-menu')
            } else {
                return response.json().then(err => { throw new Error(err.error.message) })
            }
        })
        .catch((error) => {
            console.log(error.response.data);
            setErrorMessage(error.toString());
        })
    }

    // ========================================================================
    // MAIN MENU STATE
    // ========================================================================
    const [socket, setSocket] = useState(null)
    async function handleSubmit_NewGame(event) {
        // Evita que el formulario se envíe de manera predeterminada
        event.preventDefault();

        let data = await GameService.create()
        console.log("NEW GAME: ", data)
        sessionStorage.setItem('game-token', JSON.stringify(data.codigo_partida))
        sessionStorage.setItem('players', JSON.stringify([
            JSON.parse(sessionStorage.getItem('user')).name,
            null,
            null,
            null,
            1
        ]))
        if (data.status === 'success') {
            handleMenuChange('game-lobby')
            return setSocket(io('http://localhost:8080/'))
        }
        return null 
    }

    //let socket;
    //if (activeMenu === 'game-lobby') {
    //    socket = io('http://localhost:8080/')
    //    socket.emit('joinGame', JSON.parse(sessionStorage.getItem('user')).accessToken, JSON.parse(sessionStorage.getItem('game-token')))
    //    socket.on('error', (err) => { console.log('SOCKET ERROR: ', err) })
    //    socket.on('new_player', (data) => {
    //        console.log('SOCKET NEW PLAYER: ', data)
    //        
    //    })
    //}

    // ========================================================================
    // GAME-LOBBY STATE
    // ========================================================================

    return (
        <div className='common-header'>
            {errorMessage && (
                <p style={{color: 'red'}}> {errorMessage} </p>
            )}

            <div className='common-container | flex-column-center-center'>
                <img src={logo} className='common-logo' alt='catan-logo'></img>
                    {
                     // =======================================================
                     // LOGIN STATE
                     // =======================================================
                    }
                    {activeMenu === 'login' && (
                        <div className='common-content-container | flex-column-center-center'>
                            <div id='Home-up-form' className='flex-column-center-center'>
                                <form id='login' className='flex-column-center-center' onSubmit={handleSubmit_Login}>
                                    <input className='common-input' type="text" placeholder="Email" name='email' id='email' required />
                                    <input className='common-input' type="password" placeholder="Password" name='password' id='password' required />
                                    <button className='common-button | common-button-activated' type='submit'>Log In</button>
                                    <a href='recover' id='forgor-password'>Did you forget your password?</a>
                                </form>
                            </div>
                            <div id='Home-down-form'>
                                <button className='common-button | common-button-activated' onClick={() => handleMenuChange('register')}>Register</button>
                                <button className='common-button | common-button-activated' onClick={() => handleMenuChange('main-menu')}>Play without register</button>
                            </div>
                        </div>
                    )}

                    {activeMenu === 'register' && (
                        <div className='common-content-container | flex-column-center-center'>
                            <div id='Home-up-form' className='flex-column-center-center'>
                                <form id='register' className='flex-column-center-center' onSubmit={handleSubmit_Register}>
                                    <input className='common-input' type="text" placeholder="Email" name='email' id='email' required />
                                    <input className='common-input' type="text" placeholder="Username" name='username' id='username' required />
                                    <input className='common-input' type="password" placeholder="Password" name='password' id='password' required />
                                    <input className='common-input' type="password" placeholder="Repeat password" name='confirm_password' id='confirm_password' required />
                                    <button className='common-button | common-button-activated' type='submit'>Register</button>
                                </form>
                            </div>
                            <div id='Home-down-form'>
                                <button className='common-button | common-button-activated' onClick={() => handleMenuChange('login')}>Log in</button>
                                <button className='common-button | common-button-activated' onClick={() => handleMenuChange('main-menu')}>Play without register</button>
                            </div>
                        </div>
                    )}

                    {activeMenu === 'main-menu' && (
                        <div className='common-content-container | flex-column-center-center'>
                            <button className='common-button | common-button-activated' onClick={handleSubmit_NewGame}>New game</button>
                            <button className='common-button | common-button-activated' onClick={() => handleMenuChange('join-game')}>Join game</button>
                            <button className='common-button | common-button-deactivated'>Find a game</button>
                            <button className='common-button | common-button-activated' onClick={() => handleMenuChange('login')}>Return</button>
                        </div>
                    )}

                    {activeMenu === 'game-lobby' && (
                        <div className='common-content-container | flex-column-center-center'>
                            <h2 id='game-code'>{JSON.parse(sessionStorage.getItem('game-token'))}</h2>
                            <div className='waiting-player | flex-column-center-center'>
                                {JSON.parse(sessionStorage.getItem('players'))[0] === null ? (
                                    <section>
                                        <svg className="spinner" viewBox="0 0 16 18">
                                            <path className="path" fill="none" strokeWidth="2" d="M7.21487 1.2868C7.88431 0.9044 8.73031 0.9044 9.39974 1.2868L9.40283 1.28856L14.4613 4.20761C15.1684 4.598 15.5746 5.33558 15.5746 6.11465V8.99996V11.8853C15.5746 12.6507 15.1632 13.3848 14.4617 13.7721L9.37973 16.7132C8.71029 17.0956 7.86428 17.0956 7.19485 16.7132L7.19088 16.7109L2.11279 13.772C1.40602 13.3816 1 12.6441 1 11.8653V8.98995V6.11465C1 5.31458 1.44381 4.59039 2.10827 4.21051L7.21487 1.2868Z" />
                                        </svg>
                                    </section>
                                ) : (
                                    <div>Player 1: {JSON.parse(sessionStorage.getItem('players'))[0]}</div>
                                )}
                            </div>

                            <div className='waiting-player | flex-column-center-center'>
                                {JSON.parse(sessionStorage.getItem('players'))[1] === null ? (
                                    <section>
                                        <svg className="spinner" viewBox="0 0 16 18">
                                            <path className="path" fill="none" strokeWidth="2" d="M7.21487 1.2868C7.88431 0.9044 8.73031 0.9044 9.39974 1.2868L9.40283 1.28856L14.4613 4.20761C15.1684 4.598 15.5746 5.33558 15.5746 6.11465V8.99996V11.8853C15.5746 12.6507 15.1632 13.3848 14.4617 13.7721L9.37973 16.7132C8.71029 17.0956 7.86428 17.0956 7.19485 16.7132L7.19088 16.7109L2.11279 13.772C1.40602 13.3816 1 12.6441 1 11.8653V8.98995V6.11465C1 5.31458 1.44381 4.59039 2.10827 4.21051L7.21487 1.2868Z" />
                                        </svg>
                                    </section>
                                ) : (
                                    <div>Player 2: {JSON.parse(sessionStorage.getItem('players'))[1]}</div>
                                )}
                            </div>

                            <div className='waiting-player | flex-column-center-center'>
                                {JSON.parse(sessionStorage.getItem('players'))[2] === null ? (
                                    <section>
                                        <svg className="spinner" viewBox="0 0 16 18">
                                            <path className="path" fill="none" strokeWidth="2" d="M7.21487 1.2868C7.88431 0.9044 8.73031 0.9044 9.39974 1.2868L9.40283 1.28856L14.4613 4.20761C15.1684 4.598 15.5746 5.33558 15.5746 6.11465V8.99996V11.8853C15.5746 12.6507 15.1632 13.3848 14.4617 13.7721L9.37973 16.7132C8.71029 17.0956 7.86428 17.0956 7.19485 16.7132L7.19088 16.7109L2.11279 13.772C1.40602 13.3816 1 12.6441 1 11.8653V8.98995V6.11465C1 5.31458 1.44381 4.59039 2.10827 4.21051L7.21487 1.2868Z" />
                                        </svg>
                                    </section>
                                ) : (
                                    <div>Player 3: {JSON.parse(sessionStorage.getItem('players'))[2]}</div>
                                )}
                            </div>

                            <div className='waiting-player | flex-column-center-center'>
                                {JSON.parse(sessionStorage.getItem('players'))[3] === null ? (
                                    <section>
                                        <svg className="spinner" viewBox="0 0 16 18">
                                            <path className="path" fill="none" strokeWidth="2" d="M7.21487 1.2868C7.88431 0.9044 8.73031 0.9044 9.39974 1.2868L9.40283 1.28856L14.4613 4.20761C15.1684 4.598 15.5746 5.33558 15.5746 6.11465V8.99996V11.8853C15.5746 12.6507 15.1632 13.3848 14.4617 13.7721L9.37973 16.7132C8.71029 17.0956 7.86428 17.0956 7.19485 16.7132L7.19088 16.7109L2.11279 13.772C1.40602 13.3816 1 12.6441 1 11.8653V8.98995V6.11465C1 5.31458 1.44381 4.59039 2.10827 4.21051L7.21487 1.2868Z" />
                                        </svg>
                                    </section>
                                ) : (
                                    <div>Player 4: {JSON.parse(sessionStorage.getItem('players'))[3]}</div>
                                )}
                            </div>
                            <button className='common-button | common-button-activated'>Play</button>
                            <button className='common-button | common-button-activated' onClick={() => handleMenuChange('main-menu')}>Return</button>
                        </div>
                    )}

                    {activeMenu === 'join-game' && (
                        <div className='common-content-container | flex-column-center-center'>
                            <form className='flex-column-center-center'>
                                <input className='common-input' type="text" placeholder="Game code" name='gamecode' id='gamecode' required />
                                <button className='common-button | common-button-activated' type='submit'>Join</button>
                            </form>
                            <button className='common-button | common-button-activated' onClick={() => handleMenuChange('main-menu')}>Return</button>
                        </div>
                    )}
            </div>
        </div>
    )
}

export default App;
