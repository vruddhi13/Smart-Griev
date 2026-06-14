import React, { useState,useEffect } from "react";
import {
    Search,
    Bell,
    LogOut,
    Inbox,
    X,
    MessageSquare,
    Calendar,
    CheckCircle,
    Trash2,
    AlertTriangle,
    Clock
} from "lucide-react";
import { officerTheme as theme } from "../../services/OfficerServices/OfficerTheme";
import {
    getNotifications,
    markNotificationRead,
    deleteNotification
} from "../../services/DeptHeadServices/DeptHeadService";
import { useNavigate } from "react-router-dom";

const DeptHeadHeader = ({ title = "DeprtmentHead Panel" }) => {
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

    const storedUser = sessionStorage.getItem("user");
    const user = storedUser
        ? JSON.parse(storedUser)
        : { name: "Department Head" };
    const userId = user?.userId;

    const readNotifications =
        notifications.filter(n => n.isRead);

    const getInitials = (name) => {
        return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
    };

    const handleDeleteNotification = async (id) => {
        try {

            await deleteNotification(id);

            setNotifications(prev =>
                prev.filter(
                    n => n.notificationId !== id
                )
            );

        } catch (err) {
            console.error(err);
        }
    };

    const markAsRead = async (notificationId) => {
        try {

            await markNotificationRead(notificationId);

            setNotifications(prev =>
                prev.map(n =>
                    n.notificationId === notificationId
                        ? { ...n, isRead: true }
                        : n
                )
            );

        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/login");
    };

    useEffect(() => {

        if (!userId) return;

        const fetchNotifications = async () => {
            try {
                const data =
                    await getNotifications(userId);

                setNotifications(data || []);
            }
            catch (err) {
                console.error(err);
            }
        };

        fetchNotifications();

        const interval =
            setInterval(fetchNotifications, 5000);

        return () =>
            clearInterval(interval);

    }, [userId]);

    const unreadCount =
        notifications.filter(
            n => !n.isRead
        ).length;

    return (
        <>
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
                {/*<div style={{*/}
                {/*    display: 'flex',*/}
                {/*    alignItems: 'center',*/}
                {/*    background: theme.colors.brand.bg,*/}
                {/*    padding: '8px 15px',*/}
                {/*    borderRadius: '20px'*/}
                {/*}}>*/}
                {/*    <Search size={16} color={theme.colors.text.gray} />*/}
                {/*    <input*/}
                {/*        placeholder="Search..."*/}
                {/*        style={{*/}
                {/*            border: 'none',*/}
                {/*            outline: 'none',*/}
                {/*            background: 'transparent',*/}
                {/*            marginLeft: '8px'*/}
                {/*        }}*/}
                {/*    />*/}
                {/*</div>*/}

                {/* Notifications */}
                <div style={{ position: 'relative' }}>
                    <div
                        onClick={() => setShowNotifications(!showNotifications)}
                        style={{ cursor: 'pointer', position: 'relative' }}
                    >
                        <Bell size={20} color={theme.colors.text.gray} />

                        {unreadCount > 0 && (
                            <span
                                style={{
                                    position: "absolute",
                                    top: "-8px",
                                    right: "-10px",
                                    minWidth: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    background: "#ef4444",
                                    color: "#fff",
                                    fontSize: "11px",
                                    fontWeight: "600",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                {unreadCount}
                            </span>
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
                            <div style={{
                                padding: '15px',
                                background: '#f8fafc',
                                borderBottom: '1px solid #e2e8f0',
                                fontWeight: 'bold',
                                color: '#1e293b'
                            }}>
                                Recent Activity
                            </div>

                            {/* Notifications */}
                            <div style={{
                                maxHeight: '350px',
                                overflowY: 'auto'
                            }}>
                                {notifications.length === 0 ? (
                                    <div style={{
                                        padding: '20px',
                                        textAlign: 'center',
                                        color: '#94a3b8'
                                    }}>
                                        No notifications found
                                    </div>
                                ) : (
                                            notifications.map((n) => (
                                                <div
                                                    key={n.notificationId}
                                                    onClick={() => markAsRead(n.notificationId)}
                                                    style={{
                                                        padding: "14px 15px",
                                                        borderBottom: "1px solid #f1f5f9",
                                                        cursor: "pointer",
                                                        background: !n.isRead
                                                            ? "#f0fff4"
                                                            : "#fff"
                                                    }}
                                                >

                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            marginBottom: "6px"
                                                        }}
                                                    >

                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "8px"
                                                            }}
                                                        >

                                                            {n.notificationType === "SLA" ? (
                                                                <Clock
                                                                    size={15}
                                                                    color="#f59e0b"
                                                                />
                                                            ) : n.notificationType === "Escalation" ? (
                                                                <AlertTriangle
                                                                    size={15}
                                                                    color="#ef4444"
                                                                />
                                                            ) : (
                                                                <Bell
                                                                    size={15}
                                                                    color="#2563eb"
                                                                />
                                                            )}

                                                            <strong>
                                                                {n.title}
                                                            </strong>

                                                        </div>

                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "8px"
                                                            }}
                                                        >

                                                            <input
                                                                type="checkbox"
                                                                checked={n.isRead}
                                                                disabled={n.isRead}
                                                            />

                                                            <Trash2
                                                                size={15}
                                                                color="#ef4444"
                                                                style={{
                                                                    cursor: "pointer"
                                                                }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteNotification(
                                                                        n.notificationId
                                                                    );
                                                                }}
                                                            />

                                                        </div>

                                                    </div>

                                                    <div style={{ fontSize: "13px" }}>
                                                        {n.message}
                                                    </div>

                                                    {n.notificationType === "SLA" && (
                                                        <div
                                                            style={{
                                                                marginTop: "5px",
                                                                display: "inline-block",
                                                                background: "#f59e0b",
                                                                color: "#fff",
                                                                padding: "2px 8px",
                                                                borderRadius: "10px",
                                                                fontSize: "10px"
                                                            }}
                                                        >
                                                            SLA REMINDER
                                                        </div>
                                                    )}

                                                    {n.notificationType === "Escalation" && (
                                                        <div
                                                            style={{
                                                                marginTop: "5px",
                                                                display: "inline-block",
                                                                background: "#dc2626",
                                                                color: "#fff",
                                                                padding: "2px 8px",
                                                                borderRadius: "10px",
                                                                fontSize: "10px"
                                                            }}
                                                        >
                                                            ESCALATION
                                                        </div>
                                                    )}

                                                    <div
                                                        style={{
                                                            fontSize: "11px",
                                                            color: "#94a3b8",
                                                            marginTop: "5px"
                                                        }}
                                                    >
                                                        {new Date(n.sentAt).toLocaleString()}
                                                    </div>

                                                </div>
                                            ))
                                )}
                            </div>

                            <div
                                onClick={() => {
                                    setShowNotifications(false);
                                    setShowHistoryModal(true);

                                    if (readNotifications.length > 0) {
                                        setSelectedHistoryItem(readNotifications[0]);
                                    }
                                }}
                                style={{
                                    padding: '12px',
                                    textAlign: 'center',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: theme.colors.brand.primary,
                                    cursor: 'pointer',
                                    borderTop: '1px solid #e2e8f0'
                                }}
                            >
                                Notification History
                            </div>
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
﻿import React, { useState } from 'react';
import { LogOut, X, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { deptHeadTheme as theme } from '../../services/DeptHeadServices/DeptHeadTheme';
import { useNavigate } from 'react-router-dom';

const DeptHeadHeader = ({ title = "Department Head Panel" }) => {
    const navigate = useNavigate();
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [deptHeadProfile, setDeptHeadProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // NEW: Local alert state specifically for inside the modal
    const [localAlert, setLocalAlert] = useState({ show: false, message: "", type: "" });

    const storedUser = sessionStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : { name: "Dept Head" };
    const userId = user?.userId;
    const token = sessionStorage.getItem("token");

    const getInitials = (name = "") => {
        return name.split(" ").map(n => n[0] || "").join("").toUpperCase().substring(0, 2);
    };

    const triggerLocalAlert = (message, type = "error") => {
        setLocalAlert({ show: true, message, type });
        // Automatically clear after 4 seconds
        setTimeout(() => {
            setLocalAlert({ show: false, message: "", type: "" });
        }, 4000);
    };

    const handleLogout = () => {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("roleId");
        sessionStorage.removeItem("token");
        navigate("/login");
    };

    const fetchDeptHeadProfile = async () => {
        if (!userId) return;
        try {
            setLoadingProfile(true);
            const response = await fetch(`https://localhost:7224/api/admin/users/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setDeptHeadProfile(data);
            }
        } catch (error) {
            console.error("Profile fetch error:", error);
        } finally {
            setLoadingProfile(false);
        }
    };

    const handlePasswordUpdate = async () => {
        if (!newPassword || !confirmPassword) {
            triggerLocalAlert("Please fill both password fields", "error");
            return;
        }

        if (newPassword.length < 6) {
            triggerLocalAlert("Password must be at least 6 characters", "error");
            return;
        }

        if (newPassword !== confirmPassword) {
            triggerLocalAlert("Passwords do not match", "error");
            return;
        }

        try {
            const response = await fetch(
                `https://localhost:7224/api/DeptHead/change-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        password: newPassword
                    })
                }
            );

            if (response.ok) {
                triggerLocalAlert("Password updated successfully!", "success");
                setNewPassword("");
                setConfirmPassword("");
                // Optional: Close password section after a minor delay
                setTimeout(() => setShowChangePassword(false), 1500);
            } else {
                const text = await response.text();
                triggerLocalAlert(text || "Failed to update password", "error");
            }
        } catch (error) {
            console.error("Password update error:", error);
            triggerLocalAlert("Something went wrong while updating password", "error");
        }
    };

    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>{title}</h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginLeft: 'auto' }}>
                {showProfileModal && (
                    <div onClick={() => { setShowProfileModal(false); setLocalAlert({ show: false, message: "", type: "" }); }} style={{
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
                                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Department Head Profile</h3>
                                </div>
                                <button
                                    onClick={() => { setShowProfileModal(false); setLocalAlert({ show: false, message: "", type: "" }); }}
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

                                {/* NEW: Centered In-Modal Alert Box */}
                                {localAlert.show && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        marginBottom: '16px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        animation: 'fadeIn 0.3s ease',
                                        background: localAlert.type === 'success' ? '#ecfdf5' : '#fef2f2',
                                        color: localAlert.type === 'success' ? '#065f46' : '#991b1b',
                                        border: `1px solid ${localAlert.type === 'success' ? '#a7f3d0' : '#fca5a5'}`
                                    }}>
                                        {localAlert.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                        <span>{localAlert.message}</span>
                                    </div>
                                )}

                                <div style={{
                                    width: '70px', height: '70px', borderRadius: '50%',
                                    background: theme?.colors?.brand?.primary || '#2563eb', color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 'bold', fontSize: '24px', margin: '0 auto 16px auto',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                }}>
                                    {getInitials(deptHeadProfile?.fullName || user.name)}
                                </div>

                                <h4 style={{ margin: '0 0 4px 0', fontSize: '20px', color: '#0f172a', fontWeight: '700' }}>
                                    {deptHeadProfile?.fullName || user.name}
                                </h4>

                                <span style={{ fontSize: '12px', background: '#e0f2fe', color: '#0369a1', fontWeight: '700', padding: '3px 12px', borderRadius: '12px' }}>
                                    Department Head
                                </span>

                                <hr style={{ border: 0, borderTop: '1px solid #e2e8f0', margin: '20px 0' }} />

                                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {loadingProfile ? (
                                        <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                                            Loading profile...
                                        </div>
                                    ) : (
                                        <>
                                            {/* Email Address */}
                                            <div style={{ background: 'white', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                                <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>Email Address</div>
                                                <div style={{ fontSize: '14px', color: '#334155', fontWeight: '500', marginTop: '4px' }}>
                                                    {deptHeadProfile?.email || "depthead@gmail.com"}
                                                </div>
                                            </div>

                                            {/* Mobile Number */}
                                            <div style={{ background: 'white', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                                <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>Mobile Number</div>
                                                <div style={{ fontSize: '14px', color: '#334155', fontWeight: '500', marginTop: '4px' }}>
                                                    {deptHeadProfile?.mobileNo || deptHeadProfile?.mobileno || "No Number Found"}
                                                </div>
                                            </div>

                                            {/* Security Access */}
                                            <div style={{ background: 'white', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                                <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>Password & Security</div>

                                                <button
                                                    onClick={() => setShowChangePassword(!showChangePassword)}
                                                    style={{
                                                        marginTop: '10px', width: '100%', padding: '10px',
                                                        border: 'none', borderRadius: '8px', background: '#2563eb',
                                                        color: 'white', fontWeight: '600', cursor: 'pointer'
                                                    }}
                                                >
                                                    {showChangePassword ? "Close Password Section" : "Change Password"}
                                                </button>

                                                {/* Change Password Input Fields */}
                                                {showChangePassword && (
                                                    <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                        <div>
                                                            <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px', display: 'block' }}>New Password</label>
                                                            <input
                                                                type="password"
                                                                placeholder="New password"
                                                                value={newPassword}
                                                                onChange={(e) => setNewPassword(e.target.value)}
                                                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }}
                                                            />
                                                            {newPassword && newPassword.length < 6 && (
                                                                <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>Must be ≥ 6 chars</div>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px', display: 'block' }}>Confirm Password</label>
                                                            <input
                                                                type="password"
                                                                placeholder="Confirm password"
                                                                value={confirmPassword}
                                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }}
                                                            />
                                                            {confirmPassword && newPassword !== confirmPassword && (
                                                                <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>Mismatched fields</div>
                                                            )}
                                                        </div>

                                                        <div style={{ gridColumn: '1 / span 2' }}>
                                                            <button onClick={handlePasswordUpdate}
                                                                style={{
                                                                    width: '100%', padding: '11px', background: '#10b981',
                                                                    color: 'white', border: 'none', borderRadius: '8px',
                                                                    fontWeight: '600', cursor: 'pointer'
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
                                        background: theme?.colors?.status?.error || '#ef4444', color: 'white',
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

                {/* Profile Avatar Trigger Area */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '1px solid #eee', paddingLeft: '15px' }}>
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowProfileModal(true);
                            fetchDeptHeadProfile();
                        }}
                        style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: '700', fontSize: '14px', cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(37,99,235,0.25)', transition: '0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {getInitials(user?.name || "Dept Head")}
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
            {showHistoryModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(15,23,42,0.6)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2000
                }}>
                    <div style={{
                        background: "white",
                        width: "92%",
                        maxWidth: "900px",
                        height: "80vh",
                        borderRadius: "16px",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column"
                    }}>
                        {/* Header */}
                        <div style={{
                            background: "linear-gradient(135deg,#1e293b,#0f172a)",
                            color: "white",
                            padding: "18px 24px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px"
                            }}>
                                <Inbox size={22} />
                                <div>
                                    <h3 style={{
                                        margin: 0
                                    }}>
                                        Notification Archive
                                    </h3>

                                    <p style={{
                                        margin: 0,
                                        fontSize: '12px',
                                        color: '#94a3b8'
                                    }}>
                                        Department Head Activity Logs
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowHistoryModal(false)}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    color: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            overflow: 'hidden'
                        }}>

                            {/* Left Panel */}
                            <div style={{
                                width: '40%',
                                borderRight: '1px solid #e2e8f0',
                                overflowY: 'auto'
                            }}>
                                {readNotifications.map((n) => {

                                    return (
                                        <div
                                            key={n.notificationId}
                                            onClick={() =>
                                                setSelectedHistoryItem(n)
                                            }
                                            style={{
                                                padding: "16px",
                                                borderBottom:
                                                    "1px solid #f1f5f9",
                                                cursor: "pointer",
                                                background:
                                                    selectedHistoryItem?.notificationId ===
                                                        n.notificationId
                                                        ? "#eff6ff"
                                                        : "transparent",
                                                borderLeft:
                                                    selectedHistoryItem?.notificationId ===
                                                        n.notificationId
                                                        ? "4px solid #2563eb"
                                                        : "4px solid transparent"
                                            }}
                                        >

                                            <div
                                                style={{
                                                    fontWeight: "600",
                                                    fontSize: "13px"
                                                }}
                                            >
                                                {n.title}
                                            </div>

                                            <div
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#64748b",
                                                    marginTop: "4px"
                                                }}
                                            >
                                                {n.message}
                                            </div>

                                            <div
                                                style={{
                                                    fontSize: "11px",
                                                    color: "#94a3b8",
                                                    marginTop: "6px"
                                                }}
                                            >
                                                {new Date(n.sentAt).toLocaleDateString()}
                                            </div>

                                        </div>
                                    );
                                })}
                            </div>

                            {/* Right Pane */}
                            <div style={{
                                width: '60%',
                                padding: '24px',
                                overflowY: 'auto'
                            }}>
                                {selectedHistoryItem ? (
                                    <>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}>
                                            <div style={{
                                                background: '#eff6ff',
                                                color: '#2563eb',
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: '600'
                                            }}>
                                                Notification
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                color: '#10b981',
                                                fontSize: '12px'
                                            }}>
                                                <CheckCircle size={14} />
                                                Read
                                            </div>
                                        </div>

                                        <h3 style={{
                                            marginTop: '20px'
                                        }}>
                                            {selectedHistoryItem.title}
                                        </h3>

                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            color: '#64748b',
                                            fontSize: '12px'
                                        }}>
                                            <Calendar size={14} />
                                            {new Date(
                                                selectedHistoryItem.sentAt
                                            ).toLocaleString()}
                                        </div>

                                        <div style={{
                                            marginTop: '20px',
                                            background: '#f8fafc',
                                            padding: '16px',
                                            borderRadius: '8px'
                                        }}>
                                            {selectedHistoryItem.message}
                                        </div>
                                    </>
                                ) : (
                                    <div style={{
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#94a3b8'
                                    }}>
                                        <MessageSquare size={30} />
                                        Select a notification
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </>
        </header>
    );
};

export default DeptHeadHeader;