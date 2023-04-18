import {useState} from 'react'
import {Link} from 'react-router-dom'
import logo from './Catan-logo-1.png'

function Main() {

    const [content, setContent] = useState("default")
    const handleClick = (newContent) => {
        setContent(newContent);
    };
    return (
        <div className="Main-Header | Common-Header">
            <img src={logo} className="Main-logo" alt="logo" />
            <div className="Main-menu">
                {content === "default" && (
                    <>
                        <Link className="Common-button | Main-button" to="/login">
                            Volver pa' tras
                        </Link>                
                        <Link className="Common-button | Main-button" style={{backgroundColor: 'gray', cursor: 'not-allowed'}} to="/main">
                            Continuar
                        </Link>                
                        <Link className="Common-button | Main-button" onClick={() => handleClick("new-game")} to="/newGame">
                            Nueva partida
                        </Link>                
                        <Link className="Common-button | Main-button" style={{backgroundColor: 'gray', cursor: 'not-allowed'}} to="/main">
                            Unirse a partida
                        </Link>
                    </>
                )}
                {content === "new-game" && (
                    <>
                        <div className="New-game-players">
                            <div className="New-game-player"></div>
                            <div className="New-game-player"></div>
                            <div className="New-game-player"></div>
                            <div className="New-game-player"></div>
                        </div>
                        <div className="New-game-buttons">
                            <Link className="Common-button + New-game-button" onClick={() => handleClick("default")}>
                                Volver pa' tras
                            </Link>
                            <Link className="Common-button + New-game-button" to="/game">
                                Empezar
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Main;