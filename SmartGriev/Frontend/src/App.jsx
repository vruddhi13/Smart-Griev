//import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import CitizenDashboard from './pages/Dashboard/CitizenDashboard';
import Login from './pages/identity/Login';
import Register from './pages/identity/Register';
import MainLayout from './layout/MainLayout';
import VerifyOtp from './pages/identity/VerifyOtp';
import ForgotPassword from './pages/identity/ForgotPassword';

function App() {
  return (
      <BrowserRouter>
          <MainLayout>
              <Routes>
                  <Route path="/" element={<CitizenDashboard />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={<CitizenDashboard />} />
                  <Route path="/verify-otp" element={<VerifyOtp />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
              </Routes>
          </MainLayout>
      </BrowserRouter>
  )
}

export default App
