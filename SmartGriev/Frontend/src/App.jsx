//import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import CitizenDashboard from './pages/Dashboard/CitizenDashboard';
import Login from './pages/identity/Login';
import Register from './pages/identity/Register';
import MainLayout from './layout/MainLayout';

function App() {
  return (
      <BrowserRouter>
          <MainLayout>
              <Routes>
                  <Route path="/" element={<CitizenDashboard />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register/> } />
              </Routes>
          </MainLayout>
      </BrowserRouter>
  )
}

export default App
