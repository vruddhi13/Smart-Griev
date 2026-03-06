import React from "react";
import { theme } from "../services/theme";

const Footer = () => {

    return (

        <section style={{
            background: `linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.primary[700]} 100%)`,
            color: theme.colors.white.pure,
            padding: "100px 20px",
            textAlign: "center",
            width: "100%"
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

            <button style={{
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

};

export default Footer;