import React, { useState, useEffect } from 'react';
import {
    Search,
    Bell,
    LogOut,
    MessageSquare,
    CheckCircle,
    Calendar,
    Tag,
    Star,
    Smile,
    Frown,
    Inbox,
    X,
    User,
    Trash2
} from 'lucide-react'; import { adminTheme as theme } from '../../services/AdminServices/AdminTheme';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminHeader = ({ title = "Admin Panel" }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const storedUser = sessionStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : { name: "Admin" };
    const userId = user?.userId;
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [adminProfile, setAdminProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    // Track selected notification in history detailed view
    const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
    const isDashboard = location.pathname === '/' || location.pathname === '/admin';

    const getInitials = (name="") => {
        return name.split(" ").map(n => n[0] || "").join("").toUpperCase().substring(0, 2);
    };

    const handleLogout = () => {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("roleId");
        navigate("/login");
    };

    const token = sessionStorage.getItem("token");

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch(`https://localhost:7224/api/Notification/${userId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    const formattedData = data.map(n => ({
                        ...n,
                        complaintCategory: n.complaintCategory || "General",
                        rating: n.rating ?? null,
                        isSatisfied: n.isSatisfied ?? null,
                        comments: n.comments || n.Comments || n.message,
                        isRead: n.isRead ?? false
                    }));
                    setNotifications(formattedData);
                    
                    // Set default selected item for history if not already set
                    const readNotifications = formattedData.filter(n => n.isRead);
                    if (readNotifications.length > 0 && !selectedHistoryItem) {
                        setSelectedHistoryItem(readNotifications[0]);
                    }
                }
            } catch (error) {
                console.error("Notification fetch error:", error);
            }
        };
        if (userId) {
            fetchNotifications();
            const interval = setInterval(() => {
                fetchNotifications();
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [userId, selectedHistoryItem]);


    const deleteNotification = async (id) => {
        try {
            const response = await fetch(
                `https://localhost:7224/api/Notification/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    }
                }
            );

            if (response.ok) {
                setNotifications(prev =>
                    prev.filter(n => n.notificationId !== id)
                );

                // Clear selected history item if deleted
                if (selectedHistoryItem?.notificationId === id) {
                    setSelectedHistoryItem(null);
                }
            }
        } catch (error) {
            console.error("Delete notification error:", error);
        }
    };
    const fetchAdminProfile = async () => {
        try {
            setLoadingProfile(true);

            const response = await fetch(`https://localhost:7224/api/admin/users/${userId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setAdminProfile(data);
            }
        } catch (error) {
            console.error("Profile fetch error:", error);
        } finally {
            setLoadingProfile(false);
        }
    };

    const handlePasswordUpdate = async () => {

        // Empty validation
        if (!newPassword || !confirmPassword) {
            alert("Please fill both password fields");
            return;
        }

        // Minimum length validation
        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        // Match validation
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {

            const response = await fetch(
                `https://localhost:7224/api/admin/users/update-account`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    },
                    body: JSON.stringify({
                        password: newPassword
                    })
                }
            );

            if (response.ok) {

                alert("Password updated successfully");

                // Clear fields
                setNewPassword("");
                setConfirmPassword("");

                // Close section
                setShowChangePassword(false);

            } else {

                const errorData = await response.json();

                alert(errorData.message || "Failed to update password");
            }

        } catch (error) {

            console.log("FULL ERROR:", error);

            console.log("ERROR RESPONSE:", error?.response);

            alert("Something went wrong while updating password");
        }
    };

    const markAsRead = async (id) => {
        try {
            await fetch(`https://localhost:7224/api/Notification/mark-read/${id}`,
            {
                    method: "PUT",
                    headers:
                    {
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    }
            
            });
            setNotifications(prev => prev.map(n => n.notificationId === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error(error);
        }
    };

    const readNotifications = notifications.filter(n => n.isRead);

    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px', position: 'relative' }}>
           <div>
                <h2 style={{ color: theme.colors.text.main, fontSize: '28px', fontWeight: '700', margin: 0 }}>{title}</h2>
                {/* 4. Conditional Rendering based on layout route path */}
                {isDashboard && (
                    <p style={{ color: theme.colors.text.gray, margin: 0, fontSize: '14px' }}>
                        Welcome, {user.name}
                    </p>
                )}
            </div>

            <div style={{ background: 'white', padding: '10px 20px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: theme.shadows.card }}>

                {/* Search Bar */}
                {/*<div style={{ display: 'flex', alignItems: 'center', background: theme.colors.brand.bg, padding: '8px 15px', borderRadius: '20px' }}>*/}
                {/*    <Search size={16} color={theme.colors.text.gray} />*/}
                {/*    <input type="text" placeholder="Search complaints..." style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '8px' }} />*/}
                {/*</div>*/}

                {/* Notification Trigger */}
                <div style={{ position: 'relative' }}>
                    <div
                        onClick={() => setShowNotifications(!showNotifications)}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                        <Bell size={20} color={theme.colors.text.gray} />
                        {notifications.some(n => !n.isRead) && (
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
                        )}
                    </div>

                    {showNotifications && (
                        <div style={{
                            position: 'absolute',
                            top: '45px',
                            right: '-40px',
                            width: '420px',
                            background: 'white',
                            borderRadius: '10px',
                            boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                            zIndex: 1000,
                            border: '1px solid #e2e8f0',
                            overflow: 'hidden'
                        }}>
                            {/* Header */}
                            <div style={{ padding: '15px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold', color: '#1e293b' }}>
                                Recent Activity
                            </div>

                            {/* Notification List */}
                            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                {notifications.length === 0 ? (
                                    <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
                                        No notifications found
                                    </div>
                                ) : (
                                    notifications.map((n) => (
                                        <div
                                            key={n.notificationId}
                                            onClick={() => markAsRead(n.notificationId)}
                                            style={{
                                                display: 'flex',
                                                gap: '12px',
                                                padding: '14px 15px',
                                                borderBottom: '1px solid #f1f5f9',
                                                cursor: 'pointer',
                                                background: !n.isRead ? '#f0fff4' : '#fff',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = !n.isRead ? '#f0fff4' : '#fff'}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={n.isRead}
                                                    disabled={n.isRead}
                                                    onChange={() => markAsRead(n.notificationId)}
                                                    style={{ width: '16px', height: '16px', cursor: n.isRead ? 'default' : 'pointer', accentColor: theme.colors.brand.primary }}
                                                />
                                            </div>

                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <span
                                                        style={{
                                                            fontSize: '11px',
                                                            background: '#eff6ff',
                                                            color: '#2563eb',
                                                            fontWeight: '700',
                                                            padding: '2px 8px',
                                                            borderRadius: '4px'
                                                        }}
                                                    >
                                                        {n.complaintCategory}
                                                    </span>

                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px'
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                fontSize: '11px',
                                                                color: '#94a3b8'
                                                            }}
                                                        >
                                                            {n.sentAt
                                                                ? new Date(n.sentAt).toLocaleString()
                                                                : "No Date"}
                                                        </span>

                                                        <Trash2
                                                            size={15}
                                                            color="#ef4444"
                                                            style={{
                                                                cursor: 'pointer'
                                                            }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteNotification(n.notificationId);
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                <div style={{ fontSize: '13px', marginTop: '6px', color: '#334155', fontWeight: '500' }}>
                                                    {n.comments || "Notification details update."}
                                                </div>

                                                {(n.rating !== null || n.isSatisfied !== null) && (
                                                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px', alignItems: 'center' }}>
                                                        {n.rating !== null && (
                                                            <span style={{ fontSize: '11px', background: '#fef3c7', color: '#d97706', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>
                                                                ⭐ {n.rating} / 5
                                                            </span>
                                                        )}
                                                        {n.isSatisfied !== null && (
                                                            <span style={{ fontSize: '11px', color: n.isSatisfied ? '#10b981' : '#ef4444', fontWeight: '600' }}>
                                                                ● {n.isSatisfied ? "Satisfied" : "Unsatisfied"}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div
                                onClick={() => {
                                    setShowNotifications(false);
                                    setShowHistoryModal(true);
                                    if (readNotifications.length > 0) setSelectedHistoryItem(readNotifications[0]);
                                }}
                                style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: theme.colors.brand.primary, cursor: 'pointer', borderTop: '1px solid #e2e8f0', background: '#fff' }}
                            >
                                Notification History
                            </div>
                        </div>
                    )}
                </div>

                {/* ========================================================= */}
                {/* MODERNIZED NOTIFICATION HISTORY MODAL                     */}
                {/* ========================================================= */}
                {showHistoryModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
                    }}>
                        <div style={{
                            background: "white", width: "92%", maxWidth: "900px", height: "80vh",
                            borderRadius: "16px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                            display: 'flex', flexDirection: 'column'
                        }}>
                            
                            {/* Modal Header */}
                            <div style={{
                                background: "linear-gradient(135deg, #1e293b, #0f172a)", color: "white",
                                padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center"
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Inbox size={22} style={{ color: '#38bdf8' }} />
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Notification Archive</h3>
                                        <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Review and audit past updates and alerts</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowHistoryModal(false)}
                                    style={{
                                        background: "rgba(255,255,255,0.1)", border: "none", color: "white",
                                        width: "32px", height: "32px", borderRadius: "8px", cursor: "pointer",
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Modal Body Container */}
                            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: '#f8fafc' }}>
                                
                                {/* Left Side: History List Pane */}
                                <div style={{ width: '40%', borderRight: '1px solid #e2e8f0', background: '#fff', overflowY: 'auto' }}>
                                    {readNotifications.length === 0 ? (
                                        <div style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8" }}>
                                            <Bell size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                                            <div style={{ fontWeight: '500' }}>No historical logs found</div>
                                        </div>
                                    ) : (
                                        readNotifications.map(n => {
                                            const isSelected = selectedHistoryItem?.notificationId === n.notificationId;
                                            return (
                                                <div 
                                                    key={n.notificationId}
                                                    onClick={() => setSelectedHistoryItem(n)}
                                                    style={{
                                                        padding: "16px", borderBottom: "1px solid #f1f5f9", cursor: "pointer",
                                                        background: isSelected ? "#eff6ff" : "transparent",
                                                        borderLeft: isSelected ? `4px solid #2563eb` : '4px solid transparent',
                                                        transition: 'all 0.15s ease'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                        <span style={{ fontSize: "11px", fontWeight: "700", color: "#475569", background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                                                            {n.complaintCategory}
                                                        </span>
                                                        <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                                                            {n.sentAt ? new Date(n.sentAt).toLocaleDateString() : ""}
                                                        </span>
                                                    </div>
                                                    <div style={{ fontWeight: "600", fontSize: '13px', color: isSelected ? '#1e40af' : '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {n.title || "Complaint Status Update"}
                                                    </div>
                                                    <div style={{ fontSize: "12px", color: "#64748b", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                                                        {n.comments || n.message}
                                                    </div>

                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Right Side: Detailed Focus Card View */}
                                <div style={{ width: '60%', padding: '24px', overflowY: 'auto' }}>
                                    {selectedHistoryItem ? (
                                        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                            
                                            {/* Details Category badge & Checkmark icon layout */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#eff6ff', padding: '6px 12px', borderRadius: '20px' }}>
                                                    <Tag size={14} color="#2563eb" />
                                                    <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: '600' }}>
                                                        {selectedHistoryItem.complaintCategory} Category
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '12px', fontWeight: '600', background: '#ecfdf5', padding: '4px 10px', borderRadius: '12px' }}>
                                                    <CheckCircle size={14} /> Logged & Read
                                                </div>
                                            </div>

                                            <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#0f172a', fontWeight: '600' }}>
                                                {selectedHistoryItem.title || "Complaint Event Logs"}
                                            </h4>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '12px', marginBottom: '20px' }}>
                                                <Calendar size={14} />
                                                <span>Dispatched on: {selectedHistoryItem.sentAt ? new Date(selectedHistoryItem.sentAt).toLocaleString() : 'N/A'}</span>
                                            </div>

                                            <hr style={{ border: 0, borderTop: '1px solid #f1f5f9', margin: '16px 0' }} />

                                            {/* Detailed Message Core */}
                                            <div style={{ marginBottom: '24px' }}>
                                                <div style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', tracking: '0.05em', marginBottom: '8px' }}>
                                                    Message Details
                                                </div>
                                                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', color: '#334155', fontSize: '14px', lineHeight: '1.6', borderLeft: `3px solid #cbd5e1` }}>
                                                    {selectedHistoryItem.comments || selectedHistoryItem.message || "No contextual details were provided with this alert log notification."}
                                                </div>
                                            </div>

                                            {/* Conditional Quality Audit Analytics Frame */}
                                            {(selectedHistoryItem.rating !== null || selectedHistoryItem.isSatisfied !== null) && (
                                                <div>
                                                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', tracking: '0.05em', marginBottom: '10px' }}>
                                                        Resolution Assessment
                                                    </div>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                        {selectedHistoryItem.rating !== null && (
                                                            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '12px', borderRadius: '8px' }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b45309', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                                                                    <Star size={14} fill="#d97706" color="#d97706" /> Rating Score
                                                                </div>
                                                                <div style={{ fontSize: '16px', fontWeight: '700', color: '#78350f' }}>{selectedHistoryItem.rating} / 5 Stars</div>
                                                            </div>
                                                        )}
                                                        {selectedHistoryItem.isSatisfied !== null && (
                                                            <div style={{ 
                                                                background: selectedHistoryItem.isSatisfied ? '#ecfdf5' : '#fef2f2', 
                                                                border: selectedHistoryItem.isSatisfied ? '1px solid #a7f3d0' : '1px solid #fecaca', 
                                                                padding: '12px', borderRadius: '8px' 
                                                            }}>
                                                                <div style={{ 
                                                                    display: 'flex', alignItems: 'center', gap: '6px', 
                                                                    color: selectedHistoryItem.isSatisfied ? '#047857' : '#b91c1c', 
                                                                    fontSize: '12px', fontWeight: '600', marginBottom: '4px' 
                                                                }}>
                                                                    {selectedHistoryItem.isSatisfied ? <Smile size={14} /> : <Frown size={14} />} 
                                                                    User Sentiment
                                                                </div>
                                                                <div style={{ fontSize: '16px', fontWeight: '700', color: selectedHistoryItem.isSatisfied ? '#065f46' : '#991b1b' }}>
                                                                    {selectedHistoryItem.isSatisfied ? "Satisfied" : "Unsatisfied"}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                                            <MessageSquare size={36} style={{ marginBottom: '8px', opacity: 0.4 }} />
                                            <span>Select a notification history item from the left pane to view details</span>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                )}

                {showProfileModal && (
                    <div onClick={() => setShowProfileModal(false)}  style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
                    }}>
                        <div onClick={(e) => e.stopPropagation()} style={{
                            background: "white", width: "90%", maxWidth: "450px",
                            borderRadius: "16px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                            display: 'flex', flexDirection: 'column'
                        }}>
                            {/* Profile Modal Header */}
                            <div style={{
                                background: "linear-gradient(135deg, #1e293b, #0f172a)", color: "white",
                                padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center"
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <User size={20} style={{ color: '#38bdf8' }} />
                                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Admin Profile</h3>
                                </div>
                                <button
                                    onClick={() => setShowProfileModal(false)}
                                    style={{
                                        background: "rgba(255,255,255,0.1)", border: "none", color: "white",
                                        width: "32px", height: "32px", borderRadius: "8px", cursor: "pointer",
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Profile Modal Body */}
                            <div style={{ padding: '24px', background: '#f8fafc', textAlign: 'center' }}>
                                <div style={{
                                    width: '70px', height: '70px', borderRadius: '50%',
                                    background: theme.colors.brand.primary, color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 'bold', fontSize: '24px', margin: '0 auto 16px auto',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                }}>
                                    {getInitials(adminProfile?.fullName || user.name)}
                                </div>

                                <h4 style={{ margin: '0 0 4px 0', fontSize: '20px', color: '#0f172a', fontWeight: '700' }}>
                                    {adminProfile?.fullName || user.name}
                                </h4>
                                {/*<p style={{*/}
                                {/*    marginTop: '6px',*/}
                                {/*    color: '#64748b',*/}
                                {/*    fontSize: '13px'*/}
                                {/*}}>*/}
                                {/*    Manage your administrator account and secure access settings.*/}
                                {/*</p>*/}
                                <span style={{ fontSize: '12px', background: '#e0f2fe', color: '#0369a1', fontWeight: '700', padding: '3px 12px', borderRadius: '12px' }}>
                                    System Administrator
                                </span>

                                <hr style={{ border: 0, borderTop: '1px solid #e2e8f0', margin: '20px 0' }} />

                                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {loadingProfile ? (
                                        <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                                            Loading profile...
                                        </div>
                                    ) : (
                                        <>
                                            {/* Email */}
                                            <div style={{
                                                background: 'white',
                                                padding: '14px 16px',
                                                borderRadius: '10px',
                                                border: '1px solid #e2e8f0'
                                            }}>
                                                <div style={{
                                                    fontSize: '11px',
                                                    fontWeight: '600',
                                                    color: '#94a3b8',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    Email Address
                                                </div>

                                                <div style={{
                                                    fontSize: '14px',
                                                    color: '#334155',
                                                    fontWeight: '500',
                                                    marginTop: '4px'
                                                }}>
                                                    {adminProfile?.email || "admin@gmail.com"}
                                                </div>
                                            </div>

                                            {/* Mobile */}
                                            <div style={{
                                                background: 'white',
                                                padding: '14px 16px',
                                                borderRadius: '10px',
                                                border: '1px solid #e2e8f0'
                                            }}>
                                                <div style={{
                                                    fontSize: '11px',
                                                    fontWeight: '600',
                                                    color: '#94a3b8',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    Mobile Number
                                                </div>

                                                <div style={{
                                                    fontSize: '14px',
                                                    color: '#334155',
                                                    fontWeight: '500',
                                                    marginTop: '4px'
                                                }}>
                                                    {adminProfile?.mobileno || "+91 9876543210"}
                                                </div>
                                            </div>

                                            {/* Security */}
                                            <div style={{
                                                background: 'white',
                                                padding: '14px 16px',
                                                borderRadius: '10px',
                                                border: '1px solid #e2e8f0'
                                            }}>
                                                <div style={{
                                                    fontSize: '11px',
                                                    fontWeight: '600',
                                                    color: '#94a3b8',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    Password & Security
                                                </div>

                                                    <button
                                                        onClick={() => setShowChangePassword(!showChangePassword)}
                                                        style={{
                                                            marginTop: '10px',
                                                            width: '100%',
                                                            padding: '10px',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            background: '#2563eb',
                                                            color: 'white',
                                                            fontWeight: '600',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        {showChangePassword ? "Close Password Section" : "Change Password"}
                                                    </button>

                                                    {/* Change Password Fields */}
                                                    {showChangePassword && (
                                                        <div
                                                            style={{
                                                                marginTop: '15px',
                                                                display: 'grid',
                                                                gridTemplateColumns: '1fr 1fr',
                                                                gap: '12px'
                                                            }}
                                                        >
                                                            {/* New Password */}
                                                            <div>
                                                                <label
                                                                    style={{
                                                                        fontSize: '12px',
                                                                        fontWeight: '600',
                                                                        color: '#64748b',
                                                                        marginBottom: '6px',
                                                                        display: 'block'
                                                                    }}
                                                                >
                                                                    New Password
                                                                </label>

                                                                <input
                                                                    type="password"
                                                                    placeholder="Enter new password"
                                                                    value={newPassword}
                                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                                    style={{
                                                                        width: '100%',
                                                                        padding: '10px',
                                                                        borderRadius: '8px',
                                                                        border: '1px solid #cbd5e1',
                                                                        outline: 'none',
                                                                        fontSize: '13px'
                                                                    }}
                                                                />
                                                                {newPassword && newPassword.length < 6 && (
                                                                    <div style={{
                                                                        color: '#ef4444',
                                                                        fontSize: '12px',
                                                                        marginTop: '5px'
                                                                    }}>
                                                                        Password must be at least 6 characters
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Confirm Password */}
                                                            <div>
                                                                <label
                                                                    style={{
                                                                        fontSize: '12px',
                                                                        fontWeight: '600',
                                                                        color: '#64748b',
                                                                        marginBottom: '6px',
                                                                        display: 'block'
                                                                    }}
                                                                >
                                                                    Confirm Password
                                                                </label>

                                                                <input
                                                                    type="password"
                                                                    placeholder="Confirm password"
                                                                    value={confirmPassword}
                                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                                    style={{
                                                                        width: '100%',
                                                                        padding: '10px',
                                                                        borderRadius: '8px',
                                                                        border: '1px solid #cbd5e1',
                                                                        outline: 'none',
                                                                        fontSize: '13px'
                                                                    }}
                                                                />

                                                                {confirmPassword &&
                                                                    newPassword !== confirmPassword && (
                                                                        <div style={{
                                                                            color: '#ef4444',
                                                                            fontSize: '12px',
                                                                            marginTop: '5px'
                                                                        }}>
                                                                            Passwords do not match
                                                                        </div>
                                                                    )}
                                                            </div>

                                                            {/* Update Button */}
                                                            <div style={{ gridColumn: '1 / span 2' }}>
                                                                <button onClick={handlePasswordUpdate}
                                                                    style={{
                                                                        width: '100%',
                                                                        padding: '11px',
                                                                        background: '#10b981',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        borderRadius: '8px',
                                                                        fontWeight: '600',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                >
                                                                    Update Password
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                            </div>

                                            
                                        </>
                                    )}

                                    
                                </div>

                                <button
                                    onClick={handleLogout}
                                    style={{
                                        width: '100%', marginTop: '20px', padding: '11px',
                                        background: theme.colors.status.error, color: 'white',
                                        border: 'none', borderRadius: '8px', fontWeight: '600',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                    }}
                                >
                                    <LogOut size={16} /> Sign Out of Panel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Profile Section */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        borderLeft: '1px solid #eee',
                        paddingLeft: '15px'
                    }}
                >
                    {/* Profile Avatar */}
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowProfileModal(true);
                            fetchAdminProfile();
                        }}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '14px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(37,99,235,0.25)',
                            transition: '0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        {getInitials(user?.name || "Admin")}
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{ background: 'none', border: 'none', color: theme?.colors?.status?.error || '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;