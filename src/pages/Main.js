import '../styles/Common.css'
import '../styles/Main.css'
import {useState} from 'react'
import {Link} from 'react-router-dom'
import logo from './src/Catan-logo-1.png'

function Main() {
    return (
        <div className="Main-Header | Common-Header">
            <div className='Main-container'>
                <img src={logo} className="Main-logo" alt="logo" />
                <div className="Main-cover">
                    <Link to='/login' className='Main-btn'>
                        <a className='linkado'>Volver pa' tras</a>
                    </Link>
                    <Link to='/newGame' className='Main-btn'>
                        <a className='linkado'>New game</a>
                    </Link>
                    <Link to='/' className='Main-btn'>
                        <a className='linkado'>Continue Game</a>
                    </Link>
                    <Link to='/joinGame' className='Main-btn'>
                        <a className='linkado'>Join Game</a>
                    </Link>

                </div>
            </div> 
        </div>
    )
}

export default Main;
