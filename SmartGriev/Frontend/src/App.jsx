//import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import CitizenDashboard from './pages/Dashboard/CitizenDashboard';
import Login from './pages/identity/Login';
import Register from './pages/identity/Register';
import MainLayout from './layout/MainLayout';
import CitizenComplaint from './pages/Dashboard/CitizenComplaint';
import CitizenComplaintStatus from './pages/Dashboard/CitizenComplaintStatus';

function App() {
  return (
      <BrowserRouter>
          <MainLayout>
              <Routes>
                  <Route path="/" element={<CitizenDashboard />} />
                  <Route path="/CitizenComplaint" element={<CitizenComplaint />} />
                  <Route path="/CitizenComplaintStatus" element={<CitizenComplaintStatus /> }></Route>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register/> } />
              </Routes>
          </MainLayout>
      </BrowserRouter>
  )
}

export default App
