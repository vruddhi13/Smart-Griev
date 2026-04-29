import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const CitizenComplaintStatus = () => {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const userId = 1;
        fetch(`https://localhost:7224/api/Complaint/dashboard/${userId}`)
            .then(res => res.json())
            .then(data => {
                setDashboard(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Dashboard...</div>;

    const styles = {
        pageWrapper: {
            backgroundColor: "#f8fafc",
            minHeight: "100vh",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            margin: 0,
            padding: 0
        },
        blueBanner: {
            backgroundColor: "#2563eb",
            padding: "80px 20px 100px 20px",
            color: "white",
            textAlign: "center"
        },
        headerContent: {
            maxWidth: "1200px",
            margin: "0 auto",
            textAlign: "left"
        },
        welcomeText: {
            fontSize: "2.2rem",
            fontWeight: "700",
            margin: "0 0 8px 0"
        },
        subWelcome: {
            fontSize: "1rem",
            opacity: 0.9
        },
        container: {
            maxWidth: "1200px",
            margin: "-60px auto 40px",
            padding: "0 20px",
            boxSizing: "border-box"
        },
        statsGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
            marginBottom: "50px"
        },
        statCard: (borderColor) => ({
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "30px 20px",
            borderLeft: `6px solid ${borderColor}`,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: "10px"
        }),
        statNumber: {
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: "#1e293b",
            lineHeight: "1"
        },
        statLabel: {
            color: "#64748b",
            fontSize: "0.95rem",
            fontWeight: "500"
        },
        sectionTitle: {
            fontSize: "1.25rem",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: "25px",
            textAlign: "center"
        },
        actionGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "25px",
            marginBottom: "50px"
        },
        actionCard: {
            backgroundColor: "white",
            padding: "40px 20px",
            borderRadius: "16px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
            cursor: "pointer",
            border: "1px solid #e2e8f0",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transition: "all 0.3s ease"
        },
        actionIcon: {
            fontSize: "2.5rem",
            marginBottom: "15px"
        },
        tableCard: {
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e2e8f0"
        },
        table: {
            width: "100%",
            borderCollapse: "collapse"
        },
        th: {
            textAlign: "left",
            padding: "12px 15px",
            borderBottom: "2px solid #f1f5f9",
            color: "#64748b",
            fontSize: "0.75rem",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
        },
        td: {
            padding: "16px 15px",
            borderBottom: "1px solid #f1f5f9",
            verticalAlign: "middle",
            textAlign: "left" // Ensures horizontal alignment is strictly left
        },
        // COLUMN DETAILS WRAPPER
        complaintDetailWrapper: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start", // Strictly forces text to the left
            gap: "2px"
        },
        titleText: {
            fontWeight: "600",
            color: "#1e293b",
            fontSize: "0.95rem",
            textAlign: "left"
        },
        miniId: {
            fontSize: "0.75rem",
            color: "#94a3b8", // Greyish mini text
            fontWeight: "500"
        },
        badge: (type) => {
            let bgColor = "#f1f5f9";
            let textColor = "#475569";

            if (type === "High") {
                bgColor = "#fee2e2"; // Red box
                textColor = "#ef4444";
            } else if (type === "Medium") {
                bgColor = "#fef3c7";
                textColor = "#d97706";
            } else if (type === "Low") {
                bgColor = "#dcfce7"; // Green box
                textColor = "#10b981";
            } else if (type === "Submitted" || type === "Active") {
                bgColor = "#eff6ff";
                textColor = "#3b82f6";
            }

            return {
                backgroundColor: bgColor,
                color: textColor,
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontWeight: "600",
                display: "inline-block",
                textAlign: "center",
                minWidth: "80px"
            };
        }
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.blueBanner}>
                <div style={styles.headerContent}>
                    <h1 style={styles.welcomeText}>Welcome back, Shreya Vora! 👋</h1>
                    <p style={styles.subWelcome}>Here's what's happening with your complaints today.</p>
                </div>
            </div>

            <div style={styles.container}>
                {/* Stats Grid */}
                <div style={styles.statsGrid}>
                    <div style={styles.statCard("#3b82f6")}>
                        <span style={{ fontSize: '1.5rem' }}>📊</span>
                        <div style={styles.statNumber}>{dashboard?.total || 0}</div>
                        <div style={styles.statLabel}>Total Complaints</div>
                    </div>
                    <div style={styles.statCard("#f59e0b")}>
                        <span style={{ fontSize: '1.5rem' }}>⏳</span>
                        <div style={styles.statNumber}>{dashboard?.pending || 0}</div>
                        <div style={styles.statLabel}>Pending</div>
                    </div>
                    <div style={styles.statCard("#3b82f6")}>
                        <span style={{ fontSize: '1.5rem' }}>🔄</span>
                        <div style={styles.statNumber}>{dashboard?.inPending || 0}</div>
                        <div style={styles.statLabel}>In Progress</div>
                    </div>
                    <div style={styles.statCard("#10b981")}>
                        <span style={{ fontSize: '1.5rem' }}>✅</span>
                        <div style={styles.statNumber}>{dashboard?.resolved || 0}</div>
                        <div style={styles.statLabel}>Resolved</div>
                    </div>
                </div>
                <h2 style={styles.sectionTitle}>Quick Actions</h2>
                <div style={styles.actionGrid}>
                    <div style={styles.actionCard}>
                        <div style={styles.actionIcon}>🤖</div>
                        <h3 style={{ margin: '0 0 10px 0' }}>AI Chatbot</h3>
                        <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: '1.5' }}> Get instant help from our AI assistant. Ask questions or track status. </p>
                    </div>
                    <div style={styles.actionCard}>
                        <div style={styles.actionIcon} onClick={() => navigate("/CitizenComplaint")}>📝</div>
                        <h3 style={{ margin: '0 0 10px 0' }}>Submit New Complaint</h3>
                        <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: '1.5' }}> Create a new complaint with image or audio evidence using our system. </p>
                    </div>
                    <div style={styles.actionCard}>
                        <div style={styles.actionIcon} onClick={() => navigate("/MyComplaints")}>📋</div>
                        <h3 style={{ margin: '0 0 10px 0' }}>View All Complaints</h3>
                        <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: '1.5' }}> See all your submitted complaints and track their live progress. </p>
                    </div>
                </div>

                <h2 style={styles.sectionTitle}>Recent Complaints</h2>
                <div style={styles.tableCard}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Complaint Details</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Priority</th>
                                <th style={styles.th}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboard?.recentComplaints?.length > 0 ? (
                                dashboard.recentComplaints.map((item) => (
                                    <tr key={item.complaintId}>
                                        <td style={styles.td}>
                                            <div style={styles.complaintDetailWrapper}>
                                                <span style={styles.titleText}>{item.title}</span>
                                                <span style={styles.miniId}>ID: {item.complaintId}</span>
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={styles.badge(item.status)}>{item.status}</span>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={styles.badge(item.priority)}>{item.priority}</span>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={{ color: "#64748b", fontSize: "0.85rem" }}>
                                                {new Date(item.date).toLocaleDateString('en-GB')}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No complaints yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CitizenComplaintStatus;