//import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import CitizenDashboard from './pages/Dashboard/CitizenDashboard';
import Login from './pages/identity/Login';
import Register from './pages/identity/Register';
import MainLayout from './layout/MainLayout';
import VerifyOtp from './pages/identity/VerifyOtp';
import ForgotPassword from './pages/identity/ForgotPassword';
import CitizenComplaint from './pages/Dashboard/CitizenComplaint';
import CitizenComplaintStatus from './pages/Dashboard/CitizenComplaintStatus';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminLayout from './layout/AdminLayout';
import ProtectedRoute from './Components/ProtectedRoute';
import AdminDepartments from './pages/Admin/AdminDepartment';
import AdminCategories from './pages/Admin/AdminCategory';
import AdminUserRolePanel from './pages/Admin/AdminUserRolePanel';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/*Citizen*/}
                <Route path="/" element={<ProtectedRoute allowedRole="4"><MainLayout><CitizenDashboard /></MainLayout></ProtectedRoute>} />
                <Route path="/CitizenComplaint" element={<MainLayout><CitizenComplaint /></MainLayout>} />
                <Route path="/CitizenComplaintStatus" element={<MainLayout><CitizenComplaintStatus /></MainLayout>} />
                <Route path="/dashboard" element={<ProtectedRoute allowedRole="4"><MainLayout><CitizenDashboard /></MainLayout></ProtectedRoute>} />

                {/*identity*/}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/*Admin*/}
                <Route path="/admin" element={<ProtectedRoute allowedRole="1"><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/dashboard" element={<ProtectedRoute allowedRole="1"><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/departments" element={<ProtectedRoute allowedRole="1"><AdminDepartments /></ProtectedRoute>} />
                <Route path="/admin/category" element={<ProtectedRoute allowedRole="1"><AdminCategories /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute allowedRole="1"><AdminUserRolePanel /></ProtectedRoute>} />

                {/*<Route path="*" element={<Navigate to="/"/> }/>*/}
            </Routes>
        </BrowserRouter>
    );
}

export default App
