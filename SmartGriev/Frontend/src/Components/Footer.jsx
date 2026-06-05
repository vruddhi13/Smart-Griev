import React from "react";
import { theme } from "../services/theme";
import { useNavigate } from 'react-router-dom';

const Footer = () => {

    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");

    // --- CASE 1: LOGGED OUT FOOTER (Your Original CTA) ---
    if (!token) {
        return (
            <section style={{
                background: `linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.primary[700]} 100%)`,
                color: theme.colors.white.pure,
                padding: "100px 20px",
                textAlign: "center",
                width: "100%",
                boxSizing: "border-box"
            }}>
                <h2 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
                    Ready to Get Started?
                </h2>

                <p style={{
                    opacity: 0.9,
                    maxWidth: "650px",
                    margin: "0 auto 40px auto",
                    fontSize: "1.1rem"
                }}>
                    Join thousands of citizens using SmartGriev to make their voices heard.
                </p>

                <button onClick={() => navigate("/Register")} style={{
                    backgroundColor: theme.colors.white.pure,
                    color: theme.colors.primary[600],
                    padding: "15px 40px",
                    borderRadius: theme.borderRadius.full,
                    fontWeight: "800",
                    border: "none",
                    fontSize: "1.1rem",
                    cursor: "pointer"
                }}>
                    Create Free Account →
                </button>
            </section>
        );
    }

    // --- CASE 2: LOGGED IN FOOTER (Perfect Alignment Fixes) ---
    return (
        <footer style={{
            background: "#1e40af",
            color: "#f3f4f6",
            padding: "50px 40px 25px 40px", // Generous padding to mirror upper dashboard components
            width: "100%",
            boxSizing: "border-box",
            fontSize: "0.95rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.15)"
        }}>
            {/* Top Grid Sections (Left-Aligned Columns) */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr", // Refined column balance ratio
                gap: "60px",
                maxWidth: "1200px",
                margin: "0 auto",
                paddingBottom: "35px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.15)"
            }}>
                {/* Column 1: Brand Info */}
                <div style={{ textAlign: "left" }}>
                    <h3 style={{
                        color: "#ffffff",
                        marginBottom: "16px",
                        fontSize: "1.25rem",
                        fontWeight: "700",
                        letterSpacing: "0.5px"
                    }}>
                        SmartGriev
                    </h3>
                    <p style={{ color: "#bfdbfe", lineHeight: "1.6", margin: 0, maxWidth: "460px" }}>
                        Empowering citizens to report issues, track resolutions, and build a transparent community together.
                    </p>
                </div>

                {/* Column 2: Quick Links */}
                <div style={{ textAlign: "left" }}>
                    <h4 style={{
                        color: "#ffffff",
                        marginBottom: "16px",
                        fontWeight: "600",
                        fontSize: "1rem"
                    }}>
                        Grievances
                    </h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: "2.2" }}>
                        <li>
                            <span
                                onClick={() => navigate("/CitizenComplaintStatus")}
                                style={{
                                    color: "#bfdbfe",
                                    cursor: "pointer",
                                    textDecoration: "none",
                                    transition: "color 0.2s"
                                }}
                                onMouseOver={(e) => e.target.style.color = '#ffffff'}
                                onMouseOut={(e) => e.target.style.color = '#bfdbfe'}
                            >
                                Dashboard
                            </span>
                        </li>
                        <li>
                            <span
                                onClick={() => navigate("/CitizenComplaint")}
                                style={{
                                    color: "#bfdbfe",
                                    cursor: "pointer",
                                    textDecoration: "none",
                                    transition: "color 0.2s"
                                }}
                                onMouseOver={(e) => e.target.style.color = '#ffffff'}
                                onMouseOut={(e) => e.target.style.color = '#bfdbfe'}
                            >
                                File a Complaint
                            </span>
                        </li>
                        <li>
                            <span
                                onClick={() => navigate("/MyComplaints")} // Synced to match your card navigation path
                                style={{
                                    color: "#bfdbfe",
                                    cursor: "pointer",
                                    textDecoration: "none",
                                    transition: "color 0.2s"
                                }}
                                onMouseOver={(e) => e.target.style.color = '#ffffff'}
                                onMouseOut={(e) => e.target.style.color = '#bfdbfe'}
                            >
                                Track Status
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Copyright Bar */}
            <div style={{
                paddingTop: "25px",
                color: "#93c5fd",
                fontSize: "0.85rem",
                maxWidth: "1200px",
                margin: "0 auto",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "15px"
            }}>
                <span>© {new Date().getFullYear()} SmartGriev Portal. All rights reserved.</span>
                <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                    <a href="#/privacy" style={{ color: "#93c5fd", textDecoration: "none" }}>Privacy Policy</a>
                    <span style={{ opacity: 0.4 }}>•</span>
                    <a href="#/terms" style={{ color: "#93c5fd", textDecoration: "none" }}>Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;