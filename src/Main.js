import './Common.css'
import './Main.css'
import {Link} from 'react-router-dom'
import logo from './Catan-logo-1.png'

function Main() {
    return (
        <div className="Main-Header | Common-Header">
            <img src={logo} className="Main-logo" alt="logo" />
            <div className="Main-menu">
                <Link className="Common-button | Main-button" to="/login">
                    Volver pa' tras
                </Link>                
                <Link className="Common-button | Main-button" to="/main">
                    Continuar
                </Link>                
                <Link className="Common-button | Main-button" to="/main">
                    Nueva partida
                </Link>                
                <Link className="Common-button | Main-button" to="/main">
                    Unirse a partida
                </Link>
            </div>
        </div>
    )
}

export default Main;