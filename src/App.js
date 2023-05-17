import './styles/Home.css'
import axios from 'axios'
import io from 'socket.io-client';
import Game from "./Game.js"
import logo from './Catan-logo-4.png'
import React, { createContext, useEffect, useState } from 'react'

import Cursor from './images/Cursor.png'

import SoundOnIcon from './images/icons/sound_on.png'
import SoundOffIcon from './images/icons/sound_off.png'
import CatanSong0  from './audio/music/Catan_0.mp3'
import CatanSong1  from './audio/music/Catan_1.mp3'
import CatanSong2  from './audio/music/Catan_2.mp3'
import CatanSong3  from './audio/music/Catan_3.mp3'
import CatanSong4  from './audio/music/Catan_4.mp3'
import CatanSong5  from './audio/music/Catan_5.mp3'
import CatanSong6  from './audio/music/Catan_6.mp3'
import CatanSong7  from './audio/music/Catan_7.mp3'
import CatanSong8  from './audio/music/Catan_8.mp3'
import CatanSong9  from './audio/music/Catan_9.mp3'
import CatanSong10 from './audio/music/Catan_10.mp3'
import CatanSong11 from './audio/music/Catan_11.mp3'
import CatanSong12 from './audio/music/Catan_11.mp3'
import CatanSong13 from './audio/music/Catan_11.mp3'
import CatanSong14 from './audio/music/Catan_11.mp3'
import CatanSong15 from './audio/music/Catan_11.mp3'
import ButtonSound from './audio/effects/Click_0.mp3'

const Songs = [
    CatanSong0,
    CatanSong1,
    CatanSong2,
    CatanSong3,
    CatanSong4,
    CatanSong5,
    CatanSong6,
    CatanSong7,
    CatanSong8,
    CatanSong9,
    CatanSong10,
    CatanSong11,
    CatanSong12,
    CatanSong13,
    CatanSong14,
    CatanSong15
]
export const SocketContext = createContext();

//import storage from './storage.js'
const {GameService} = require('./services/game.service')

//import cbg0 from '../Catan-bg0.jpg'
//import cbg1 from '../Catan-bg1.jpg'
//import cbg2 from '../Catan-bg2.jpg'
//import cbg3 from '../Catan-bg3.jpg'
//import cbg4 from '../Catan-bg4.jpg'
//var backgrounds = [cbg0, cbg1, cbg2, cbg3, cbg4]

function random(min, max) {
    return Math.floor(Math.random() * max) + min;
}

const CustomCursor = ({ cursorImage, mousePosition }) => {

    const cursorStyles = {
        position: 'absolute',
        top: mousePosition.y-5,
        left: mousePosition.x-5,
        width: '40px',
        height: '40px',
        backgroundImage: `url(${cursorImage})`,
        backgroundSize: 'cover',
        pointerEvents: 'none',
        zIndex: 99999
    };

    document.body.style.cursor = 'none';

    const maxCursorX = window.innerWidth - 43
    if (cursorStyles.left > maxCursorX) {
      cursorStyles.left = maxCursorX;
    } else if (mousePosition.x < 0) {
      cursorStyles.left = 0;
    }

    const maxCursorY = window.innerHeight - 43
    if (cursorStyles.top > maxCursorY) {
        cursorStyles.top = maxCursorY
    } else if (mousePosition.Y < 0) {
        cursorStyles.top = 0
    }

    // Hide default cursor on links and input elements
    const hideCursorElements = document.querySelectorAll('a, input, textarea, button');
    hideCursorElements.forEach(element => {
        element.style.cursor = 'none';
    });


    return <div style={cursorStyles} />;
};

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

    const [click] = useState(new Audio(ButtonSound))
    const handleClick = () => {
        click.currentTime = 0
        click.play()
    }
    
    const [audio, setAudio] = useState(new Audio(Songs[random(0, Songs.length)]))
    const [isMuted, setIsMuted] = useState(true)
    useEffect(() => {
        if (!isMuted) {
            audio.play()
            audio.addEventListener("ended", handleAudioEnding);
            return () => {
                audio.removeEventListener("ended", handleAudioEnding);
            };
        } else {
            audio.pause()
        }
    }, [audio, isMuted]);

    const [activeMenu, setActiveMenu] = useState(JSON.parse(sessionStorage.getItem('active-menu')) || 'login')
    const handleMenuChange = (menu) => {
        sessionStorage.setItem('active-menu', JSON.stringify(menu))
        setActiveMenu(menu);
    }

    const handleAudioEnding = () => {
        setAudio(new Audio(Songs[random(0, Songs.length)]))
    }

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const onMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
  
    useEffect(() => {
      window.addEventListener('mousemove', onMouseMove);
  
      return () => {
        window.removeEventListener('mousemove', onMouseMove);
      };
    }, []);

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

        let username         = plainFormData.username;
        let email            = plainFormData.email;
        let password         = plainFormData.password;
        let confirm_password = plainFormData.confirm_password;
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
    // New game action:
    const [socket, setSocket] = useState(null)
    const [lobby, setLobby]   = useState([]);
    const [gameChanged, setGameChanged] = useState(false)

    async function handleSubmit_NewGame(event) {
        // Evita que el formulario se envíe de manera predeterminada
        event.preventDefault();
        let data = await GameService.create()
        if (data.status === 'success') {
            console.log("NEW GAME: ", data)

            setLobby( [JSON.parse(sessionStorage.getItem('user')).name])
            
            sessionStorage.setItem('game-token', JSON.stringify(data.codigo_partida))
            navigator.clipboard.writeText(data.codigo_partida);
            alert("Copied game code: " + data.codigo_partida);

            // Creacion y configuracion del nuevo socket:
            let socket = io('http://localhost:8080/')
            socket.on('error', (err) => { console.log('SOCKET ERROR: ', err)})
            socket.on('new_player', (socket_data) => {
                setLobby(prevStatus => {
                    const nextStatus = [...prevStatus]
                    nextStatus.push(socket_data.username);
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
            // Cambiar al conexto del Game lobby
            handleMenuChange('game-lobby')

            sessionStorage.setItem('my-turn', 0)


            // Persistencia de datos para el juego
            sessionStorage.setItem('build-mode', false)
            sessionStorage.setItem('knight-mode', false)
            sessionStorage.setItem('build-roads', false)
            sessionStorage.setItem('monopoly-mode', false)
            sessionStorage.setItem('year-of-plenty-mode', false)
            sessionStorage.setItem('throw-dices', false)
            sessionStorage.setItem('has-to-build', [true, false])
            sessionStorage.setItem('change-mode', false)
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
            let socket   = io('http://localhost:8080/')
            socket.on('error', (err) => { console.log('SOCKET ERROR:', err) })
            socket.on('new_player', (socket_data) => {
                setLobby(prevStatus => {
                    const nextStatus = [...prevStatus]
                    nextStatus.push(socket_data.username);
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
            socket.emit('joinGame', JSON.parse(sessionStorage.getItem('user')).accessToken, gamecode)
            setSocket(socket)

            // Configuración de los nuevos jugadores:
            setLobby(data.jugadores)
            // Cambiar al conexto del Game lobby:
            setActiveMenu('game-lobby')
            
            sessionStorage.setItem('my-turn', data.jugadores.findIndex(curr_player => curr_player === JSON.parse(sessionStorage.getItem('user')).name))

            // Persistencia de datos para el juego
            sessionStorage.setItem('build-mode', false)
            sessionStorage.setItem('knight-mode', false)
            sessionStorage.setItem('build-roads', false)
            sessionStorage.setItem('monopoly-mode', false)
            sessionStorage.setItem('year-of-plenty-mode', false)
            sessionStorage.setItem('throw-dices', false)
            sessionStorage.setItem('has-to-build', [true, false])
            sessionStorage.setItem('change-mode', false)
        } 
    }

    const gameExit = (newMenu) => {
        console.log('Cambio de modo')
        setActiveMenu(newMenu); // Función para actualizar activeMenu
    };

    // ========================================================================
    // GAME
    // ========================================================================
    return (
        <SocketContext.Provider value={socket}>
            <div>
            <CustomCursor cursorImage={Cursor} mousePosition={mousePosition} />
            <img src={(isMuted) ? SoundOffIcon : SoundOnIcon} className='music-button' alt='change-music-status' onClick={() => setIsMuted(prevStatus => { return !prevStatus})}></img>
            {activeMenu !== 'game' ?
                <div className='common-header'>
                    <div className='error-container'>
                        {errorMessage && (
                            <p style={{color: 'red', textAlign: 'center'}}> {errorMessage} </p>
                        )}
                    </div>

                    <div className='common-container | flex-column-center-center'>
                        <img src={logo} className='common-logo' alt='catan-logo'></img>
                        {activeMenu === 'login' && (
                            <div className='common-content-container | flex-column-center-center'>
                                <div id='Home-up-form' className='flex-column-center-center'>
                                    <form id='login' className='flex-column-center-center' onSubmit={handleSubmit_Login}>
                                        <input className='common-input' type="text" placeholder="Email" name='email' id='email' required />
                                        <input className='common-input' type="password" placeholder="Password" name='password' id='password' required />
                                        <button className='common-button | common-button-activated' type='submit' onClick={handleClick}>Log In</button>
                                        <a href='recover' id='forgor-password'>Did you forget your password?</a>
                                    </form>
                                </div>
                                <div id='Home-down-form'>
                                    <button className='common-button | common-button-activated' onClick={() => {handleClick(); handleMenuChange('register')}}>Register</button>
                                    <button className='common-button | common-button-activated' onClick={() => {handleClick(); handleMenuChange('main-menu')}}>Play without register</button>
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
                                        <button className='common-button | common-button-activated' type='submit' onClick={handleClick}>Register</button>
                                    </form>
                                </div>
                                <div id='Home-down-form'>
                                    <button className='common-button | common-button-activated' onClick={() => {handleClick(); handleMenuChange('login')} }>Log in</button>
                                    <button className='common-button | common-button-activated' onClick={() => {handleClick(); handleMenuChange('main-menu')}}>Play without register</button>
                                </div>
                            </div>
                        )}

                        {activeMenu === 'main-menu' && (
                            <div className='common-content-container | flex-column-center-center'>
                                <button className='common-button | common-button-activated' onClick={(event) => { handleClick(); handleSubmit_NewGame(event) }}>New game</button>
                                <button className='common-button | common-button-activated' onClick={() => { handleClick(); handleMenuChange('join-game') }}>Join game</button>
                                <button className='common-button | common-button-deactivated'>Find a game</button>
                                <button className='common-button | common-button-activated' onClick={() => { handleClick(); handleMenuChange('login') } }>Return</button>
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
                                    <button className={lobby.length < 4 ? 'common-button | common-button-deactivated' : 'common-button | common-button-activated'} onClick={() => { handleClick(); GameService.start(JSON.parse(sessionStorage.getItem('game-token')) );}}>Play</button>
                                )}
                                <button className='common-button | common-button-activated' onClick={() => { handleClick(); handleMenuChange('main-menu')} }>Return</button>
                            </div>
                        )}

                        {activeMenu === 'join-game' && (
                            <div className='common-content-container | flex-column-center-center'>
                                <form id='join-game' className='flex-column-center-center' onSubmit={handleSubmit_JoinGame}>
                                    <input name='gamecode' id='gamecode' className='common-input' type="text" placeholder="Game code" value={gamecodeInput} maxLength={6} onChange={handleChange} required />
                                    <button className='common-button | common-button-activated' type='submit' onClick={handleClick}>Join</button>
                                </form>
                                <button className='common-button | common-button-activated' onClick={() => { handleClick();handleMenuChange('main-menu')}}>Return</button>
                            </div>
                        )}
                    </div>
                </div>
                :
                <Game gameChanged ={gameChanged} gameExit={gameExit} />
            }
            </div>
        </SocketContext.Provider>
    )
}

export default App;



