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
                <form className='login-form'>
                    <div className="cover">
                        <h1>Log In</h1>
                        <input type="text" placeholder="EMAIL" />
                        <input type="password" placeholder="PASSWORD" />
                        <Link to='/register' className='linkado'>
                            <a>Register here</a>
                        </Link>
                        <Link to='/main' className='login-btn'>
                                <a className='linkado'>Log In</a>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;