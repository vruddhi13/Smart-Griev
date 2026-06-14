import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { adminTheme as theme } from "../../services/AdminServices/AdminTheme";
import {
    ClipboardList,
    UserCircle,
    ArrowRight,
    CalendarDays,
    ShieldAlert,
    Clock,
    CheckCircle2
} from "lucide-react";

import { getComplaintStatusLogs } from "../../services/accountservice";
import { showError } from "../../services/alertService";
import usePagination from "../../services/usePagination";
import Pagination from "../../Components/AdminComponents/Pagination";

const StatCard = (props) => {
    const Component = props.Icon; // Safely reassign to a Capitalized Component
    return (
        <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: theme.radius.card,
            boxShadow: theme.shadows.card,
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
        }}>
            <div style={{ background: `${props.color}15`, padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Component size={24} color={props.color} />
            </div>
            <div>
                <p style={{ color: theme.colors.text.gray, fontSize: '14px', margin: 0, fontWeight: '500' }}>{props.title}</p>
                <h3 style={{ color: '#2B3674', fontSize: '24px', margin: '5px 0 0 0', fontWeight: '700' }}>{props.value}</h3>
            </div>
        </div>
    );
};

const AdminComplaintStatusLogList = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock/derived counts for the cards based on current logs data
    // (Replace these with real dashboard/API pieces if needed)
    const metrics = {
        total: logs.length,
        escalated: logs.filter(l => l.newStatus?.toLowerCase() === 'escalated').length,
        inProgress: logs.filter(l => l.newStatus?.toLowerCase() === 'in progress').length,
        completed: logs.filter(l => l.newStatus?.toLowerCase() === 'completed').length,
    };

    const loadStatusLogs = async () => {
        try {
            setLoading(true);
            const res = await getComplaintStatusLogs();
            setLogs(res.data || res || []);
        } catch (error) {
            console.error(error);
            showError("Failed to load complaint status logs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadStatusLogs(); }, []);

    const { currentPage, totalPages, currentData, nextPage, prevPage, setCurrentPage } = usePagination(logs, 5);

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true
        });
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case "assigned": return { background: "#E3F2FD", color: "#1976D2" };
            case "in progress": return { background: "#FFF3E0", color: "#F57C00" };
            case "completed": return { background: "#E8F5E9", color: "#2E7D32" };
            case "rejected": return { background: "#FFEBEE", color: "#D32F2F" };
            case "reassigned": return { background: "#F3E5F5", color: "#7B1FA2" };
            case "escalated": return { background: "#FFF8E1", color: "#FF8F00" };
            case "forwarded": return { background: "#E0F7FA", color: "#00838F" };
            default: return { background: "#F4F7FE", color: "#707EAE" };
        }
    };

    return (
        <AdminLayout pageTitle="Complaint Status Logs">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                {/* KPI TOP RENDER METRICS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px' }}>
                    <StatCard title="Total Status Changes" value={metrics.total} Icon={ClipboardList} color={theme.colors.brand.primary} />
                    <StatCard title="Escalations Logged" value={metrics.escalated} Icon={ShieldAlert} color={theme.colors.status.error} />
                    <StatCard title="Currently In Progress" value={metrics.inProgress} Icon={Clock} color="#F59E0B" />
                    <StatCard title="Completed Transitions" value={metrics.completed} Icon={CheckCircle2} color={theme.colors.status.success} />
                </div>

                {/* TABLE CARD CONTAINER */}
                <div style={{ background: "white", borderRadius: theme.radius.card, boxShadow: theme.shadows.card, overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#FAFCFF", borderBottom: "1px solid #F4F7FE" }}>
                                <th style={thStyle}>COMPLAINT</th>
                                <th style={thStyle}>STATUS TRANSITION</th>
                                <th style={thStyle}>CHANGED BY</th>
                                <th style={thStyle}>REMARKS</th>
                                <th style={thStyle}>CHANGE DATE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ padding: "40px", textAlign: "center", color: theme.colors.text.gray }}>Loading status logs...</td></tr>
                            ) : currentData.length === 0 ? (
                                <tr><td colSpan="5" style={{ padding: "40px", textAlign: "center", color: theme.colors.text.gray }}>No status logs found</td></tr>
                            ) : (
                                currentData.map((item) => (
                                    <tr key={item.statusLogId} style={{ borderBottom: "1px solid #F4F7FE" }}>
                                        <td style={tdStyle}>
                                            <div style={{ fontWeight: "700", color: "#2B3674", fontSize: "15px" }}>{item.complaintNumber}</div>
                                            <div style={{ fontSize: "12px", color: "#A3AED0", marginTop: "3px" }}>ID #{item.complaintId}</div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <span style={{ ...getStatusStyle(item.oldStatus), padding: "6px 12px", borderRadius: "10px", fontSize: "12px", fontWeight: "700" }}>
                                                    {item.oldStatus || "INITIAL"}
                                                </span>
                                                <ArrowRight size={16} color="#A3AED0" />
                                                <span style={{ ...getStatusStyle(item.newStatus), padding: "6px 12px", borderRadius: "10px", fontSize: "12px", fontWeight: "700" }}>
                                                    {item.newStatus}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "#F4F7FE", padding: "10px 14px", borderRadius: "14px" }}>
                                                <UserCircle size={22} color="#4318FF" />
                                                <div>
                                                    <div style={{ fontWeight: "700", color: "#2B3674" }}>{item.changedBy?.name}</div>
                                                    <span style={{ fontSize: "11px", background: "#E9E3FF", color: "#4318FF", padding: "3px 10px", borderRadius: "20px", fontWeight: "600" }}>
                                                        {item.changedBy?.role}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ maxWidth: "250px", color: "#707EAE", fontSize: "13px" }}>{item.remarks || "-"}</div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#707EAE", fontWeight: "500" }}>
                                                <CalendarDays size={16} color="#4318FF" />
                                                {formatDate(item.changedAt)}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ONE-LINE PAGINATION CONTAINER */}
                {!loading && logs.length > 0 && (
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Pagination currentPage={currentPage} totalPages={totalPages} nextPage={nextPage} prevPage={prevPage} setCurrentPage={setCurrentPage} />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

const thStyle = { padding: "18px", textAlign: "left", color: "#A3AED0", fontSize: "12px", fontWeight: "700", letterSpacing: "0.5px" };
const tdStyle = { padding: "20px", color: "#2B3674", fontSize: "14px", verticalAlign: "middle" };

export default AdminComplaintStatusLogList;