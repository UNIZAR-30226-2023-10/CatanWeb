import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { NavBar } from '../components'


import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="/ejemplo/insertar" exact component="{EjemploInsertar}" />
                <Route path="/ejemplo/modificar/:id" exact component="{EjemploModificar}" />
                <Route path="/ejemplo/obtener" exact component="{EjemploObtener}" />
            </Routes>
        </Router>
    )
}

export default App;
