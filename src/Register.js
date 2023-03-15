import React from 'react';
import {Link} from 'react-router-dom'
import logo from './Catan-logo-1.png'
import './Register.css'
import './Common.css'

function Register() {
    return (
        <div className='Register-header | Common-Header'>
            <div className='Register-container'>
                <img src={logo} className="Register-logo" alt="logo" />
                <form className='register-form'>
                    <div className="Register-cover">
                        <h1>Register</h1>
                        
                        <input type="text" placeholder="EMAIL" />
                        <input type="text" placeholder="USERNAME" />
                        <input type="password" placeholder="PASSWORD" />
                        <input type="password" placeholder="REPEAT PASSWORD" />
                        <Link to='/login' className='linkado'>
                            <a>Go back to login</a>
                        </Link>
                        <Link to='/main' className='Register-btn'>
                                <a className='linkado'>Register</a>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register;