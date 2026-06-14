import React, { useState } from 'react';
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
    );
};

export default DeptHeadHeader;