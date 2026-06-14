import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OfficerLayout from "../../layout/OfficerLayout";
import { getMyComplaints } from "../../services/OfficerServices/OfficerService";
import { ClipboardList, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

import {
    PieChart, Pie, Cell, Tooltip,
    ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

// ================= BRAND SYSTEM COLORS =================
const BRAND_COLORS = {
    primary: "#4F46E5",     // Active/Assigned Indigo
    warning: "#F59E0B",     // In Progress Amber
    success: "#10B981",     // Resolved Teal/Green
    danger: "#EF4444",      // Rejected Red
    textMain: "#1B254B",    // Deep Navy Headers
    textGray: "#A3AED0",    // Soft Slate Subtitles
    bgTrack: "#F4F7FE"      // Subtle Borders and Tracks
};

const STATUS_COLORS = [
    BRAND_COLORS.primary,
    BRAND_COLORS.warning,
    BRAND_COLORS.success,
    BRAND_COLORS.danger
];

const OfficerDashboard = () => {
    const navigate = useNavigate();

    const [data, setData] = useState({
        total: 0,
        assigned: 0,
        inProgress: 0,
        resolved: 0,
        rejected: 0,
        pie: [],
        performance: []
    });

    // ================= PROCESS DATA =================
    const processData = (list = []) => {
        const assigned = list.filter(x => x.status === "Assigned").length;
        const inProgress = list.filter(x => x.status === "In Progress").length;
        const resolved = list.filter(x => x.status === "Resolved").length;
        const rejected = list.filter(x => x.status === "Rejected").length;

        setData({
            total: list.length,
            assigned,
            inProgress,
            resolved,
            rejected,

            pie: [
                { name: "Assigned", value: assigned },
                { name: "In Progress", value: inProgress },
                { name: "Resolved", value: resolved },
                { name: "Rejected", value: rejected }
            ],

            performance: [
                { name: "Assigned", value: assigned },
                { name: "In Progress", value: inProgress },
                { name: "Resolved", value: resolved },
                { name: "Rejected", value: rejected }
            ]
        });
    };

    // ================= FETCH =================
    useEffect(() => {
        const load = async () => {
            const res = await getMyComplaints();
            processData(res || []);
        };
        load();
    }, []);

    return (
        <OfficerLayout pageTitle="Officer Dashboard">
            <div style={{ display: "flex", flexDirection: "column", gap: "24px", padding: "10px" }}>

                {/* ================= 1. TOP SUMMARY METRIC CARDS ================= */}
                <div style={styles.metricsRow}>
                    <MetricCard
                        title="Total Complaints"
                        value={data.total}
                        icon={ClipboardList}
                        iconBg="#EEF2FF"
                        iconColor={BRAND_COLORS.primary}
                    />
                    <MetricCard
                        title="Assigned"
                        value={data.assigned}
                        icon={Clock}
                        iconBg="#FFFBEB"
                        iconColor={BRAND_COLORS.warning}
                    />
                    <MetricCard
                        title="In Progress"
                        value={data.inProgress}
                        icon={AlertTriangle}
                        iconBg="#FEF2F2"
                        iconColor="#F97316"
                    />
                    <MetricCard
                        title="Resolved Today"
                        value={data.resolved}
                        icon={CheckCircle2}
                        iconBg="#ECFDF5"
                        iconColor={BRAND_COLORS.success}
                    />
                </div>

                {/* ================= 2. CHARTS SECTIONS GRID ================= */}
                <div style={styles.grid}>

                    {/* LEFT PANEL: DONUT OVERVIEW */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div style={styles.card}>
                            <div style={styles.header}>
                                <h3 style={styles.cardTitle}>Status Distribution</h3>
                                <span style={styles.link} onClick={() => navigate("/officer/report")}>
                                    View Report →
                                </span>
                            </div>

                            <div style={styles.pieBox}>
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie
                                            data={data.pie}
                                            dataKey="value"
                                            innerRadius={65}
                                            outerRadius={90}
                                            paddingAngle={5}
                                            cornerRadius={4}
                                        >
                                            {data.pie.map((_, i) => (
                                                <Cell key={i} fill={STATUS_COLORS[i]} style={{ outline: 'none' }} />
                                            ))}
                                        </Pie>
                                        <Tooltip cursor={{ fill: 'transparent' }} />
                                    </PieChart>
                                </ResponsiveContainer>

                                <div style={styles.centerText}>
                                    <h2 style={{ fontSize: "28px", fontWeight: "800", color: BRAND_COLORS.textMain, margin: 0 }}>
                                        {data.total}
                                    </h2>
                                    <p style={{ fontSize: "13px", fontWeight: "500", color: BRAND_COLORS.textGray, margin: 0 }}>
                                        Total
                                    </p>
                                </div>
                            </div>

                            {/* LEGEND ROW UNDER PIE */}
                            <div style={styles.legendContainer}>
                                {data.pie.map((item, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: STATUS_COLORS[i] }} />
                                        <span style={{ fontSize: "13px", fontWeight: "600", color: BRAND_COLORS.textMain }}>{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* LINEAR COMPLAINT PROGRESS CARDS */}
                        <div style={styles.card}>
                            <h3 style={{ ...styles.cardTitle, marginBottom: "16px" }}>Complaint Milestones</h3>
                            <Progress label="Assigned" value={data.assigned} total={data.total} color={BRAND_COLORS.primary} />
                            <Progress label="In Progress" value={data.inProgress} total={data.total} color={BRAND_COLORS.warning} />
                            <Progress label="Resolved" value={data.resolved} total={data.total} color={BRAND_COLORS.success} />
                            <Progress label="Rejected" value={data.rejected} total={data.total} color={BRAND_COLORS.danger} />
                        </div>
                    </div>

                    {/* RIGHT PANEL: PERFORMANCE BAR CHART */}
                    <div style={styles.card}>
                        <div style={{ marginBottom: "20px" }}>
                            <h3 style={styles.cardTitle}>Performance Overview</h3>
                            <p style={{ fontSize: "13px", color: BRAND_COLORS.textGray, margin: "4px 0 0 0" }}>
                                Case tracking distribution analytics
                            </p>
                        </div>

                        <ResponsiveContainer width="100%" height={340}>
                            <BarChart data={data.performance} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4F7FE" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: BRAND_COLORS.textGray, fontSize: 13, fontWeight: 500 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: BRAND_COLORS.textGray, fontSize: 13, fontWeight: 500 }}
                                />
                                <Tooltip cursor={{ fill: '#F4F7FE', opacity: 0.6 }} />
                                <Bar dataKey="value" barSize={56} radius={[6, 6, 0, 0]}>
                                    {data.performance.map((_, i) => (
                                        <Cell key={i} fill={STATUS_COLORS[i]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                </div>
            </div>
        </OfficerLayout>
    );
};

/* ================= COMPONENT: TOP CARD MODULE ================= */
const MetricCard = ({ title, value, icon: Icon, iconBg, iconColor }) => {
    return (
        <div style={styles.metricCard}>
            <div style={{ ...styles.iconWrapper, background: iconBg }}>
                <Icon size={22} color={iconColor} strokeWidth={2.5} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={styles.metricTitle}>{title}</span>
                <span style={styles.metricValue}>{value}</span>
            </div>
        </div>
    );
};

/* ================= COMPONENT: MILESTONE PROGRESS ================= */
const Progress = ({ label, value, total, color }) => {
    const percent = total ? (value / total) * 100 : 0;

    return (
        <div style={{ marginBottom: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span style={{ fontSize: "13px", fontWeight: "600", color: BRAND_COLORS.textMain }}>{label}</span>
                <span style={{ fontSize: "13px", fontWeight: "700", color: BRAND_COLORS.textMain }}>
                    {value} <span style={{ color: BRAND_COLORS.textGray, fontWeight: "500" }}>/ {total}</span>
                </span>
            </div>

            <div style={styles.barBg}>
                <div style={{
                    width: `${percent}%`,
                    height: "7px",
                    background: color,
                    borderRadius: "10px",
                    transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
                }} />
            </div>
        </div>
    );
};

/* ================= MODERN ADMIN-ALIGNED STYLES ================= */
const styles = {
    metricsRow: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px"
    },

    metricCard: {
        background: "white",
        padding: "20px 24px",
        borderRadius: "20px",
        border: `1px solid ${BRAND_COLORS.bgTrack}`,
        boxShadow: "0px 45px 112px rgba(0, 0, 0, 0.02), 0px 9.01px 22.42px rgba(0, 0, 0, 0.01)",
        display: "flex",
        alignItems: "center",
        gap: "18px"
    },

    iconWrapper: {
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },

    metricTitle: {
        fontSize: "14px",
        fontWeight: "500",
        color: BRAND_COLORS.textGray,
        letterSpacing: "-0.02em"
    },

    metricValue: {
        fontSize: "26px",
        fontWeight: "800",
        color: BRAND_COLORS.textMain,
        lineHeight: "32px",
        marginTop: "2px"
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "1fr 1.3fr",
        gap: "24px"
    },

    card: {
        background: "white",
        padding: "24px",
        borderRadius: "20px",
        border: `1px solid ${BRAND_COLORS.bgTrack}`,
        boxShadow: "0px 45px 112px rgba(0, 0, 0, 0.02), 0px 9.01px 22.42px rgba(0, 0, 0, 0.01)"
    },

    cardTitle: {
        fontSize: "16px",
        fontWeight: "700",
        color: BRAND_COLORS.textMain,
        margin: 0
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px"
    },

    link: {
        color: BRAND_COLORS.primary,
        fontSize: "13px",
        fontWeight: "700",
        cursor: "pointer",
        transition: "opacity 0.2s"
    },

    pieBox: {
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "10px"
    },

    centerText: {
        position: "absolute",
        textAlign: "center"
    },

    legendContainer: {
        display: "flex",
        justifyContent: "center",
        gap: "16px",
        marginTop: "15px",
        flexWrap: "wrap"
    },

    barBg: {
        width: "100%",
        height: "7px",
        background: "#F4F7FE",
        borderRadius: "10px"
    }
};

export default OfficerDashboard;