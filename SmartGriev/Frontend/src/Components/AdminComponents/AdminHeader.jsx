import React, { useState } from 'react';
import { Search, Bell, LogOut, MessageSquare, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminTheme as theme } from '../../services/AdminServices/AdminTheme';

const AdminHeader = ({ title = "Admin Panel" }) => {
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);

    const storedUser = sessionStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : { name: "Admin" };

    const getInitials = (name) => {
        return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
    };

    const handleLogout = () => {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("roleId");
        navigate("/login");
    };

    // Expanded Dummy Data to trigger scrolling
    const notifications = [
        { id: 1, type: 'Complaint', text: 'New road damage reported in Civil Lines', time: '2 mins ago', status: 'new', icon: MessageSquare, color: '#10B981' },
        { id: 2, type: 'Urgent', text: 'SLA Breach: Electricity pole repair pending > 48h', time: '1 hour ago', status: 'read', icon: AlertTriangle, color: '#EF4444' },
        { id: 3, type: 'Complaint', text: 'Waste management request from Sector 4', time: '3 hours ago', status: 'read', icon: MessageSquare, color: '#10B981' },
        { id: 4, type: 'Update', text: 'Department "Water" added successfully', time: '5 hours ago', status: 'read', icon: MessageSquare, color: '#3B82F6' },
        { id: 5, type: 'Complaint', text: 'Street light not working in Modest Colony', time: 'Yesterday', status: 'read', icon: MessageSquare, color: '#10B981' },
    ];

    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px', position: 'relative' }}>
            <div>
                <h2 style={{ color: theme.colors.text.main, fontSize: '28px', fontWeight: '700', margin: 0 }}>{title}</h2>
                <p style={{ color: theme.colors.text.gray, margin: 0, fontSize: '14px' }}>Welcome, {user.name}</p>
            </div>

            <div style={{ background: 'white', padding: '10px 20px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: theme.shadows.card }}>

                {/* Search Bar */}
                <div style={{ display: 'flex', alignItems: 'center', background: theme.colors.brand.bg, padding: '8px 15px', borderRadius: '20px' }}>
                    <Search size={16} color={theme.colors.text.gray} />
                    <input type="text" placeholder="Search complaints..." style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '8px' }} />
                </div>

                {/* Notification Trigger */}
                <div style={{ position: 'relative' }}>
                    <div
                        onClick={() => setShowNotifications(!showNotifications)}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                        <Bell size={20} color={theme.colors.text.gray} />
                        <span style={{
                            position: 'absolute', top: '-2px', right: '-2px',
                            width: '10px', height: '10px', background: '#10B981',
                            borderRadius: '50%', border: '2px solid white'
                        }} />
                    </div>

                    {/* RECTANGLE SCROLLABLE BOX */}
                    {showNotifications && (
                        <div style={{
                            position: 'absolute',
                            top: '45px',
                            right: '-40px',
                            width: '420px', // wider rectangle
                            background: 'white',
                            borderRadius: '10px',
                            boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                            zIndex: 1000,
                            border: '1px solid #e2e8f0',
                            overflow: 'hidden'
                        }}>
                            {/* Header */}
                            <div style={{
                                padding: '15px',
                                background: '#f8fafc',
                                borderBottom: '1px solid #e2e8f0',
                                fontWeight: 'bold',
                                color: '#1e293b'
                            }}>
                                Recent Activity
                            </div>

                            {/* VERTICAL SCROLL AREA */}
                            <div style={{
                                maxHeight: '320px', // scroll limit
                                overflowY: 'auto'
                            }}>
                                {notifications.map((n) => (
                                    <div key={n.id}
                                        style={{
                                            display: 'flex',
                                            gap: '12px',
                                            padding: '14px 15px',
                                            borderBottom: '1px solid #f1f5f9',
                                            cursor: 'pointer',
                                            background: n.status === 'new' ? '#f0fff4' : '#fff',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = n.status === 'new' ? '#f0fff4' : '#fff'}
                                    >
                                        {/* Icon */}
                                        <div style={{
                                            padding: '8px',
                                            background: `${n.color}15`,
                                            borderRadius: '6px',
                                            height: 'fit-content'
                                        }}>
                                            <n.icon size={18} color={n.color} />
                                        </div>

                                        {/* Content */}
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                fontSize: '13px',
                                                fontWeight: '700',
                                                color: '#334155'
                                            }}>
                                                {n.type}
                                            </div>

                                            <div style={{
                                                fontSize: '12px',
                                                color: '#64748b',
                                                lineHeight: '1.4',
                                                marginTop: '2px'
                                            }}>
                                                {n.text}
                                            </div>

                                            <div style={{
                                                fontSize: '11px',
                                                color: '#94a3b8',
                                                marginTop: '6px'
                                            }}>
                                                {n.time}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div
                                onClick={() => navigate('/complaints')}
                                style={{
                                    padding: '12px',
                                    textAlign: 'center',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: theme.colors.brand.primary,
                                    cursor: 'pointer',
                                    borderTop: '1px solid #e2e8f0',
                                    background: '#fff'
                                }}
                            >
                                View All Complaints
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '1px solid #eee', paddingLeft: '15px' }}>
                    <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: theme.colors.brand.primary, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px' }}>
                        {getInitials(user.name)}
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{ background: 'none', border: 'none', color: theme.colors.status.error, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;