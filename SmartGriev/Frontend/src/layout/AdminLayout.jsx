import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminSidebar from '../Components/AdminComponents/AdminSidebar';
import AdminHeader from '../Components/AdminComponents/AdminHeader';
import { adminTheme as theme } from '../services/AdminServices/AdminTheme';

const AdminLayout = ({ children, pageTitle }) => {
    const roleId = sessionStorage.getItem("roleId");
    if (roleId !== "1") {
        return <Navigate to="/" replace />;
    }
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: theme.colors.brand.bg }}>
            <AdminSidebar />
            <main style={{ flex: 1, padding: '30px 40px' }}>
                <AdminHeader title={pageTitle} />
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;