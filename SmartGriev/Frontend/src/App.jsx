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
import ProtectedRoute from './Components/ProtectedRoute';
import AdminDepartments from './pages/Admin/AdminDepartment';
import AdminCategories from './pages/Admin/AdminCategory';
import AdminUserRolePanel from './pages/Admin/AdminUserRolePanel';
import AdminSLAMaster from './pages/Admin/AdminSLAMasterManage';
import AdminComplaints from './pages/Admin/AdminComplaints';
import MyComplaints from './pages/Dashboard/MyComplaints';
import AIChatPage from './pages/Dashboard/AIChatBotPage';
import OfficerDashboard from './pages/Officer/OfficerDashboard';
import OfficerComplaints from './pages/Officer/OfficerComplaints';
import OfficerAccount from './pages/Officer/OfficerAccount';
import StatusPieReport from './pages/Officer/StatusPieReport';
import DeptHeadDashboard from './pages/DeptHead/DeptHeadDashboard';
import DeptHeadAssignComplaint from './pages/DeptHead/DeptHeadAssignComplaint';
import AdminEscalation from './pages/Admin/AdminEscalation';
import AdminEscalationComplaints from './pages/Admin/AdminEscalationComplaints';
import OfficerEscalation from './pages/Officer/OfficerEscalation';
import DeptHeadEscalation from './pages/DeptHead/DeptHeadEscalation';
function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/*Citizen*/}
                <Route path="/" element={<ProtectedRoute allowedRole="4"><MainLayout><CitizenDashboard /></MainLayout></ProtectedRoute>} />
                <Route path="/CitizenComplaint" element={<MainLayout><CitizenComplaint /></MainLayout>} />
                <Route path="/CitizenComplaintStatus" element={<MainLayout><CitizenComplaintStatus /></MainLayout>} />
                <Route path="/dashboard" element={<ProtectedRoute allowedRole="4"><MainLayout><CitizenDashboard /></MainLayout></ProtectedRoute>} />
                <Route path="/MyComplaints" element={<ProtectedRoute allowedRole="4"><MainLayout><MyComplaints /></MainLayout></ProtectedRoute>} />
                <Route path="/AIChatBotPage" element={<ProtectedRoute allowedRole="4"><MainLayout><AIChatPage/></MainLayout></ProtectedRoute>} />

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
                <Route path="/admin/sla" element={<ProtectedRoute allowedRole="1"><AdminSLAMaster /></ProtectedRoute>} />
                <Route path="/admin/complaintdetails" element={<ProtectedRoute allowedRole="1"><AdminComplaints /></ProtectedRoute>} />
                <Route path="/admin/escalations" element={<ProtectedRoute allowedRole="1"><AdminEscalation /></ProtectedRoute>} />
                <Route path="/admin/escalation-complaints" element={<ProtectedRoute allowedRole="1"><AdminEscalationComplaints/></ProtectedRoute>}/>

                {/*Officer*/}
                <Route path="/officer" element={<ProtectedRoute allowedRole="3"><OfficerDashboard /></ProtectedRoute>} />
                <Route path="/officer/complaints" element={<OfficerComplaints />} />
                <Route path="/officer/account" element={<OfficerAccount />} />
                <Route path="/officer/report" element={<StatusPieReport />} />
                <Route path="/officer/escalations" element={<OfficerEscalation />} />


                {/*Department Head*/}
                <Route path="/depthead" element={<ProtectedRoute allowedRole="2"><DeptHeadDashboard /></ProtectedRoute>} />
                <Route path="/depthead/dept-assign" element={<DeptHeadAssignComplaint />} />
                <Route path="/depthead/escalations" element={<DeptHeadEscalation/>} />

                {/*<Route path="/officer/complaints" element={<OfficerComplaints />} />*/}
                {/*<Route path="/officer/account" element={<OfficerAccount />} />*/}
                {/*<Route path="/officer/report" element={<StatusPieReport />} />*/}

                {/*<Route path="/officer/sla" element={<OfficerSLA />} />*/}
                {/*<Route path="*" element={<Navigate to="/"/> }/>*/}
            </Routes>
        </BrowserRouter>
    );
}

export default App
