import './styles/Home.css'
import axios from 'axios'
import io from 'socket.io-client';
import Game from "./Game.js"
import logo from './Catan-logo-4.png'
import React, { createContext, useState } from 'react'
import Routes from './services/routes';

export const SocketContext = createContext();

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
 *  - Mejorar los mensajes de error. (PRIORIDAD MAXIMA).
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
    // ========================================================================
    // MAIN MENU STATE
    // ========================================================================
    // New game action:
    const [socket, setSocket] = useState(io('http://localhost:8080/'))
    const [lobby, setLobby]   = useState([]);
    const [gameChanged, setGameChanged] = useState(false)
    const [activeMenu, setActiveMenu] = useState(JSON.parse(sessionStorage.getItem('active-menu')) || 'login')
    const handleMenuChange = (menu) => {
        if (JSON.parse(sessionStorage.getItem('game-token'))){
            // let socket   = io('http://localhost:8080/')
            socket.emit('unjoin', JSON.parse(sessionStorage.getItem('user')).accessToken,JSON.parse(sessionStorage.getItem('game-token')))
        }
        sessionStorage.setItem('active-menu', JSON.stringify(menu))
        setActiveMenu(menu);
    }

    const [registerError, setRegisterError] = useState('')
    const [loginError, setLoginError] = useState('')
    const [joinGameError, setJoinGameError] = useState('')
    // ========================================================================
    // LOGIN STATE
    // ========================================================================
    function handleSubmit_Login(event) {

        // Evita que el formulario se envíe de manera predeterminada
        event.preventDefault(); 
        setLoginError('');
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
        let partidasEmpezadas;
        let email    = plainFormData.email;
        let password = plainFormData.password;
        axios.post('http://localhost:8080/api/login', {
            email,
            password
        })
        .then((response) => {
            if (response.data.accessToken) {
                user.name        = response.data.username;
                user.accessToken = response.data.accessToken;
                partidasEmpezadas = response.data.partidas;
                sessionStorage.setItem('user', JSON.stringify(user));
                if (!partidasEmpezadas || partidasEmpezadas.length === 0) {
                    let socket = io('http://localhost:8080/')
                    socket.on('update', (game) => {
                        sessionStorage.setItem('game', JSON.stringify(game))
                        sessionStorage.setItem('my-turn', 
                            game.players.findIndex(curr_player => curr_player === JSON.parse(sessionStorage.getItem('user')).name))
                        setGameChanged(prevStatus => {
                            return !prevStatus
                        })
                        console.log("LA PARTIDA/TABLERO: ", game)
                        handleMenuChange('game') // Redirigir a la página de juego
                    });
                    socket.emit('joinGame', JSON.parse(sessionStorage.getItem('user')).accessToken,partidasEmpezadas[0]);
                    setSocket(socket)
                    // Cambiar al conexto del Game lobby
                    handleMenuChange('game-lobby')
                    

                }
                sessionStorage.setItem('user', JSON.stringify(user))
                console.log("NEW LOGIN: ", response.data, user)
                handleMenuChange('main-menu')
            } else {
                return response.json().then(err => { throw new Error(err.error.message) })
            }
        })
        .catch((error) => {
            console.log(error.response.data);
            setLoginError("Correo o contraseña incorrectos.");
        })
    }


    const handleChangeRecovery = (event) => {
        const input = event.target.value;
            setRecoveryEmail(input);
    };

    const [recoveryEmail, setRecoveryEmail] = useState('');

    function handleSubmit_Recover (event) {
        event.preventDefault();
        const form = document.getElementById('reset-pass');
        const formData = new FormData(form);
        // Crea un diccionario con los campos del formulario.
        const plainFormData = Object.fromEntries(formData.entries());

        let email = plainFormData.email;
        console.log(email)

        axios.post('http://localhost:8080/api/recover', {
            email
        }).then(() => {
            handleMenuChange('login');
        })
        .catch((error) => {
            console.log(error);
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

        let username         = plainFormData.username;
        let email            = plainFormData.email;
        let password         = plainFormData.password;
        let confirm_password = plainFormData.confirm_password;
        if (password !== confirm_password) {
            setRegisterError("Las contraseñas deben coincidir.")
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
            if (error.response.data.code === 11000) {
                setRegisterError("Este correo ya está registrado.");
            } else if (error.response.data.errors.email.name === 'ValidatorError') {
                setRegisterError("El correo electronico no es valido.");
            }
        })
    }

    async function handleSubmit_NewGame(event) {
        // Evita que el formublanklario se envíe de manera predeterminada
        event.preventDefault();
        let data = await GameService.create()
        if (data.status === 'success') {
            console.log("NEW GAME: ", data)

            setLobby( [JSON.parse(sessionStorage.getItem('user')).name])
            
            sessionStorage.setItem('game-token', JSON.stringify(data.codigo_partida))

            // Creacion y configuracion del nuevo socket:
            // let socket = io('http://localhost:8080/')
            socket.on('error', (err) => { console.log('SOCKET ERROR: ', err)})
            socket.on('new_player', (socket_data) => {
                setLobby(prevStatus => {
                    const nextStatus = [...prevStatus]
                    nextStatus.push(socket_data.username);
                    return nextStatus
                })
            })
            socket.on('delete_player', (username) => {
                
                setLobby(prevStatus =>{
                    let nextStatus = prevStatus.filter(user => user != username)
                    return nextStatus
                })
            })
            socket.on('update', (game) => {
                sessionStorage.setItem('game', JSON.stringify(game))
                setGameChanged(prevStatus => {
                    return !prevStatus
                })
                console.log("LA PARTIDA/TABLERO: ", game)
                handleMenuChange('game') // Redirigir a la página de juego
            });
            socket.emit('joinGame', JSON.parse(sessionStorage.getItem('user')).accessToken, data.codigo_partida)
            setSocket(socket)
            // Guardar mi orden de turno
            sessionStorage.setItem('my-turn', 0)
            // Cambiar al conexto del Game lobby
            handleMenuChange('game-lobby')
        }
    }

    // Join game action:
    const [gamecodeInput, setGamecodeInput] = useState('');
    const handleChange = (event) => {
        const input = event.target.value;
        const numbers = /^[0-9]*$/; // expresión regular para solo aceptar números
        if (input.match(numbers) && input.length <= 6) {
            setGamecodeInput(input);
        }
    };


    async function handleSubmit_JoinGame(event) {
        // Evita que el formulario se envíe de manera predeterminada
        event.preventDefault();
        // Obtiene la referencia del formulario que se envió
        const form = document.getElementById('join-game');
        // Crea una instancia de FormData para los valores de los campos de entrada
        const formData = new FormData(form);
        // Crea un diccionario con los campos del formulario.
        const plainFormData = Object.fromEntries(formData.entries());

        let gamecode = plainFormData.gamecode, data = await GameService.join(gamecode)
        sessionStorage.setItem('game-token', JSON.stringify(gamecode))
        setLobby([null, null, null, null, 0, 'guest'])
        console.log("JOINING GAME DATA: ", data)
        if (data.status === 'success') {
            // Creacion y configuracion del nuevo socket:
            // let socket   = io('http://localhost:8080/')
            socket.on('error', (err) => { console.log('SOCKET ERROR:', err) })
            socket.on('new_player', (socket_data) => {
                setLobby(prevStatus => {
                    const nextStatus = [...prevStatus]
                    nextStatus.push(socket_data.username);
                    return nextStatus
                })
            })
            socket.on('delete_player', (username) => {
                
                setLobby(prevStatus =>{
                    let nextStatus = prevStatus.filter(user => user != username)
                    return nextStatus
                })
            })

            socket.on('cancel_game', ()=>{
                handleMenuChange('main-menu')
            })
            socket.on('update', (game) => {
                sessionStorage.setItem('game', JSON.stringify(game))
                setGameChanged(prevStatus => {
                    return !prevStatus
                })
                console.log("LA PARTIDA/TABLERO: ", game)
                handleMenuChange('game') // Redirigir a la página de juego
            });
            socket.emit('joinGame', JSON.parse(sessionStorage.getItem('user')).accessToken, gamecode)
            setSocket(socket)

            // Configuración de los nuevos jugadores:
            setLobby(data.jugadores)
            // Guardar mi orden de turno:
            sessionStorage.setItem('my-turn', 
                data.jugadores.findIndex(curr_player => curr_player === JSON.parse(sessionStorage.getItem('user')).name))
            // Cambiar al conexto del Game lobby:
            setActiveMenu('game-lobby')
        }
    }

    // ========================================================================
    // GAME
    // ========================================================================
    return (
        <SocketContext.Provider value={socket}>
            <div>
            {activeMenu !== 'game' ?
                <div className='common-header'>
                    <div className='common-container | flex-column-center-center'>
                        <img src={logo} className='common-logo' alt='catan-logo'></img>
                        {activeMenu === 'login' && (
                            <div className='common-content-container | flex-column-center-center'>
                                <div id='Home-up-form' className='flex-column-center-center'>
                                    <form id='login' className='flex-column-center-center' onSubmit={handleSubmit_Login}>
                                        <input className='common-input' type="text" placeholder="Email" name='email' id='email' required />
                                        <input className='common-input' type="password" placeholder="Password" name='password' id='password' required />
                                        <button className='common-button | common-button-activated' type='submit'>Log In</button>
                                        <a onClick={() => handleMenuChange('reset-password')} id='forgor-password'>Did you forget your password?</a>
                                    </form>
                                {loginError && (
                                    <p style={{color: 'red',fontSize: '16px'}}> {loginError} </p>
                                )}
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
                                    {registerError && (
                                        <p style={{color: 'red', fontSize: '16px'}}> {registerError} </p>
                                    )}
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
                                    {lobby.length < 1 ? (
                                        <section>
                                            <svg className="spinner" viewBox="0 0 16 18">
                                                <path className="path" fill="none" strokeWidth="2" d="M7.21487 1.2868C7.88431 0.9044 8.73031 0.9044 9.39974 1.2868L9.40283 1.28856L14.4613 4.20761C15.1684 4.598 15.5746 5.33558 15.5746 6.11465V8.99996V11.8853C15.5746 12.6507 15.1632 13.3848 14.4617 13.7721L9.37973 16.7132C8.71029 17.0956 7.86428 17.0956 7.19485 16.7132L7.19088 16.7109L2.11279 13.772C1.40602 13.3816 1 12.6441 1 11.8653V8.98995V6.11465C1 5.31458 1.44381 4.59039 2.10827 4.21051L7.21487 1.2868Z" />
                                            </svg>
                                        </section>
                                    ) : (
                                        <div>{lobby[0]}</div>
                                    )}
                                </div>

                                <div className='waiting-player | flex-column-center-center'>
                                    {lobby.length < 2 ? (
                                        <section>
                                            <svg className="spinner" viewBox="0 0 16 18">
                                                <path className="path" fill="none" strokeWidth="2" d="M7.21487 1.2868C7.88431 0.9044 8.73031 0.9044 9.39974 1.2868L9.40283 1.28856L14.4613 4.20761C15.1684 4.598 15.5746 5.33558 15.5746 6.11465V8.99996V11.8853C15.5746 12.6507 15.1632 13.3848 14.4617 13.7721L9.37973 16.7132C8.71029 17.0956 7.86428 17.0956 7.19485 16.7132L7.19088 16.7109L2.11279 13.772C1.40602 13.3816 1 12.6441 1 11.8653V8.98995V6.11465C1 5.31458 1.44381 4.59039 2.10827 4.21051L7.21487 1.2868Z" />
                                            </svg>
                                        </section>
                                    ) : (
                                        <div>{lobby[1]}</div>
                                    )}
                                </div>

                                <div className='waiting-player | flex-column-center-center'>
                                    {lobby.length < 3 ? (
                                        <section>
                                            <svg className="spinner" viewBox="0 0 16 18">
                                                <path className="path" fill="none" strokeWidth="2" d="M7.21487 1.2868C7.88431 0.9044 8.73031 0.9044 9.39974 1.2868L9.40283 1.28856L14.4613 4.20761C15.1684 4.598 15.5746 5.33558 15.5746 6.11465V8.99996V11.8853C15.5746 12.6507 15.1632 13.3848 14.4617 13.7721L9.37973 16.7132C8.71029 17.0956 7.86428 17.0956 7.19485 16.7132L7.19088 16.7109L2.11279 13.772C1.40602 13.3816 1 12.6441 1 11.8653V8.98995V6.11465C1 5.31458 1.44381 4.59039 2.10827 4.21051L7.21487 1.2868Z" />
                                            </svg>
                                        </section>
                                    ) : (
                                        <div>{lobby[2]}</div>
                                    )}
                                </div>

                                <div className='waiting-player | flex-column-center-center'>
                                    {lobby.length < 4 ? (
                                        <section>
                                            <svg className="spinner" viewBox="0 0 16 18">
                                                <path className="path" fill="none" strokeWidth="2" d="M7.21487 1.2868C7.88431 0.9044 8.73031 0.9044 9.39974 1.2868L9.40283 1.28856L14.4613 4.20761C15.1684 4.598 15.5746 5.33558 15.5746 6.11465V8.99996V11.8853C15.5746 12.6507 15.1632 13.3848 14.4617 13.7721L9.37973 16.7132C8.71029 17.0956 7.86428 17.0956 7.19485 16.7132L7.19088 16.7109L2.11279 13.772C1.40602 13.3816 1 12.6441 1 11.8653V8.98995V6.11465C1 5.31458 1.44381 4.59039 2.10827 4.21051L7.21487 1.2868Z" />
                                            </svg>
                                        </section>
                                    ) : (
                                        <div>{lobby[3]}</div>
                                    )}
                                </div>
                                {lobby[0] === JSON.parse(sessionStorage.getItem('user')).name && (
                                    <button className={lobby.length < 4 ? 'common-button | common-button-deactivated' : 'common-button | common-button-activated'} onClick={() => {GameService.start(JSON.parse(sessionStorage.getItem('game-token')) ); console.log("Empiezo startGame");}}>Play</button>
                                )}
                                <button className='common-button | common-button-activated' onClick={() => { handleMenuChange('main-menu')} }>Return</button>
                                
                            </div>
                        )}

                        {activeMenu === 'join-game' && (
                            <div className='common-content-container | flex-column-center-center'>
                                <form id='join-game' className='flex-column-center-center' onSubmit={handleSubmit_JoinGame}>
                                    <input name='gamecode' id='gamecode' className='common-input' type="text" placeholder="Game code" value={gamecodeInput} maxLength={6} onChange={handleChange} required />
                                    <button className='common-button | common-button-activated' type='submit'>Join</button>
                                </form>
                                <button className='common-button | common-button-activated' onClick={() => { 
                                    handleMenuChange('main-menu');
                                    socket.emit('unjoin', JSON.parse(sessionStorage.getItem('game-token')));
                                }}>Return</button>
                            </div>
                        )}

                        {activeMenu === 'reset-password' && (
                            <div className='common-content-container | flex-column-center-center'>
                                <form id='reset-pass' className='flex-column-center-center' onSubmit={handleSubmit_Recover} >
                                    <input name='email' id='email' className='common-input' type="text" placeholder="Introduzca su correo " value={recoveryEmail} onChange={handleChangeRecovery} required />
                                    <button className='common-button | common-button-activated' type='submit'>Enviar</button>
                                </form>
                                <button className='common-button | common-button-activated' onClick={() => { 
                                    handleMenuChange('login');
                                }}>Return</button>
                            </div>
                        )}
                    </div>
                </div>
                :
                <Game gameChanged={gameChanged} />
            }
            </div>
        </SocketContext.Provider>
    )
}

export default App;



