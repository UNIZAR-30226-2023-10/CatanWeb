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

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/login" element={<Login />}/> 
                <Route path="/main"  element={<Main />}/>
                <Route path="/game"  element={<Game />}/>
                <Route path="/newGame"  element={<NewGame />}/>
            </Routes>
        </Router>
    );
}

export default App;
