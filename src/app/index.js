import React from 'react'
import { Routes, Route } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../style/App.css'

import { PaginaInicio, Registro } from '../pages/'


function App() {
    return (
        <div classname="app">
            <Routes>
                <Route exact path="/" element={<PaginaInicio />} />
                <Route exact path="/registro" element={<Registro />} />
            </Routes>
        </div>
    )
}

export default App;

