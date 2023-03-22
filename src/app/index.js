import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';

import {
    Home,
    Login,
    Main,
    Game,
    NewGame,
    Register,
    JoinGame,

} from "../pages"

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

