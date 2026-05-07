import React, { useState } from "react";
import { Search, Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { officerTheme as theme } from "../../services/OfficerServices/OfficerTheme";

const OfficerHeader = ({ title = "Officer Panel" }) => {
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);

    const storedUser = sessionStorage.getItem("user");
    const user = storedUser
        ? JSON.parse(storedUser)
        : { name: "Officer" };
    const getInitials = (name) => {
        return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/login");
    };

    const notifications = [
        { id: 1, text: "New complaint assigned", time: "2 mins ago" },
        { id: 2, text: "Complaint marked urgent", time: "1 hour ago" },
    ];

    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '35px'
        }}>
            <div>
                <h2 style={{
                    color: theme.colors.text.main,
                    fontSize: '28px',
                    fontWeight: '700',
                    margin: 0
                }}>
                    {title}
                </h2>
                <p style={{ color: theme.colors.text.gray, margin: 0 }}>
                    Welcome, {user.name}
                </p>
            </div>

            <div style={{
                background: 'white',
                padding: '10px 20px',
                borderRadius: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                boxShadow: theme.shadows.card
            }}>

                {/* Search */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: theme.colors.brand.bg,
                    padding: '8px 15px',
                    borderRadius: '20px'
                }}>
                    <Search size={16} color={theme.colors.text.gray} />
                    <input
                        placeholder="Search..."
                        style={{
                            border: 'none',
                            outline: 'none',
                            background: 'transparent',
                            marginLeft: '8px'
                        }}
                    />
                </div>

                {/* Notifications */}
                <div style={{ position: 'relative' }}>
                    <div
                        onClick={() => setShowNotifications(!showNotifications)}
                        style={{ cursor: 'pointer', position: 'relative' }}
                    >
                        <Bell size={20} color={theme.colors.text.gray} />
                        <span style={{
                            position: 'absolute',
                            top: '-2px',
                            right: '-2px',
                            width: '10px',
                            height: '10px',
                            background: '#10B981',
                            borderRadius: '50%',
                            border: '2px solid white'
                        }} />
                    </div>

                    {showNotifications && (
                        <div style={{
                            position: 'absolute',
                            top: '45px',
                            right: '-40px',
                            width: '320px',
                            background: 'white',
                            borderRadius: '10px',
                            boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                            border: '1px solid #e2e8f0'
                        }}>
                            <div style={{
                                padding: '12px',
                                borderBottom: '1px solid #eee',
                                fontWeight: 'bold'
                            }}>
                                Notifications
                            </div>

                            {notifications.map(n => (
                                <div key={n.id} style={{
                                    padding: '12px',
                                    borderBottom: '1px solid #f1f5f9'
                                }}>
                                    <div style={{ fontSize: '13px' }}>{n.text}</div>
                                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{n.time}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Profile + Logout */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderLeft: '1px solid #eee',
                    paddingLeft: '15px'
                }}>
                    <div style={{
                        width: '35px',
                        height: '35px',
                        borderRadius: '50%',
                        background: theme.colors.brand.primary,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                    }}>
                        {getInitials(user.name)}
                    </div>

                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: theme.colors.status.error,
                            cursor: 'pointer'
                        }}
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default OfficerHeader;