import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Login from './pages/auth/Login';
import EmpresaList from './pages/empresa/EmpresaList';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <App />
    <EmpresaList />
    </BrowserRouter>
  </React.StrictMode>
);
