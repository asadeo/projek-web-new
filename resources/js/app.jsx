import './bootstrap'; 
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SchoolForm from './components/SchoolForm';

function App() {
    const token = localStorage.getItem('ACCESS_TOKEN');

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                
                <Route path="/login" element={<Login />} />
                <Route 
                    path="/schools/create" 
                    element={token ? <SchoolForm /> : <Navigate to="/login" />}
                />
                <Route 
                    path="/schools/edit/:id" 
                    element={token ? <SchoolForm /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/dashboard" 
                    element={token ? <Dashboard /> : <Navigate to="/login" />} 
                />
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);