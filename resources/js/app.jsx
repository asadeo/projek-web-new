import './bootstrap'; 
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SchoolForm from './components/SchoolForm';
import LandingPage from './components/LandingPage';
import NewsForm from './components/NewsForm';
import NewsDetail from './components/NewsDetail';
import SchoolDirectory from './components/SchoolDirectory';

function App() {
    const token = localStorage.getItem('ACCESS_TOKEN');

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage/>} />
                
                <Route path="/login" element={<Login />} />
                <Route path="/sekolah" element={<SchoolDirectory />}/>
                <Route 
                    path="/schools/create" 
                    element={token ? <SchoolForm /> : <Navigate to="/login" />}
                />
                <Route 
                    path="/schools/edit/:id" 
                    element={token ? <SchoolForm /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/admin" 
                    element={token ? <Dashboard /> : <Navigate to="/login" />} 
                />
                <Route path="/news/:id" element={<NewsDetail />} />
                <Route path="/news/create" element={<NewsForm />} />
                <Route path="/news/edit/:id" element={<NewsForm />} />
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);