import React from 'react';
import ReactDOM from 'react-dom/client'
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
// import App from "./App";
import Home from './Component/Searchform';
// const root=ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//     <App />
// );

export default function App(){
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                </Routes>
                
                </Router>
    );
}