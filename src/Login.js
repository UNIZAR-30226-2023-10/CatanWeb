import React from 'react';
import {Link} from 'react-router-dom'
import logo from './Catan-logo-1.png'
import './Login.css'
import './Common.css'

function Login() {
    return (
        <div className='Login-header | Main-Header'>
            <div className='Login-container'>
                <img src={logo} className="Login-logo" alt="logo" />
                <div className='Login-form'>
                    <button className='Login-button'>
                        <Link to='/'>Volver pa tras</Link>
                    </button>
                    <button className='Login-button'>
                        <Link to='/main'>Iniciar sesión</Link>
                    </button>
                </div>
            </div>

        </div>
    )
}

export default Login;