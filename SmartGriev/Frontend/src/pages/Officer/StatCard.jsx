import React from "react";

const StatCard = ({ title, value, icon, color }) => {
    return (
        <div style={{
            padding: "24px",
            borderRadius: "12px",
            background: "white",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
        }}>
            <div style={{
                background: `${color}15`,
                color: color,
                padding: "12px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                {icon}
            </div>
            <div>
                <p style={{ margin: 0, color: "#64748b", fontSize: "14px", fontWeight: "500" }}>{title}</p>
                <h3 style={{ margin: "4px 0 0 0", fontSize: "24px", color: "#1e293b", fontWeight: "bold" }}>{value}</h3>
            </div>
        </div>
    );
};

export default StatCard;