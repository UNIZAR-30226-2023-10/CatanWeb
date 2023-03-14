import logo from './Catan-logo-1.png'
import {Link} from 'react-router-dom'

function Home() {
    return (
        <div className="App">
            <header className="App-header | Main-Header">
                <img src={logo} className="App-logo" alt="logo" />
                <Link to="/login">PLAY!</Link>
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
