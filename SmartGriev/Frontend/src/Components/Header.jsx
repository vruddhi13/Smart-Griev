import React from "react";
import { theme } from "../services/theme";
import { useNavigate } from "react-router-dom";

const Header = () => {

    const navigate = useNavigate();

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

            <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>

                <button onClick={() => navigate("/")}
                    style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "1.1rem" }}>
                    Home
                </button>

                <button onClick={() => navigate("/login")}
                    style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "1.1rem" }}>
                    Login
                </button>

                <button onClick={() => navigate("/register")}
                    style={{
                        backgroundColor: theme.colors.white.pure,
                        color: theme.colors.primary[600],
                        padding: "10px 25px",
                        borderRadius: "8px",
                        fontWeight: "700",
                        border: "none",
                        cursor: "pointer"
                    }}>
                    Sign Up
                </button>

            </div>

        </nav>
    );
};

export default Header;