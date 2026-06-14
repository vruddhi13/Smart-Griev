import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useTranslationContext } from "../../Context/TranslationContext";

const CitizenComplaintStatus = () => {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslationContext();
    const navigate = useNavigate();
    
    const [analyticsView, setAnalyticsView] = React.useState('all'); // 'all' | 'active'
    const [logTab, setLogTab] = React.useState('streams'); // 'streams' | 'critical'

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
        const token = sessionStorage.getItem("token");

        fetch(
            `https://localhost:7224/api/Complaint/dashboard/${user?.userId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                setDashboard(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setLoading(false);
            });
    }, [user?.userId]);

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>{t("loading_dashboard")}</div>;

    // 🧠 Derived metrics calculated on the fly from existing endpoint data
    const total = dashboard?.total || 0;
    const resolved = dashboard?.resolved || 0;

    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    let citizenBadge = "New Contributor";
    let badgeColor = "#3b82f6";
    if (resolutionRate >= 80 && total >= 3) {
        citizenBadge = "Civic Champion ⭐";
        badgeColor = "#10b981";
    } else if (resolutionRate >= 50 && total >= 1) {
        citizenBadge = "Active Voice";
        badgeColor = "#f59e0b";
    }

    const latestComplaint = dashboard?.recentComplaints && dashboard.recentComplaints.length > 0
        ? dashboard.recentComplaints[0]
        : null;

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
            padding: "80px 20px 100px 20px", // Original deep banner padding
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
            margin: "-60px auto 40px", // Original banner overlap
            padding: "0 20px",
            boxSizing: "border-box"
        },
        statsGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", // Original column layout
            gap: "20px",
            marginBottom: "50px"
        },
        // 🎨 RESTORED YOUR EXACT STAT CARD LOOK
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
        doubleColumnGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
            gap: "25px",
            marginBottom: "40px"
        },
        dashboardPanel: {
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
            border: "1px solid #e2e8f0",
            display: "flex",
            flexDirection: "column"
        },
        panelTitle: {
            fontSize: "1.25rem",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: "25px",
            textAlign: "center"
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
        badge: (type) => {
            let bgColor = "#f1f5f9";
            let textColor = "#475569";
            if (type === "High" || type === "Rejected") { bgColor = "#fee2e2"; textColor = "#ef4444"; }
            else if (type === "Medium" || type === "Pending") { bgColor = "#fef3c7"; textColor = "#d97706"; }
            else if (type === "Low" || type === "Resolved") { bgColor = "#dcfce7"; textColor = "#10b981"; }
            else if (type === "Submitted" || type === "In Progress" || type === "Active") { bgColor = "#eff6ff"; textColor = "#3b82f6"; }

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
            {/* Banner Section */}
            <div style={styles.blueBanner}>
                <div style={styles.headerContent}>
                    <h1 style={styles.welcomeText}>{t("welcome_back")}, {user?.name || "User"}! 👋</h1>
                    <p style={styles.subWelcome}>{t("dashboard_welcome")}</p>
                </div>
            </div>

            <div style={styles.container}>
                {/* 📊 ROW 1: Restored Your Exact Stat Cards Layout */}
                <div style={styles.statsGrid}>
                    <div style={styles.statCard("#3b82f6")}>
                        <span style={{ fontSize: '1.5rem' }}>📊</span>
                        <div style={styles.statNumber}>{total}</div>
                        <div style={styles.statLabel}>{t("total_complaints")}</div>
                    </div>
                    <div style={styles.statCard("#f59e0b")}>
                        <span style={{ fontSize: '1.5rem' }}>⏳</span>
                        <div style={styles.statNumber}>{dashboard?.pending || 0}</div>
                        <div style={styles.statLabel}>{t("pending")}</div>
                    </div>
                    <div style={styles.statCard("#3b82f6")}>
                        <span style={{ fontSize: '1.5rem' }}>🔄</span>
                        <div style={styles.statNumber}>{dashboard?.inProgress || 0}</div>
                        <div style={styles.statLabel}>{t("in_progress")}</div>
                    </div>
                    <div style={styles.statCard("#10b981")}>
                        <span style={{ fontSize: '1.5rem' }}>✅</span>
                        <div style={styles.statNumber}>{resolved}</div>
                        <div style={styles.statLabel}>{t("resolved")}</div>
                    </div>
                </div>

                {/* 🚀 ROW 3: Quick Action Section */}
                <h2 style={styles.sectionTitle}>{t("quick_actions")}</h2>
                <div style={styles.actionGrid}>
                    <div style={styles.actionCard}>
                        <div style={styles.actionIcon} onClick={() => navigate("/AIChatBotPage")}>🤖</div>
                        <h3 style={{ margin: '0 0 10px 0' }}>{t("ai_chatbot_status")}</h3>
                        <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: '1.5' }}> {t("ai_chatbot_text")} </p>
                    </div>
                    <div style={styles.actionCard}>
                        <div style={styles.actionIcon} onClick={() => navigate("/CitizenComplaint")}>📝</div>
                        <h3 style={{ margin: '0 0 10px 0' }}>{t("submit_new_complaint")}</h3>
                        <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: '1.5' }}>{t("submit_desc")}</p>
                    </div>
                    <div style={styles.actionCard}>
                        <div style={styles.actionIcon} onClick={() => navigate("/MyComplaints")}>📋</div>
                        <h3 style={{ margin: '0 0 10px 0' }}>{t("view_all_complaints")}</h3>
                        <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: '1.5' }}> {t("view_desc")} </p>
                    </div>
                </div>

                <style>{`
                    @keyframes pulseGlow {
                        0% { transform: scale(0.95); opacity: 0.5; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                        70% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
                        100% { transform: scale(0.95); opacity: 0.5; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                    }
                    @keyframes textPulse {
                        0% { opacity: 0.6; }
                        50% { opacity: 1; }
                        100% { opacity: 0.6; }
                    }
                `}</style>

                {/* 🎯 ROW 2: High-Fidelity Interactive Analytics Hub */}
                {(() => {
                    // ⚙️ Safe local variable parsing
                    const pendingCases = total - resolved;
                    const activeDisplayRate = total > 0 ? Math.round((pendingCases / total) * 100) : 0;

                    const criticalLogs = dashboard?.recentComplaints?.filter(c =>
                        c.priority?.toLowerCase() === 'high' || c.priority?.toLowerCase() === 'critical'
                    ) || [];

                    const targets = logTab === 'streams' ? (dashboard?.recentComplaints || []) : criticalLogs;
                    const renderSet = targets.slice(0, 3);

                    return (
                        <div style={styles.doubleColumnGrid}>

                            {/* Left Column: Interactive Trust Analytics & Live Spotlight */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                                {/* Advanced Analytics Card (SYSTEM DIAGNOSTICS - UNCHANGED) */}
                                <div style={{
                                    ...styles.dashboardPanel,
                                    padding: '24px',
                                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                                    border: '1px solid #e2e8f0',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', animation: 'pulseGlow 2s infinite' }} />
                                            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                {t("system_diagnostics")}
                                            </span>
                                        </div>

                                        {/* Interactive Scope Switcher */}
                                        <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '2px', borderRadius: '6px' }}>
                                            <button
                                                onClick={() => setAnalyticsView('all')}
                                                style={{
                                                    border: 'none', fontSize: '0.7rem', fontWeight: '700', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer',
                                                    backgroundColor: analyticsView === 'all' ? '#ffffff' : 'transparent',
                                                    color: analyticsView === 'all' ? '#0f172a' : '#64748b',
                                                    boxShadow: analyticsView === 'all' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                                                    transition: 'all 0.15s ease'
                                                }}
                                            >
                                                {t("all_time")}
                                            </button>
                                            <button
                                                onClick={() => setAnalyticsView('active')}
                                                style={{
                                                    border: 'none', fontSize: '0.7rem', fontWeight: '700', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer',
                                                    backgroundColor: analyticsView === 'active' ? '#ffffff' : 'transparent',
                                                    color: analyticsView === 'active' ? '#0f172a' : '#64748b',
                                                    boxShadow: analyticsView === 'active' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                                                    transition: 'all 0.15s ease'
                                                }}
                                            >
                                                {t("backlog_ratio")}
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ textAlign: 'left' }}>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1e293b', margin: '0 0 6px 0' }}>
                                                {analyticsView === 'all' ? t("resolution_efficiency") : t("active_pipeline_load")}
                                            </h3>

                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '2.6rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', lineHeight: '1' }}>
                                                    {analyticsView === 'all' ? `${resolutionRate}%` : `${activeDisplayRate}%`}
                                                </span>
                                                <span style={{
                                                    fontSize: '0.7rem', fontWeight: '700', color: '#16a34a', backgroundColor: '#f0fdf4',
                                                    padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px'
                                                }}>
                                                    ↑ {analyticsView === 'all' ? '4.2%' : '1.8%'}
                                                </span>
                                            </div>

                                            <span style={{
                                                fontSize: '0.75rem',
                                                fontWeight: '700',
                                                color: 'white',
                                                backgroundColor: badgeColor, // This was working
                                                padding: '3px 9px',
                                                borderRadius: '20px'
                                            }}>
                                                {citizenBadge} {/* Now the variable is used and the error disappears! */}
                                            </span>
                                        </div>

                                        {/* Visual Circle Dashboard Dial */}
                                        <div style={{ width: '76px', height: '76px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                            <svg style={{ transform: 'rotate(-90deg)', width: '76px', height: '76px' }}>
                                                <circle cx="38" cy="38" r="31" stroke="#e2e8f0" strokeWidth="5.5" fill="transparent" />
                                                <circle cx="38" cy="38" r="31"
                                                    stroke={analyticsView === 'all' ? badgeColor : '#f59e0b'}
                                                    strokeWidth="5.5" fill="transparent"
                                                    strokeDasharray={`${2 * Math.PI * 31}`}
                                                    strokeDashoffset={`${2 * Math.PI * 31 * (1 - (analyticsView === 'all' ? resolutionRate : activeDisplayRate) / 100)}`}
                                                    strokeLinecap="round"
                                                    style={{ transition: 'stroke-dashoffset 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
                                                />
                                            </svg>
                                            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#334155', fontFamily: 'monospace' }}>
                                                    {analyticsView === 'all' ? resolved : pendingCases}
                                                </span>
                                                <span style={{ fontSize: '0.55rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
                                                    {analyticsView === 'all' ? t("done") : t("open")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                                        <span>{t("total_tracked_footprint")}: <strong>{total} {t("cases")}</strong></span>
                                        <span style={{ fontWeight: '600', color: '#2563eb', animation: 'textPulse 3s infinite' }}>
                                            {analyticsView === 'all' ? t("integrity_factor") : t("queue_delay")}
                                        </span>
                                    </div>
                                </div>

                                {/* Real-time Case Spotlight Card (CLEANED UP DATA FOR ADMIN) */}
                                <div style={{ ...styles.dashboardPanel, borderTop: '4px solid #2563eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                        <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span>📌</span> {t("critical_queue_spotlight")}
                                        </h3>
                                        <span style={{ fontSize: '0.65rem', backgroundColor: '#fef2f2', color: '#ef4444', padding: '3px 8px', borderRadius: '4px', fontWeight: '800', letterSpacing: '0.05em' }}>
                                            {t("live_monitor")}
                                        </span>
                                    </div>

                                    {latestComplaint ? (
                                        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700' }}>
                                                    <span>{t("id")}:</span>
                                                    <span style={{ color: '#0f172a', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>
                                                        #{latestComplaint.complaintId}
                                                    </span>

                                                    <span style={{ color: '#64748b' }}>•</span>
                                                    <span style={{ color: '#475569', backgroundColor: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>
                                                        🏷️ {t("category")}: {latestComplaint.categoryName || t("other")}
                                                    </span>
                                                </div>
                                                <h4 style={{ fontSize: '1.05rem', margin: '8px 0 2px 0', color: '#1e293b', fontWeight: '600' }}>
                                                    {latestComplaint.title}
                                                </h4>
                                                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0 0', lineHeight: '1.4' }}>
                                                    {latestComplaint.description || t("no_additional_details")}
                                                </p>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: '700' }}>{t("status_field")}</div>
                                                    <div style={{ marginTop: '4px' }}>
                                                        <span style={styles.badge(latestComplaint.status)}>{latestComplaint.status}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: '700', textAlign: 'right' }}>{t("severity_indices")}</div>
                                                    <div style={{ marginTop: '4px', textAlign: 'right' }}>
                                                        <span style={styles.badge(latestComplaint.priority)}>{latestComplaint.priority}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#64748b' }}>
                                                <span>{t("ingested")}: <strong>{new Date(latestComplaint.date).toLocaleDateString('en-GB')}</strong></span>
                                                <span
                                                    style={{ color: '#2563eb', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                                                    onClick={() => navigate("/MyComplaints")}
                                                >
                                                    {t("inspect_audit_trail")} &rarr;
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8' }}>
                                            <p style={{ fontSize: '0.9rem', margin: 0 }}>{t("no_dynamic_assignments")}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Column: Advanced Filtered Lifecycle Timeline System */}
                            <div style={{ ...styles.dashboardPanel, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                                    <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span>⏳</span> {t("lifecycle_stream_log")}
                                    </h3>

                                    {/* Functional Navigation Tabs */}
                                    <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
                                        <button
                                            onClick={() => setLogTab('streams')}
                                            style={{
                                                border: 'none', fontSize: '0.75rem', fontWeight: '600', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer',
                                                backgroundColor: logTab === 'streams' ? '#ffffff' : 'transparent',
                                                color: logTab === 'streams' ? '#1e293b' : '#64748b',
                                                boxShadow: logTab === 'streams' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            {t("all_streams")}
                                        </button>
                                        <button
                                            onClick={() => setLogTab('critical')}
                                            style={{
                                                border: 'none', fontSize: '0.75rem', fontWeight: '600', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer',
                                                backgroundColor: logTab === 'critical' ? '#ffffff' : 'transparent',
                                                color: logTab === 'critical' ? '#1e293b' : '#64748b',
                                                boxShadow: logTab === 'critical' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            {t("escalations")} ({criticalLogs.length})
                                        </button>
                                    </div>
                                </div>

                                {/* Dynamic List Rendering Base */}
                                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-start' }}>
                                    {renderSet.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '50px 0', color: '#94a3b8' }}>
                                            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>
                                                {logTab === 'streams' ? '📭' : '🛡️'}
                                            </span>
                                            <p style={{ fontSize: '0.85rem', margin: 0 }}>
                                                {logTab === 'streams' ? t("no_recent_complaints") : t("no_critical_warnings")}
                                            </p>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                                            {renderSet.map((item, index, arr) => {
                                                const statusColor = item.status === 'Resolved' ? '#10b981' : item.status === 'In Progress' ? '#3b82f6' : '#f59e0b';
                                                return (
                                                    <div key={item.complaintId} style={{ display: 'flex', gap: '16px' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                            <div style={{
                                                                width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffffff',
                                                                border: `3px solid ${statusColor}`, boxShadow: `0 0 0 3px ${statusColor}15`,
                                                                marginTop: '4px', zIndex: 2
                                                            }} />
                                                            {index !== arr.length - 1 && (
                                                                <div style={{ width: '2px', backgroundColor: '#e2e8f0', flexGrow: 1, margin: '6px 0', zIndex: 1 }} />
                                                            )}
                                                        </div>

                                                        <div style={{ paddingBottom: index === arr.length - 1 ? '0' : '20px', flex: 1 }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', fontFamily: 'monospace' }}>
                                                                    {new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                                </span>
                                                                <span style={styles.badge(item.status)}>{item.status}</span>
                                                            </div>

                                                            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginTop: '6px', lineHeight: '1.4' }}>
                                                                {logTab === 'streams' ? (
                                                                    <>{t("complaint_submitted_under")} <span style={{ color: '#2563eb', fontFamily: 'monospace' }}>#{item.complaintId}</span> {t("submitted_under")} <strong>{item.categoryName || t("general_administration")}</strong>.</>
                                                                ) : (
                                                                    <>{t("sla_breach_warning")}: Ticket <span style={{ color: '#ef4444', fontFamily: 'monospace' }}>#{item.complaintId}</span> {t("requires_immediate_action")}.</>
                                                                )}
                                                            </div>

                                                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', whiteSpace: 'normal' }}>
                                                                <strong>📋 {t("description_label")}:</strong> "{item.title}"
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    );
                })()}
            

                {/* 📊 ROW 4: Simplified Operational Insights & Updates */}
                <h2 style={{
                    ...styles.sectionTitle,
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: '#0f172a',
                    marginTop: '32px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span>📊</span> {t("dashboard_overview")}
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '20px',
                    marginBottom: '20px',
                    width: '100%'
                }}>

                    {/* Left Card: Clean Progress Distribution */}
                    <div style={{
                        ...styles.dashboardPanel,
                        padding: '24px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                        textAlign: 'left'
                    }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b', margin: '0 0 16px 0' }}>
                            📑 {t("processing_distribution")}
                        </h3>

                        {/* Item 1: Resolved */}
                        <div style={{ marginBottom: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
                                <span>{t("completed_resolved")}</span>
                                <span>{resolved} / {total} ({resolutionRate}%)</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${resolutionRate}%`, height: '100%', backgroundColor: '#10b981', borderRadius: '4px' }} />
                            </div>
                        </div>

                        {/* Item 2: Pending */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
                                <span>{t("under_active_review")}</span>
                                <span>{total - resolved} / {total} ({total > 0 ? Math.round(((total - resolved) / total) * 100) : 0}%)</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${total > 0 ? ((total - resolved) / total) * 100 : 0}%`, height: '100%', backgroundColor: '#f59e0b', borderRadius: '4px' }} />
                            </div>
                        </div>
                    </div>

                    {/* Right Card: Simplified System Messages / Tips */}
                    <div style={{
                        ...styles.dashboardPanel,
                        padding: '24px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                        textAlign: 'left',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <span style={{ fontSize: '1.5rem' }}>📢</span>
                            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                                {t("system_info_desk")}
                            </h3>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.5', margin: '0 0 10px 0' }}>
                            {t("system_info_description")}
                        </p>
                        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#2563eb' }}>
                            💡 {t("system_info_tip")}
                        </span>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default CitizenComplaintStatus;