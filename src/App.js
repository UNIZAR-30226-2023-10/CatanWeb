import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './styles/Home.css'
import logo from './Catan-logo-4.png'
//import cbg0 from '../Catan-bg0.jpg'
//import cbg1 from '../Catan-bg1.jpg'
//import cbg2 from '../Catan-bg2.jpg'
//import cbg3 from '../Catan-bg3.jpg'
//import cbg4 from '../Catan-bg4.jpg'
//var backgrounds = [cbg0, cbg1, cbg2, cbg3, cbg4]

function App() {

    //const [backgroundImg, setBackgroundImg] = useState(`url(${backgrounds[Math.floor(Math.random() * 5)]})`)
    //useEffect(() => {
    //    const intervalId = setInterval(() => {
    //        setBackgroundImg(`url(${backgrounds[Math.floor(Math.random() * 5)]})`)
    //    }, 5000);
    //})

    const [activeMenu, setActiveMenu] = useState("login")
    const handleMenuChange = (menu) => {
        setActiveMenu(menu);
    }

    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState("")
    const handleLoginSubmit = (event) => {

        event.preventDefault(); // Evita que el formulario se envíe de manera predeterminada

        // Aquí se pueden agregar otras validaciones de entrada antes de enviar el formulario
        // Si algo no es válido, se puede detener la ejecución de esta función o mostrar un mensaje de error
    
        const form = document.getElementById('Home-log-form'); // Obtiene la referencia del formulario que se envió
        const formData = new FormData(form); // Crea una instancia de FormData para los valores de los campos de entrada
        const plainFormData = Object.fromEntries(formData.entries());
        const formDataJsonString = JSON.stringify(plainFormData);
    
        // Enviar los datos del formulario a través de una solicitud
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: formDataJsonString
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(err => { throw new Error(err.error.message) })
            }
        })
        .then(() => {
            handleMenuChange('main-menu')
        })
        .catch(error => {
            setErrorMessage(error.toString())
        });
    }

    const handleRegisterSubmit = (event) => {

        event.preventDefault(); // Evita que el formulario se envíe de manera predeterminada

        // Aquí se pueden agregar otras validaciones de entrada antes de enviar el formulario
        // Si algo no es válido, se puede detener la ejecución de esta función o mostrar un mensaje de error
        //const email = event.target.email.value;
        //const username = event.target.username.value;
        const password = event.target.password.value;
        const confirm_password = event.target.confirm_password.value;
      
        if (password !== confirm_password) {
          setErrorMessage("Passwords do not match");
          return;
        }

        const form = document.getElementById('Home-reg-form'); // Obtiene la referencia del formulario que se envió
        const formData = new FormData(form); // Crea una instancia de FormData para los valores de los campos de entrada
        const plainFormData = Object.fromEntries(formData.entries());
        const formDataJsonString = JSON.stringify(plainFormData);

        // Enviar los datos del formulario a través de una solicitud
        fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: formDataJsonString
        })
        .then(response => {
            if (response.ok) {
            return response.json();
            } else {
            return response.json().then(err => { throw new Error(err.errors.message) })
            }
        })
        .then(data => {
            navigate("/main")
        })
        .catch(error => {
            setErrorMessage(error.toString())
        });
    }

    return (
        <div className='common-header'>
            <div className='common-container | flex-column-center-center'>
                <img src={logo} className='common-logo' alt='catan-logo'></img>

                    {activeMenu === 'login' && (
                        <div className='common-content-container | flex-column-center-center'>
                            <div id='Home-up-form' className='flex-column-center-center'>
                                <form id='Home-log-form' className='flex-column-center-center' onSubmit={handleLoginSubmit}>
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
                            {errorMessage && (
                                <p style={{color: 'red'}}> {errorMessage} </p>
                            )}
                        </div>
                    )}

                    {activeMenu === 'register' && (
                        <div className='common-content-container | flex-column-center-center'>
                            <div id='Home-up-form' className='flex-column-center-center'>
                                <form id='Home-reg-form' className='flex-column-center-center' onSubmit={handleRegisterSubmit}>
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
                            {errorMessage && (
                                <p style={{color: 'red'}}> {errorMessage} </p>
                            )}
                        </div>
                    )}

                    {activeMenu === 'main-menu' && (
                        <div className='common-content-container | flex-column-center-center'>
                            <button className='common-button | common-button-activated' onClick={() => handleMenuChange('game-lobby')}>New game</button>
                            <button className='common-button | common-button-activated' onClick={() => handleMenuChange('join-game')}>Join game</button>
                            <button className='common-button | common-button-deactivated'>Find a game</button>
                            <button className='common-button | common-button-activated' onClick={() => handleMenuChange('login')}>Return</button>
                        </div>
                    )}

                    {activeMenu === 'game-lobby' && (
                        <div className='common-content-container | flex-column-center-center'>
                            <div className='waiting-player | flex-column-center-center'>
                                <section>
                                    <svg class="spinner" viewBox="0 0 16 18">
                                        <path class="path" fill="none" stroke-width="2" d="M7.21487 1.2868C7.88431 0.9044 8.73031 0.9044 9.39974 1.2868L9.40283 1.28856L14.4613 4.20761C15.1684 4.598 15.5746 5.33558 15.5746 6.11465V8.99996V11.8853C15.5746 12.6507 15.1632 13.3848 14.4617 13.7721L9.37973 16.7132C8.71029 17.0956 7.86428 17.0956 7.19485 16.7132L7.19088 16.7109L2.11279 13.772C1.40602 13.3816 1 12.6441 1 11.8653V8.98995V6.11465C1 5.31458 1.44381 4.59039 2.10827 4.21051L7.21487 1.2868Z" />
                                    </svg>
                                </section>
                            </div>
                            <div className='waiting-player | flex-column-center-center'>
                                <section>
                                    <svg class="spinner" viewBox="0 0 16 18">
                                        <path class="path" fill="none" stroke-width="2" d="M7.21487 1.2868C7.88431 0.9044 8.73031 0.9044 9.39974 1.2868L9.40283 1.28856L14.4613 4.20761C15.1684 4.598 15.5746 5.33558 15.5746 6.11465V8.99996V11.8853C15.5746 12.6507 15.1632 13.3848 14.4617 13.7721L9.37973 16.7132C8.71029 17.0956 7.86428 17.0956 7.19485 16.7132L7.19088 16.7109L2.11279 13.772C1.40602 13.3816 1 12.6441 1 11.8653V8.98995V6.11465C1 5.31458 1.44381 4.59039 2.10827 4.21051L7.21487 1.2868Z" />
                                    </svg>
                                </section>
                            </div>
                            <div className='waiting-player | flex-column-center-center'>
                                <section>
                                    <svg class="spinner" viewBox="0 0 16 18">
                                        <path class="path" fill="none" stroke-width="2" d="M7.21487 1.2868C7.88431 0.9044 8.73031 0.9044 9.39974 1.2868L9.40283 1.28856L14.4613 4.20761C15.1684 4.598 15.5746 5.33558 15.5746 6.11465V8.99996V11.8853C15.5746 12.6507 15.1632 13.3848 14.4617 13.7721L9.37973 16.7132C8.71029 17.0956 7.86428 17.0956 7.19485 16.7132L7.19088 16.7109L2.11279 13.772C1.40602 13.3816 1 12.6441 1 11.8653V8.98995V6.11465C1 5.31458 1.44381 4.59039 2.10827 4.21051L7.21487 1.2868Z" />
                                    </svg>
                                </section>
                            </div>
                            <div className='waiting-player | flex-column-center-center'>
                                <section>
                                    <svg class="spinner" viewBox="0 0 16 18">
                                        <path class="path" fill="none" stroke-width="2" d="M7.21487 1.2868C7.88431 0.9044 8.73031 0.9044 9.39974 1.2868L9.40283 1.28856L14.4613 4.20761C15.1684 4.598 15.5746 5.33558 15.5746 6.11465V8.99996V11.8853C15.5746 12.6507 15.1632 13.3848 14.4617 13.7721L9.37973 16.7132C8.71029 17.0956 7.86428 17.0956 7.19485 16.7132L7.19088 16.7109L2.11279 13.772C1.40602 13.3816 1 12.6441 1 11.8653V8.98995V6.11465C1 5.31458 1.44381 4.59039 2.10827 4.21051L7.21487 1.2868Z" />
                                    </svg>
                                </section>
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
