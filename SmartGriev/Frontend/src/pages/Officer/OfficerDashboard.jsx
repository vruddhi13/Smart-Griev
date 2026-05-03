import React, { useEffect, useState } from "react";
import OfficerLayout from "../../layout/OfficerLayout";
import { getMyComplaints } from "../../services/OfficerServices/OfficerService";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const OfficerDashboard = () => {
    const [stats, setStats] = useState({
        total: 0,
        assigned: 0,
        progress: 0,
        resolved: 0
    });

    const [complaints, setComplaints] = useState([]);

    // ✅ SAFE DATA LOAD (NO WARNING)
    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            try {
                const res = await getMyComplaints();

                if (!isMounted) return;

                setComplaints(res);

                setStats({
                    total: res.length,
                    assigned: res.filter(x => x.status === "Assigned").length,
                    progress: res.filter(x => x.status === "In Progress").length,
                    resolved: res.filter(x => x.status === "Resolved").length
                });
            } catch (err) {
                console.error(err);
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, []);

    // ✅ CHART DATA
    const chartData = [
        { name: "Assigned", value: stats.assigned, color: "#6366f1" },
        { name: "In Progress", value: stats.progress, color: "#f59e0b" },
        { name: "Resolved", value: stats.resolved, color: "#10b981" }
    ];

    return (
        <OfficerLayout>
            {/* HEADER */}
            <div style={{ marginBottom: "25px" }}>
                <h2 style={{ fontSize: "26px", fontWeight: "700", color: "#1e293b" }}>
                    Dashboard
                </h2>
                <p style={{ color: "#64748b" }}>
                    Welcome back. Here’s your complaint overview.
                </p>
            </div>

            {/* STAT CARDS */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: "20px"
            }}>
                {[
                    { title: "Total Complaints", value: stats.total },
                    { title: "Assigned", value: stats.assigned },
                    { title: "In Progress", value: stats.progress },
                    { title: "Resolved", value: stats.resolved }
                ].map((card, i) => (
                    <div key={i} style={{
                        background: "white",
                        padding: "20px",
                        borderRadius: "14px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
                    }}>
                        <p style={{ color: "#64748b", fontSize: "14px" }}>
                            {card.title}
                        </p>
                        <h2 style={{ fontSize: "26px", marginTop: "5px", color: "#1e293b" }}>
                            {card.value}
                        </h2>
                    </div>
                ))}
            </div>

            {/* CHART + RECENT */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: "20px",
                marginTop: "30px"
            }}>
                {/* CHART */}
                <div style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "14px",
                    border: "1px solid #e2e8f0"
                }}>
                    <h3 style={{ marginBottom: "10px" }}>
                        Status Distribution
                    </h3>

                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* RECENT */}
                <div style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "14px",
                    border: "1px solid #e2e8f0"
                }}>
                    <h3>Recent Complaints</h3>

                    {complaints.length === 0 ? (
                        <p style={{ color: "#64748b" }}>No complaints</p>
                    ) : (
                        complaints.slice(0, 5).map(c => (
                            <div key={c.complaint_id} style={{
                                padding: "10px 0",
                                borderBottom: "1px solid #f1f5f9"
                            }}>
                                <div style={{ fontWeight: "600" }}>
                                    {c.complaint_number}
                                </div>
                                <div style={{
                                    fontSize: "13px",
                                    color: "#64748b"
                                }}>
                                    {c.status}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </OfficerLayout>
    );
};

export default OfficerDashboard;