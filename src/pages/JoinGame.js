import React from 'react';
import {Link} from 'react-router-dom'
import logo from '../Catan-logo-1.png'
import '../styles/JoinGame.css'
import '../styles/Common.css'

function JoinGame() {
    return (
        <div className='JoinGame-header | Common-Header'>
            <div className='JoinGame-container'>
                <img src={logo} className="JoinGame-logo" alt="logo" />
                <form className='JoinGame-form'>
                    <div className="JoinGame-cover">
                        <h1>INSERT GAME CODE:</h1>
                        <input type="text" placeholder="" />
                        <Link to='/game' className='JoinGame-btn'>
                                <a className='linkado'>JoinGame</a>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default JoinGame;