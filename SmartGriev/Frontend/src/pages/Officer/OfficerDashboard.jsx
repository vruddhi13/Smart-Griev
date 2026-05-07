import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OfficerLayout from "../../layout/OfficerLayout";
import { getMyComplaints } from "../../services/OfficerServices/OfficerService";

import {
    PieChart, Pie, Cell, Tooltip,
    ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis
} from "recharts";

// ================= COLORS =================
const STATUS_COLORS = ["#4F46E5", "#F59E0B", "#10B981", "#EF4444"];

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

            <div style={styles.grid}>

                {/* ================= LEFT SIDE ================= */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

                    {/* PIE CHART */}
                    <div style={styles.card}>
                        <div style={styles.header}>
                            <h3>Status Overview</h3>

                            <span
                                style={styles.link}
                                onClick={() => navigate("/officer/report")}
                            >
                                OPEN REPORT →
                            </span>
                        </div>

                        <div style={styles.pieBox}>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={data.pie}
                                        dataKey="value"
                                        innerRadius={60}
                                        outerRadius={85}
                                        paddingAngle={4}
                                    >
                                        {data.pie.map((_, i) => (
                                            <Cell key={i} fill={STATUS_COLORS[i]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>

                            <div style={styles.centerText}>
                                <h2>{data.total}</h2>
                                <p>Total</p>
                            </div>
                        </div>
                    </div>

                    {/* SMALL PROGRESS UNDER PIE */}
                    <div style={styles.cardSmall}>
                        <h4 style={{ marginBottom: 10 }}>Complaint Progress</h4>

                        <Progress label="Assigned" value={data.assigned} total={data.total} color="#4F46E5" />
                        <Progress label="In Progress" value={data.inProgress} total={data.total} color="#F59E0B" />
                        <Progress label="Resolved" value={data.resolved} total={data.total} color="#10B981" />
                        <Progress label="Rejected" value={data.rejected} total={data.total} color="#EF4444" />
                    </div>

                </div>

                {/* ================= RIGHT SIDE ================= */}
                <div style={styles.card}>

                    <h3>Performance Overview</h3>

                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={data.performance}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />

                            <Bar dataKey="value">
                                {data.performance.map((_, i) => (
                                    <Cell key={i} fill={STATUS_COLORS[i]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>

                </div>

            </div>

        </OfficerLayout>
    );
};

export default OfficerDashboard;

/* ================= PROGRESS ================= */
const Progress = ({ label, value, total, color }) => {
    const percent = total ? (value / total) * 100 : 0;

    return (
        <div style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span>{label}</span>
                <span>{value}</span>
            </div>

            <div style={styles.barBg}>
                <div style={{
                    width: `${percent}%`,
                    height: 6,
                    background: color,
                    borderRadius: 10
                }} />
            </div>
        </div>
    );
};

/* ================= STYLES ================= */
const styles = {

    grid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 18
    },

    card: {
        background: "white",
        padding: 16,
        borderRadius: 14,
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)"
    },

    cardSmall: {
        background: "white",
        padding: 12,
        borderRadius: 14,
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)"
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5
    },

    link: {
        color: "#4F46E5",
        fontSize: 12,
        fontWeight: "600",
        cursor: "pointer"
    },

    pieBox: {
        position: "relative",
        textAlign: "center"
    },

    centerText: {
        position: "absolute",
        top: "42%",
        left: "50%",
        transform: "translate(-50%, -50%)"
    },

    barBg: {
        width: "100%",
        height: 6,
        background: "#E5E7EB",
        borderRadius: 10,
        marginTop: 3
    }
};