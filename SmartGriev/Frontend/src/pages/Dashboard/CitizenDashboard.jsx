import React from "react";
import { theme } from "../../services/theme";
import { useNavigate } from "react-router-dom";
//import Translate from "../../Components/TranslateAllText";
import { useTranslationContext } from "../../Context/TranslationContext";

const CitizenDashboard = () => {
    const { t } = useTranslationContext();
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
                        {t("hero_title_1")} <br /> {t("hero_title_2")}
                    </h1>

                    <p style={description}>
                        {t("hero_description")}
                    </p>

                    <div style={buttonContainer}>

                        <button style={primaryButton} onClick={() => navigate("/AIChatBotPage")}>
                            {t("btn_ai_chatbot")}
                        </button>

                        <button style={outlineButton} onClick={() => navigate("/CitizenComplaint")}>
                            {t("btn_submit_complaint")}
                        </button>

                    </div>

                </div>

                {/* CHATBOT */}

                <div style={chatbotCard}>

                    <div style={chatHeader}>
                        {t("smart_ai_assistant")}
                        <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>
                            {t("powered_by_ai")}
                        </div>
                    </div>

                    <div style={chatBody}>

                        <div style={botMessage}>
                            {t("chat_hello")}
                        </div>

                        <div style={userMessage}>
                            {t("chat_user_report")}
                        </div>

                        <div style={botMessage}>
                            {t("chat_bot_guidance")}
                        </div>

                        <div style={userMessage}>
                            {t("chat_user_location")}
                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
};

export default CitizenDashboard;