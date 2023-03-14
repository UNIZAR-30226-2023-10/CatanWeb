import React from 'react';
import {Link} from 'react-router-dom'
import logo from './Catan-logo-1.png'
import './Login.css'
import './Common.css'

function Login() {
    return (
        <div className='Login-header | Common-Header'>
            <div className='Login-container'>
                <img src={logo} className="Login-logo" alt="logo" />
                <div className='Login-form'>
                    <Link className='Common-button' to='/'>Volver pa' tras</Link>
                    <Link className='Common-button' to='/main'>Iniciar sesión</Link>
                </div>
            </div>

        </div>
    )
}

export default Login;