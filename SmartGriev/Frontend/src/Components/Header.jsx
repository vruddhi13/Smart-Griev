import React, { useState, useEffect} from "react";
import { theme } from "../services/theme";
import { useNavigate } from "react-router-dom";
import { useTranslationContext } from "../Context/TranslationContext";
import {
    User,
    Mail,
    Phone,
    Shield,
    Lock,
    LogOut,
    X, Eye, EyeOff
} from "lucide-react";

import { getUserById, CitizenPasswordChange } from "../services/accountservice";
import { showError, showSuccessToast } from "../services/alertService";

const Header = () => {
    const { language, setLanguage, t } = useTranslationContext();

    const navigate = useNavigate();

    const [showProfileModal, setShowProfileModal] = useState(false);

    const [userData, setUserData] = useState(null);

    const [profileData, setProfileData] = useState({
        mobile: "",
        currentPassword: "",
        password: "",
        confirmPassword: ""
    });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    let user = null;

    const storedUser = sessionStorage.getItem("user");

    if (storedUser && storedUser !== "undefined") {
        try {
            user = JSON.parse(storedUser);
        } catch (error) {
            console.log(error);
            user = null;
        }
    }

    useEffect(() => {

        const fetchUser = async () => {

            try {

                const storedUser = JSON.parse(
                    sessionStorage.getItem("user")
                );

                if (!storedUser?.userId) return;

                const result = await getUserById(
                    storedUser.userId
                );

                setUserData(result);

                setProfileData((prev) => ({
                    ...prev,
                    mobile: result.mobileNo || ""
                }));

            } catch (error) {
                console.log(error);
            }
        };

        fetchUser();

    }, []);

    const firstLetter = user?.name
        ? user.name.charAt(0).toUpperCase()
        : "";

    const roleId = sessionStorage.getItem("roleId");

    // ✅ AFTER hooks
    if (roleId !== "4") {
        return null;
    }

    const handleUpdateAccount = async () => {

        try {

            if (!profileData.currentPassword.trim()) {
                alert("Please enter current password");
                return;
            }

            if (!profileData.password.trim()) {
                alert("Please enter new password");
                return;
            }

            // Password length
            if (profileData.password.length < 6) {
                alert("Password must be at least 6 characters");
                return;
            }

            // Confirm password check
            if (
                profileData.password !==
                profileData.confirmPassword
            ) {
                alert("Passwords do not match");
                return;
            }

            const updateData = {
                email: userData.email,
                currentPassword: profileData.currentPassword,
                newPassword: profileData.password
            };

            const result = await CitizenPasswordChange(updateData);

            showSuccessToast(
                result.message ||
                "Password changed successfully"
            );

            // Clear fields after success
            setProfileData((prev) => ({
                ...prev,
                currentPassword: "",
                password: "",
                confirmPassword: ""
            }));

            // Close modal
            setShowProfileModal(false);

        } catch (error) {

            console.log(error);

            showError(
                error.message ||
                "Failed to change password"
            );
        }
    };

    const headerStyle = {
        backgroundColor: theme.colors.primary[600],
        color: theme.colors.white.pure,
        padding: "1.2rem 5%",
        boxShadow: theme.shadows.md,
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxSizing: "border-box",
        position: "sticky",
        top: 0,
        zIndex: 1000
    };

    return (
        <nav style={headerStyle}>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>

                <div style={{
                    backgroundColor: theme.colors.white.pure,
                    color: theme.colors.primary[600],
                    padding: "8px 14px",
                    borderRadius: "10px",
                    fontWeight: "900",
                    fontSize: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                }}>
                    SG
                </div>

                <div style={{ display: "flex", flexDirection: "column", lineHeight: "1.2" }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: "1.8rem",
                        fontWeight: "700",
                        letterSpacing: "-0.5px"
                    }}>
                        SmartGriev
                    </h2>

                    <small style={{
                        opacity: 0.9,
                        fontSize: "11px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "1px"
                    }}>
                        Citizen Complaint System
                    </small>
                </div>

            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>

                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "none",
                        outline: "none",
                        cursor: "pointer",
                        fontWeight: "600",
                        background: "white",
                        color: theme.colors.primary[600]
                    }}
                >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="gu">Gujarati</option>
                    <option value="mr">Marathi</option>
                </select>
                
                <button onClick={() => navigate("/")}
                    style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "1.05rem" }}>
                    {t("home")}
                </button>

                {user && (
                    <>
                        <button onClick={() => navigate("/CitizenComplaintStatus")}
                            style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "1.05rem" }}>
                            {t("dashboard")}
                        </button>

                        <button onClick={() => navigate("/CitizenComplaint")}
                            style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "1.05rem" }}>
                            {t("submit_complaints")}
                        </button>

                        <button onClick={() => navigate("/MyComplaints")}
                            style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "1.05rem" }}>
                            {t("recent_my_complaints")}
                        </button>
                    </>
                )}

                {!user ? (
                    <>
                        <button onClick={() => navigate("/login")}
                            style={{
                                background: "none",
                                border: "none",
                                color: "white",
                                cursor: "pointer",
                                fontSize: "1rem",          // Matches standard nav text size
                                fontWeight: "600",         // Matches Sign Up weight
                                padding: "8px 16px",       // Gives it a matching hit-box layout
                                transition: "opacity 0.2s",
                                opacity: 0.9
                            }}
                            onMouseEnter={(e) => e.target.style.opacity = "1"}
                            onMouseLeave={(e) => e.target.style.opacity = "0.9"}
                            >
                            {t("login")}
                        </button>

                        <button onClick={() => navigate("/register")}
                            style={{
                                background: "white",
                                color: theme.colors.primary[600],
                                padding: "8px 20px",
                                borderRadius: "8px",
                                border: "none",
                                cursor: "pointer",
                                fontWeight: "600",
                                fontSize: "1rem",
                            }}>
                            {t("sign_up")}
                        </button>
                    </>
                ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>

                            {/* Profile Button */}
                            <button
                                onClick={() => setShowProfileModal(true)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    background: "rgba(255,255,255,0.12)",
                                    border: "1px solid rgba(255,255,255,0.18)",
                                    padding: "8px 14px",
                                    borderRadius: "14px",
                                    cursor: "pointer",
                                    backdropFilter: "blur(10px)"
                                }}
                            >

                                {/* Avatar */}
                                <div
                                    style={{
                                        width: "38px",
                                        height: "38px",
                                        borderRadius: "50%",
                                        background: "white",
                                        color: theme.colors.primary[600],
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: "800",
                                        fontSize: "16px"
                                    }}
                                >
                                    {firstLetter}
                                </div>

                                {/* Name */}
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start"
                                    }}
                                >
                                    <span
                                        style={{
                                            color: "white",
                                            fontWeight: "700",
                                            fontSize: "0.95rem"
                                        }}
                                    >
                                        {user?.name}
                                    </span>

                                    <span
                                        style={{
                                            color: "rgba(255,255,255,0.75)",
                                            fontSize: "0.72rem"
                                        }}
                                    >
                                        Citizen
                                    </span>
                                </div>
                            </button>

                            {/* Logout */}
                            <button
                                onClick={() => {
                                    sessionStorage.removeItem("user");
                                    sessionStorage.removeItem("token");
                                    
                                    navigate("/");
                                    
                                }}
                                style={{
                                    border: "1px solid rgba(255,255,255,0.25)",
                                    background: "rgba(255,255,255,0.1)",
                                    color: "white",
                                    padding: "10px 16px",
                                    borderRadius: "12px",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                    backdropFilter: "blur(10px)"
                                }}
                            >
                                {t("logout")}
                            </button>
                        </div>
                )}

            </div>

            {/* Profile Modal */}
            {showProfileModal && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(15,23,42,0.45)",
                        backdropFilter: "blur(6px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 2000
                    }}
                >

                    <div
                        style={{
                            width: "95%",
                            maxWidth: "720px",
                            background: "white",
                            borderRadius: "28px",
                            overflow: "hidden",
                            boxShadow: "0 25px 60px rgba(0,0,0,0.25)"
                        }}
                    >

                        {/* Header */}
                        <div
                            style={{
                                background:
                                    "linear-gradient(135deg,#2563eb,#1d4ed8)",
                                padding: "24px 30px",
                                color: "white",
                                position: "relative"
                            }}
                        >

                            <button
                                onClick={() => setShowProfileModal(false)}
                                style={{
                                    position: "absolute",
                                    top: "18px",
                                    right: "18px",
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    border: "none",
                                    background: "rgba(255,255,255,0.18)",
                                    color: "white",
                                    cursor: "pointer"
                                }}
                            >
                                <X size={18} />
                            </button>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "18px"
                                }}
                            >

                                <div
                                    style={{
                                        width: "74px",
                                        height: "74px",
                                        borderRadius: "50%",
                                        background: "white",
                                        color: "#2563eb",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "2rem",
                                        fontWeight: "800"
                                    }}
                                >
                                    {firstLetter}
                                </div>

                                <div>
                                    <h2
                                        style={{
                                            margin: 0,
                                            fontSize: "1.6rem"
                                        }}
                                    >
                                        {userData?.fullName}
                                    </h2>

                                    <p
                                        style={{
                                            marginTop: "6px",
                                            opacity: 0.9
                                        }}
                                    >
                                        SmartGriev Citizen
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div
                            style={{
                                padding: "24px 30px",
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "20px"
                            }}
                        >

                            {/* LEFT SIDE */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "16px"
                                }}
                            >

                                {/* Email */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "14px",
                                        background: "#f8fafc",
                                        padding: "16px",
                                        borderRadius: "18px"
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "46px",
                                            height: "46px",
                                            borderRadius: "14px",
                                            background: "#eff6ff",
                                            color: "#2563eb",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <Mail size={20} />
                                    </div>

                                    <div>
                                        <div
                                            style={{
                                                fontSize: "0.75rem",
                                                color: "#64748b",
                                                fontWeight: "700"
                                            }}
                                        >
                                            EMAIL ADDRESS
                                        </div>

                                        <div
                                            style={{
                                                marginTop: "4px",
                                                fontWeight: "600",
                                                color: "#0f172a",
                                                fontSize: "0.92rem"
                                            }}
                                        >
                                            {userData?.email}
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "14px",
                                        background: "#f8fafc",
                                        padding: "16px",
                                        borderRadius: "18px"
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "46px",
                                            height: "46px",
                                            borderRadius: "14px",
                                            background: "#ecfdf5",
                                            color: "#059669",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <Phone size={20} />
                                    </div>

                                    <div>
                                        <div
                                            style={{
                                                fontSize: "0.75rem",
                                                color: "#64748b",
                                                fontWeight: "700"
                                            }}
                                        >
                                            MOBILE NUMBER
                                        </div>

                                        <div
                                            style={{
                                                marginTop: "4px",
                                                fontWeight: "600",
                                                color: "#0f172a"
                                            }}
                                        >
                                            {userData?.mobileNo}
                                        </div>
                                    </div>
                                </div>

                                {/* Role */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "14px",
                                        background: "#f8fafc",
                                        padding: "16px",
                                        borderRadius: "18px"
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "46px",
                                            height: "46px",
                                            borderRadius: "14px",
                                            background: "#fef3c7",
                                            color: "#d97706",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <Shield size={20} />
                                    </div>

                                    <div>
                                        <div
                                            style={{
                                                fontSize: "0.75rem",
                                                color: "#64748b",
                                                fontWeight: "700"
                                            }}
                                        >
                                            ACCOUNT TYPE
                                        </div>

                                        <div
                                            style={{
                                                marginTop: "4px",
                                                fontWeight: "600",
                                                color: "#0f172a"
                                            }}
                                        >
                                            Citizen User
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT SIDE */}
                            <div
                                style={{
                                    background: "#f8fafc",
                                    borderRadius: "22px",
                                    padding: "22px",
                                    border: "1px solid #e2e8f0",
                                    height: "fit-content"
                                }}
                            >

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        marginBottom: "18px"
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "12px",
                                            background: "#eff6ff",
                                            color: "#2563eb",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <Lock size={18} />
                                    </div>

                                    <div>
                                        <div
                                            style={{
                                                fontWeight: "700",
                                                color: "#0f172a"
                                            }}
                                        >
                                            Change Password
                                        </div>

                                        <div
                                            style={{
                                                fontSize: "0.8rem",
                                                color: "#64748b"
                                            }}
                                        >
                                            Secure your account
                                        </div>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        display: "grid",
                                        gap: "14px"
                                    }}
                                >
                                    {/* Current Password */}
                                    <div style={{ position: "relative" }}>
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            placeholder="Current Password"
                                            value={profileData.currentPassword}
                                            onChange={(e) =>
                                                setProfileData({
                                                    ...profileData,
                                                    currentPassword: e.target.value
                                                })
                                            }
                                            style={{
                                                width: "100%",
                                                padding: "14px",
                                                paddingRight: "50px",
                                                borderRadius: "14px",
                                                border: "1px solid #dbeafe",
                                                background: "white",
                                                outline: "none",
                                                boxSizing: "border-box"
                                            }}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowCurrentPassword(!showCurrentPassword)
                                            }
                                            style={{
                                                position: "absolute",
                                                right: "14px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                border: "none",
                                                background: "transparent",
                                                cursor: "pointer",
                                                color: "#64748b"
                                            }}
                                        >
                                            {showCurrentPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                    </div>

                                    {/* New Password */}
                                    <div style={{ position: "relative" }}>
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder="New Password"
                                            value={profileData.password}
                                            onChange={(e) =>
                                                setProfileData({
                                                    ...profileData,
                                                    password: e.target.value
                                                })
                                            }
                                            style={{
                                                width: "100%",
                                                padding: "14px",
                                                paddingRight: "50px",
                                                borderRadius: "14px",
                                                border: "1px solid #dbeafe",
                                                background: "white",
                                                outline: "none",
                                                boxSizing: "border-box"
                                            }}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowNewPassword(!showNewPassword)
                                            }
                                            style={{
                                                position: "absolute",
                                                right: "14px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                border: "none",
                                                background: "transparent",
                                                cursor: "pointer",
                                                color: "#64748b"
                                            }}
                                        >
                                            {showNewPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                    </div>

                                    {/* Confirm Password */}
                                    <div style={{ position: "relative" }}>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm Password"
                                            value={profileData.confirmPassword}
                                            onChange={(e) =>
                                                setProfileData({
                                                    ...profileData,
                                                    confirmPassword: e.target.value
                                                })
                                            }
                                            style={{
                                                width: "100%",
                                                padding: "14px",
                                                paddingRight: "50px",
                                                borderRadius: "14px",
                                                border: "1px solid #dbeafe",
                                                background: "white",
                                                outline: "none",
                                                boxSizing: "border-box"
                                            }}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(!showConfirmPassword)
                                            }
                                            style={{
                                                position: "absolute",
                                                right: "14px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                border: "none",
                                                background: "transparent",
                                                cursor: "pointer",
                                                color: "#64748b"
                                            }}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "12px",
                                        marginTop: "22px"
                                    }}
                                >
                                    <button
                                        onClick={() => setShowProfileModal(false)}
                                        style={{
                                            flex: 1,
                                            padding: "13px",
                                            borderRadius: "14px",
                                            border: "1px solid #e2e8f0",
                                            background: "white",
                                            cursor: "pointer",
                                            fontWeight: "600"
                                        }}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={handleUpdateAccount}
                                        style={{
                                            flex: 1,
                                            padding: "13px",
                                            borderRadius: "14px",
                                            border: "none",
                                            background:
                                                "linear-gradient(135deg,#2563eb,#1d4ed8)",
                                            color: "white",
                                            cursor: "pointer",
                                            fontWeight: "700",
                                            boxShadow:
                                                "0 10px 20px rgba(37,99,235,0.22)"
                                        }}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </nav>
    );
};

export default Header;