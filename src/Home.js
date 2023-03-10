import './Home.css'
import './Common.css'
import logo from './Catan-logo-1.png'
import {Link} from 'react-router-dom'

function Home() {
    return (
        <div className="Home">
            <header className="Home-header | Common-Header">
                <img src={logo} className="Home-logo" alt="logo" />
                <Link className="Common-button" to="/login">
                    PLAY!
                </Link>
                <div class="loading">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </header>
        </div>
    )
}

export default Home;
