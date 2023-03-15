import Home  from './Home' 
import Login from './Login'
import Main  from './Main'
import Game  from './Game'
import NewGame  from './NewGame'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Register from './Register'
import JoinGame from './JoinGame'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/login" element={<Login />}/> 
                <Route path="/main"  element={<Main />}/>
                <Route path="/game"  element={<Game />}/>
                <Route path="/newGame"  element={<NewGame />}/>
                <Route path="/register" element={<Register />}/> 
                <Route path="/joinGame"  element={<JoinGame />}/>
            </Routes>
        </Router>
    );
}

export default App;

