import Home  from './Home' 
import Login from './Login'
import Main  from './Main'
import Game  from './Game'
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
            </Routes>
        </Router>
    );
}

export default App;
