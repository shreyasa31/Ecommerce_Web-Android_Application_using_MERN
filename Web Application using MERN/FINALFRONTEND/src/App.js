
import './App.css';
import React from 'react';
import ReactDOM from 'react-dom/client'
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
// import App from "./App";
//i want to import home from searchform.js
import Home from "./Component/Searchform"



export default function App() {
  return(
    <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            </Routes>
            
            </Router>
);
}
