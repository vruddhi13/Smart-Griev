import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    ClipboardList,
    UserCircle,
    FileText,
    ShieldAlert } from "lucide-react";
import { officerTheme as theme } from "../../services/OfficerServices/OfficerTheme";

const OfficerSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menu = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/officer" },
        { name: "Complaints", icon: ClipboardList, path: "/officer/complaints" },
        { name: "Escalations", icon: ShieldAlert, path: "/officer/escalations" },
        { name: "Report", icon: FileText, path: "/officer/report" },
        { name: "Account", icon: UserCircle, path: "/officer/account" },
    ];

    return (
        <aside style={{
            width: "290px",
            background: "white",
            display: "flex",
            flexDirection: "column",
            position: "sticky",
            top: 0,
            height: "100vh",
            borderRight: "1px solid #F4F7FE"
        }}>
            <div style={{
                padding: "40px 30px",
                fontSize: "24px",
                fontWeight: "800",
                color: theme.colors.text.main
            }}>
                SMART<span style={{ fontWeight: '300', color: theme.colors.text.gray }}>GRIEV</span>
            </div>

            <nav>
                {menu.map(item => {
                    const active = location.pathname === item.path;

                    return (
                        <div
                            key={item.name}
                            onClick={() => navigate(item.path)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                padding: '15px 30px',
                                cursor: 'pointer',
                                color: active ? theme.colors.text.main : theme.colors.text.gray,
                                fontWeight: active ? '700' : '500',
                                borderRight: active
                                    ? `4px solid ${theme.colors.brand.primary}`
                                    : '4px solid transparent'
                            }}
                        >
                            <item.icon size={20} color={active ? theme.colors.brand.primary : '#A3AED0'} />
                            <span>{item.name}</span>
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
};

export default OfficerSidebar;