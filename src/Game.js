import {Link} from 'react-router-dom'
import './Game.css'
import './Common.css'

function Game() {
    return (
        <div className='Game-header'>
            <Link className='Common-button' to='/main'>Volver pa' tras</Link>
        </div>
    )
}

export default Game