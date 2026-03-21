import React from "react";
import { theme } from "../../services/theme";
import { useNavigate } from "react-router-dom";

const CitizenDashboard = () => {

    const navigate = useNavigate();

    const pageStyle = {
        background: "#f3f4f6",
        paddingTop: "70px",
        paddingBottom: "80px"
    };

    const container = {
        maxWidth: "1300px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "80px",
        padding: "40px 20px"
    };

    const leftSection = {
        flex: 1
    };

    const title = {
        fontSize: "3.5rem",
        fontWeight: "700",
        marginBottom: "20px",
        color: "#111827"
    };

    const description = {
        fontSize: "1.15rem",
        lineHeight: "1.7",
        color: "#4b5563",
        marginBottom: "35px"
    };

    const buttonContainer = {
        display: "flex",
        gap: "18px"
    };

    const primaryButton = {
        background: theme.colors.primary[500],
        color: "white",
        padding: "14px 30px",
        borderRadius: "10px",
        border: "none",
        fontWeight: "600",
        cursor: "pointer"
    };

    const outlineButton = {
        border: `2px solid ${theme.colors.primary[500]}`,
        color: theme.colors.primary[500],
        padding: "14px 30px",
        borderRadius: "10px",
        background: "transparent",
        fontWeight: "600",
        cursor: "pointer"
    };

    const chatbotCard = {
        width: "420px",
        background: "#ffffff",
        borderRadius: "14px",
        border: `2px solid ${theme.colors.primary[100]}`,
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        padding: "20px"
    };

    const chatHeader = {
        background: `linear-gradient(90deg, ${theme.colors.primary[500]}, #60a5fa)`,
        color: "white",
        padding: "18px",
        borderRadius: "10px",
        fontWeight: "600",
        marginBottom: "20px"
    };

    const chatBody = {
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    };

    const botMessage = {
        background: "#e5e7eb",
        padding: "14px 16px",
        borderRadius: "10px",
        maxWidth: "85%",
        fontSize: "0.9rem",
        color: "#1f2937"
    };

    const userMessage = {
        background: theme.colors.primary[500],
        color: "white",
        padding: "14px 16px",
        borderRadius: "10px",
        maxWidth: "75%",
        fontSize: "0.9rem",
        alignSelf: "flex-end"
    };

    return (

        <div style={pageStyle}>

            <div style={container}>

                {/* LEFT CONTENT */}

                <div style={leftSection}>

                    <h1 style={title}>
                        Smart Grievance <br /> Management System
                    </h1>

                    <p style={description}>
                        Submit and track your complaints effortlessly with AI-powered
                        assistance. Get instant responses, multimodal submissions,
                        and real-time updates.
                    </p>

                    <div style={buttonContainer}>

                        <button style={primaryButton}>
                            🤖 Try AI Chatbot
                        </button>

                        <button style={outlineButton} onClick={() => navigate("/CitizenComplaint") }>
                            📝 Submit Complaint
                        </button>

                    </div>

                </div>

                {/* CHATBOT */}

                <div style={chatbotCard}>

                    <div style={chatHeader}>
                        🤖 SmartGriev AI Assistant
                        <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>
                            Powered by Advanced AI
                        </div>
                    </div>

                    <div style={chatBody}>

                        <div style={botMessage}>
                            👋 Hello! I'm your SmartGriev AI assistant.
                            How can I help you today?
                        </div>

                        <div style={userMessage}>
                            I need to report a road damage issue
                        </div>

                        <div style={botMessage}>
                            I can help you with that! Let me guide you through the
                            complaint submission process. First, could you provide
                            the location of the damage?
                        </div>

                        <div style={userMessage}>
                            Main Street, near City Hall
                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
};

export default CitizenDashboard;