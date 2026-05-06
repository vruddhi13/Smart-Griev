import React, { useEffect, useState } from "react";
import OfficerLayout from "../../layout/OfficerLayout";
import { getMyComplaints } from "../../services/OfficerServices/OfficerService";

const StatusPieReport = () => {

    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        const load = async () => {
            const res = await getMyComplaints();
            setData(res || []);
        };
        load();
    }, []);

    // ================= FILTER =================
    const filteredData = data.filter(item => {

        const searchText = (search || "").toLowerCase().trim();

        const complaintNo = (item.complaint_number ?? "").toString().toLowerCase();
        const description = (item.description ?? "").toString().toLowerCase();
        const status = (item.status ?? "").toString().toLowerCase();
        const priority = (item.priority_level ?? "").toString().toLowerCase();

        // ================= SAFE DATE PARSING =================
        const rawDate = item.created_at ? new Date(item.created_at) : null;

        let formattedDate = "";
        let altDate = "";

        if (rawDate && !isNaN(rawDate)) {
            const dd = String(rawDate.getDate()).padStart(2, "0");
            const mm = String(rawDate.getMonth() + 1).padStart(2, "0");
            const yyyy = rawDate.getFullYear();

            formattedDate = `${dd}/${mm}/${yyyy}`;   // 11/04/2026
            altDate = `${mm}/${dd}/${yyyy}`;         // 04/11/2026 (US format)
        }

        // ================= SEARCH MATCH =================
        const matchSearch =
            complaintNo.includes(searchText) ||
            description.includes(searchText) ||
            status.includes(searchText) ||
            priority.includes(searchText) ||
            formattedDate.includes(searchText) ||
            altDate.includes(searchText) ||
            String(rawDate?.getFullYear() || "").includes(searchText);

        // ================= STATUS FILTER =================
        const matchFilter =
            filter === "All" ||
            status === filter.toLowerCase();

        return matchSearch && matchFilter;
    });

    // ================= STATUS COLOR =================
    const getColor = (status) => {
        switch (status) {
            case "Assigned": return "#4F46E5";
            case "In Progress": return "#F59E0B";
            case "Resolved": return "#10B981";
            case "Rejected": return "#EF4444";
            default: return "#6B7280";
        }
    };

    return (
        <OfficerLayout pageTitle="Complaint Report">

            {/* ================= HEADER ================= */}
            <div style={styles.header}>
                <h2 style={{ margin: 0 }}>Complaint Report</h2>
                <p style={styles.subText}>
                    Advanced filtering & real-time complaint tracking
                </p>
            </div>

            {/* ================= KPI ================= */}
            <div style={styles.kpiGrid}>
                <KPI title="Total" value={data.length} color="#6366F1" />
                <KPI title="Assigned" value={data.filter(x => x.status === "Assigned").length} color="#4F46E5" />
                <KPI title="In Progress" value={data.filter(x => x.status === "In Progress").length} color="#F59E0B" />
                <KPI title="Resolved" value={data.filter(x => x.status === "Resolved").length} color="#10B981" />
                <KPI title="Rejected" value={data.filter(x => x.status === "Rejected").length} color="#EF4444" />
            </div>

            {/* ================= SEARCH BAR ================= */}
            <div style={styles.searchBox}>

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by Complaint No, Status, Priority..."
                    style={styles.input}
                />

                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={styles.select}
                >
                    <option value="All">All Status</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                </select>

            </div>

            {/* ================= CARDS ================= */}
            <div style={styles.grid}>

                {filteredData.map((c, i) => (
                    <div key={i} style={styles.card}>

                        <div style={styles.cardTop}>
                            <b style={styles.complaintNo}>
                                {c.complaint_number}
                            </b>

                            <span style={{
                                ...styles.status,
                                background: getColor(c.status) + "20",
                                color: getColor(c.status)
                            }}>
                                {c.status}
                            </span>
                        </div>

                        <p style={styles.desc}>
                            {c.description?.slice(0, 100)}...
                        </p>

                        <div style={styles.footer}>
                            <span>📅 {new Date(c.created_at).toLocaleDateString()}</span>
                            <span>⚡ {c.priority_level}</span>
                        </div>

                    </div>
                ))}

            </div>

        </OfficerLayout>
    );
};

export default StatusPieReport;

/* ================= KPI ================= */
const KPI = ({ title, value, color }) => (
    <div style={{
        background: "white",
        padding: 18,
        borderRadius: 14,
        borderLeft: `5px solid ${color}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
    }}>
        <div style={{ fontSize: 12, color: "#6B7280" }}>{title}</div>
        <div style={{ fontSize: 22, fontWeight: "bold" }}>{value}</div>
    </div>
);

/* ================= STYLES ================= */
const styles = {

    header: {
        background: "white",
        padding: 20,
        borderRadius: 14,
        marginBottom: 15,
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)"
    },

    subText: {
        margin: 0,
        fontSize: 13,
        color: "#6B7280"
    },

    kpiGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 12,
        marginBottom: 15
    },

    searchBox: {
        display: "flex",
        gap: 10,
        marginBottom: 20,
        background: "white",
        padding: 12,
        borderRadius: 12,
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
    },

    input: {
        flex: 1,
        padding: "12px 14px",
        borderRadius: 10,
        border: "1px solid #E5E7EB",
        outline: "none",
        fontSize: 14
    },

    select: {
        padding: "12px 14px",
        borderRadius: 10,
        border: "1px solid #E5E7EB",
        outline: "none",
        fontSize: 14,
        background: "white"
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 15
    },

    card: {
        background: "white",
        padding: 15,
        borderRadius: 14,
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)"
    },

    cardTop: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 10
    },

    complaintNo: {
        color: "#111827"
    },

    status: {
        fontSize: 12,
        padding: "4px 10px",
        borderRadius: 20,
        fontWeight: "600"
    },

    desc: {
        fontSize: 13,
        color: "#6B7280",
        marginBottom: 10
    },

    footer: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: 12,
        color: "#6B7280"
    }
};