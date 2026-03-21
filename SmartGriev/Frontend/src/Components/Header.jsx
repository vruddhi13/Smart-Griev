import React from "react";
import { theme } from "../services/theme";
import { useNavigate } from "react-router-dom";

const Header = () => {

    const navigate = useNavigate();
    let user = null;

    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined") {
        try {
            user = JSON.parse(storedUser);
        } catch (error) {
            console.log(error)
            user = null;
        }
    }
    const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : ""; 


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

                <button onClick={() => navigate("/")}
                    style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "1.05rem" }}>
                    Home
                </button>

                {user && (
                    <>
                        <button onClick={() => navigate("/CitizenComplaintStatus")}
                            style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "1.05rem" }}>
                            Dashboard
                        </button>

                        <button onClick={() => navigate("/CitizenComplaint")}
                            style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "1.05rem" }}>
                            Submit Complaint
                        </button>

                        <button onClick={() => navigate("/my-complaints")}
                            style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "1.05rem" }}>
                            My Complaints
                        </button>
                    </>
                )}

                {!user ? (
                    <>
                        <button onClick={() => navigate("/login")}
                            style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>
                            Login
                        </button>

                        <button onClick={() => navigate("/register")}
                            style={{
                                background: "white",
                                color: theme.colors.primary[600],
                                padding: "8px 20px",
                                borderRadius: "8px",
                                border: "none",
                                cursor: "pointer",
                                fontWeight: "600"
                            }}>
                            Sign Up
                        </button>
                    </>
                ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        {/* Avatar */}
                        <div style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "50%",
                            background: "white",
                            color: theme.colors.primary[600],
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "800",
                            fontSize: "16px",
                            flexShrink: 0,
                            lineHeight:1
                        }}>
                            {firstLetter}
                        </div>

                        {/* Name */}
                            <span style={{
                                fontWeight: "600", fontSize: "1rem",color: "white" }}>
                            {user?.name}
                        </span>

                        {/* Logout */}
                        <button
                            onClick={() => {
                                localStorage.removeItem("user");
                                navigate("/")
                            }}
                            style={{
                                border: "2px solid white",
                                background: "transparent",
                                color: "white",
                                padding: "8px 18px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "600"
                            }}>
                            Logout
                        </button>
                    </div>
                )}

            </div>

        </nav>
    );
};

export default Header;