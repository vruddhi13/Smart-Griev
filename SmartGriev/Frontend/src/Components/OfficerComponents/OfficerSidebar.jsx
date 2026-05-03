import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    ClipboardList,
    UserCircle,
    MessageSquare,
    LogOut
} from "lucide-react";
const OfficerSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menu = [
        { name: "Dashboard", path: "/officer" },
        { name: "Complaints", path: "/officer/complaints" },
        { name: "Account", path: "/officer/account" },
    ];

    return (
        <div style={{
            width: "240px",
            background: "white",
            borderRight: "1px solid #e2e8f0",
            height: "100vh",
            position: "fixed"
        }}>
            <div style={{
                padding: "20px",
                fontWeight: "700",
                fontSize: "18px"
            }}>
                SMARTGRIEV
            </div>

            {menu.map(item => {
                const active = location.pathname === item.path;

                return (
                    <div
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        style={{
                            padding: "12px 20px",
                            cursor: "pointer",
                            background: active ? "#eef2ff" : "transparent",
                            color: active ? "#4f46e5" : "#64748b",
                            borderLeft: active ? "3px solid #4f46e5" : "none"
                        }}
                    >
                        {item.name}
                    </div>
                );
            })}
        </div>
    );
};
export default OfficerSidebar;