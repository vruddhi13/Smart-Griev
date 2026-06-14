import React from 'react';
import { Navigate } from 'react-router-dom';
import DeptHeadSidebar from '../Components/DeptHeadComponents/DeptHeadSidebar';

import { deptHeadTheme as theme } from '../services/DeptHeadServices/DeptHeadTheme';
import DeptHeadHeader from '../Components/DeptHeadComponents/DeptHeadHeader';

const DeptHeadLayout = ({ children, pageTitle }) => {
    const roleId = sessionStorage.getItem("roleId");

    // Check for DeptHead Role (assuming Role ID 2)
    if (roleId !== "2") {
        return <Navigate to="/login" replace />;
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: theme.colors.brand.bg }}>
            <DeptHeadSidebar />
            <main style={{ flex: 1, padding: '30px 40px' }}>
                <DeptHeadHeader title={pageTitle} />
                {children}
            </main>
        </div>
    );
};

export default DeptHeadLayout;