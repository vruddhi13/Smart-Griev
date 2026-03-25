import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
    const roleId = sessionStorage.getItem("roleId");

    if (!roleId) {
        return <Navigate to="/login" />;
    }

    if (allowedRole && Number(roleId) !== Number(allowedRole)) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
