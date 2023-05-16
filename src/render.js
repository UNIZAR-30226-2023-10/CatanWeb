import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import App from './App';
import Recover from './Recover';

const Render = () => { 

    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path='/recover' element={<Recover />} />
            </Routes>
        </Router>
      )
}

export default Render; 