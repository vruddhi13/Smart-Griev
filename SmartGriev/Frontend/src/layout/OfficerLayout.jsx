import React from "react";
import { Navigate } from "react-router-dom";
import OfficerSidebar from "../Components/OfficerComponents/OfficerSidebar";
import OfficerHeader from "../Components/OfficerComponents/OfficerHeader";
import { officerTheme as theme } from "../services/OfficerServices/OfficerTheme";

const OfficerLayout = ({ children, pageTitle }) => {
    const roleId = sessionStorage.getItem("roleId");

    // Allow only officer (adjust if needed)
    if (roleId !== "3") {
        return <Navigate to="/" replace />;
    }

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            background: theme.colors.brand.bg
        }}>
            <OfficerSidebar />

            <main style={{ flex: 1, padding: '30px 40px' }}>
                <OfficerHeader title={pageTitle} />
                {children}
            </main>
        </div>
    );
};

export default OfficerLayout;