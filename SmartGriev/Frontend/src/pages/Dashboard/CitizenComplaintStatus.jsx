import React from "react";

const CitizenComplaintStatus = () => {
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
            padding: "80px 20px 100px 20px", // Increased bottom padding for the overlap
            color: "white",
            textAlign: "center" // Matches the second image's centered text feel
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
            margin: "-60px auto 40px", // Pulls cards into the blue banner
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
            alignItems: "center", // Center content like in image
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
            gridTemplateColumns: "repeat(3, 1fr)", // Force 3 columns for desktop
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
            padding: "20px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e2e8f0"
        },
        table: {
            width: "100%",
            borderCollapse: "collapse"
        },
        th: {
            textAlign: "left",
            padding: "15px",
            borderBottom: "2px solid #f1f5f9",
            color: "#64748b",
            fontSize: "0.85rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
        },
        tdEmpty: {
            textAlign: "center",
            padding: "60px",
            color: "#94a3b8",
            fontSize: "1rem"
        }
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.blueBanner}>
                <div style={styles.headerContent}>
                    <h1 style={styles.welcomeText}>Welcome back, User! 👋</h1>
                    <p style={styles.subWelcome}>Here's what's happening with your complaints today.</p>
                </div>
            </div>

            <div style={styles.container}>
                <div style={styles.statsGrid}>
                    <div style={styles.statCard("#3b82f6")}>
                        <span style={{ fontSize: '1.5rem' }}>📊</span>
                        <div style={styles.statNumber}>0</div>
                        <div style={styles.statLabel}>Total Complaints</div>
                    </div>
                    <div style={styles.statCard("#f59e0b")}>
                        <span style={{ fontSize: '1.5rem' }}>⏳</span>
                        <div style={styles.statNumber}>0</div>
                        <div style={styles.statLabel}>Pending</div>
                    </div>
                    <div style={styles.statCard("#3b82f6")}>
                        <span style={{ fontSize: '1.5rem' }}>🔄</span>
                        <div style={styles.statNumber}>0</div>
                        <div style={styles.statLabel}>In Progress</div>
                    </div>
                    <div style={styles.statCard("#10b981")}>
                        <span style={{ fontSize: '1.5rem' }}>✅</span>
                        <div style={styles.statNumber}>0</div>
                        <div style={styles.statLabel}>Resolved</div>
                    </div>
                </div>

                <h2 style={styles.sectionTitle}>Quick Actions</h2>
                <div style={styles.actionGrid}>
                    <div style={styles.actionCard}>
                        <div style={styles.actionIcon}>🤖</div>
                        <h3 style={{ margin: '0 0 10px 0' }}>AI Chatbot</h3>
                        <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: '1.5' }}>
                            Get instant help from our AI assistant. Ask questions or track status.
                        </p>
                    </div>
                    <div style={styles.actionCard}>
                        <div style={styles.actionIcon}>📝</div>
                        <h3 style={{ margin: '0 0 10px 0' }}>Submit New Complaint</h3>
                        <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: '1.5' }}>
                            Create a new complaint with image or audio evidence using our system.
                        </p>
                    </div>
                    <div style={styles.actionCard}>
                        <div style={styles.actionIcon}>📋</div>
                        <h3 style={{ margin: '0 0 10px 0' }}>View All Complaints</h3>
                        <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: '1.5' }}>
                            See all your submitted complaints and track their live progress.
                        </p>
                    </div>
                </div>

                <h2 style={styles.sectionTitle}>Recent Complaints</h2>
                <div style={styles.tableCard}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>Title</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Priority</th>
                                <th style={styles.th}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="5" style={styles.tdEmpty}>
                                    No complaints yet. Start by submitting your first complaint!
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CitizenComplaintStatus;