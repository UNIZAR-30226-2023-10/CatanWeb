import Home  from './Home' 
import Login from './Login'
import Main  from './Main'
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
                <Route path="/main" element={<Main />}/>
            </Routes>
        </Router>
    );
}

export default App;
