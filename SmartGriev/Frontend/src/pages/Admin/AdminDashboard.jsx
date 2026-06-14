import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { adminTheme as theme } from '../../services/AdminServices/AdminTheme';
import { ClipboardList, ShieldAlert, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import {
    PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
    AreaChart, Area, CartesianGrid, XAxis, YAxis, Legend
} from 'recharts';

// Strict explicit keys mapping directly to the C# Backend JSON properties
const STATUS_KEYS = [
    { key: 'submitted', label: 'Submitted', color: '#F59E0B' },
    { key: 'inProgress', label: 'In Progress', color: theme.colors.brand.primary },
    { key: 'resolved', label: 'Resolved', color: '#10B981' },
    { key: 'rejected', label: 'Rejected', color: '#EF4444' }
];

const AdminDashboard = () => {
    const [dashboard, setDashboard] = useState(null);
    const [filter, setFilter] = useState('year');
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔹 1. PARSE DONUT CHART DATA FROM THE TIME-FILTERED PAYLOAD
    const { statusData, totalStatusCount } = React.useMemo(() => {
        if (!dashboard || !dashboard.statusDistribution) {
            return { statusData: [], totalStatusCount: 0 };
        }

        const source = dashboard.statusDistribution;
        let totalSum = 0;

        const formattedData = STATUS_KEYS.map(statusItem => {
            const value = source[statusItem.key] || 0;
            totalSum += value;
            return {
                name: statusItem.label,
                value: value,
                color: statusItem.color
            };
        });

        return {
            statusData: formattedData,
            totalStatusCount: totalSum
        };
    }, [dashboard]);

    const processedTrendData = React.useMemo(() => {
        if (!dashboard || !dashboard.trendData || dashboard.trendData.length === 0) {
            return [];
        }

        return dashboard.trendData.map(item => {
            const dateObj = new Date(item.date);
            const labelConfig = filter === 'year'
                ? { month: 'short' }
                : { day: 'numeric', month: 'short' };

            return {
                date: isNaN(dateObj.getTime()) ? item.date : dateObj.toLocaleDateString('en-IN', labelConfig),
                count: item.count || 0
            };
        });
    }, [dashboard, filter]);

    // 🔹 3. DASHBOARD RE-FETCH SCRIPT TRIGGERED ON FILTER UPDATE
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                const token = sessionStorage.getItem('token');
                if (!token) {
                    setErrorMessage("Authentication token missing. Please log in again.");
                    return;
                }

                const res = await fetch(`https://localhost:7224/api/Complaint/admin-dashboard?timeFrame=${filter}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!res.ok) {
                    if (res.status === 401) {
                        setErrorMessage("Unauthorized Access (401). Your session may have expired.");
                    } else {
                        setErrorMessage(`Server responded with error code: ${res.status}`);
                    }
                    return;
                }

                const data = await res.json();
                setDashboard(data);
                setErrorMessage(null);
            } catch (err) {
                console.error("Fetch error:", err);
                setErrorMessage("Failed to establish server handshake connection.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [filter]);

    if (errorMessage) {
        return (
            <AdminLayout pageTitle="Dashboard Error">
                <div style={{
                    padding: '40px', textAlign: 'center', background: 'white',
                    borderRadius: theme.radius.card, boxShadow: theme.shadows.card,
                    margin: '30px auto', maxWidth: '500px'
                }}>
                    <AlertCircle size={48} color="#EF4444" style={{ marginBottom: '16px' }} />
                    <h3 style={{ marginBottom: '10px', color: '#0f172a' }}>Unable to load Dashboard</h3>
                    <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>{errorMessage}</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '10px 20px', background: theme.colors.brand.primary,
                            color: 'white', border: 'none', borderRadius: '6px',
                            cursor: 'pointer', fontWeight: '600'
                        }}
                    >
                        Retry Connection
                    </button>
                </div>
            </AdminLayout>
        );
    }

    if (loading || !dashboard) {
        return (
            <AdminLayout pageTitle="Loading">
                <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    Loading system administration matrices...
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout pageTitle="Admin Dashboard">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                {/* KPI TOP RENDER METRICS (STAY STATIC AND PROTECTED FROM FILTER LOGIC) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                    <StatCard
                        title="Total Complaints"
                        value={dashboard.total ?? 0}
                        icon={ClipboardList}
                        color={theme.colors.brand.primary}
                    />

                    <StatCard
                        title="SLA Breached"
                        value={dashboard.slaBreached ?? 0}
                        icon={ShieldAlert}
                        color={theme.colors.status.error}
                    />

                    <StatCard
                        title="Near Deadline"
                        value={dashboard.nearDeadline ?? 0}
                        icon={Clock}
                        color="#F59E0B"
                    />

                    <StatCard
                        title="Total Resolved Today"
                        value={dashboard.resolvedToday ?? 0}
                        icon={CheckCircle2}
                        color={theme.colors.status.success}
                    />
                </div>

                {/* FILTER CONTROLLERS */}
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '5px', background: '#F1F5F9', padding: '5px', borderRadius: '10px' }}>
                        {['week', 'month', 'year'].map(item => (
                            <button
                                key={item}
                                onClick={() => setFilter(item)}
                                style={{
                                    padding: '6px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                    fontSize: '13px', fontWeight: '600',
                                    background: filter === item ? 'white' : 'transparent',
                                    color: filter === item ? '#0f172a' : '#64748b',
                                    boxShadow: filter === item ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {item === 'week' ? 'This Week' : item === 'month' ? 'This Month' : 'This Year'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* MAIN ANALYTICS CHARTS (DYNAMICALLY ADAPT TO FILTERS) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '25px' }}>

                    {/* STATUS DONUT DISTRIBUTION */}
                    <div style={{ background: 'white', padding: '25px', borderRadius: theme.radius.card, boxShadow: theme.shadows.card }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: theme.colors.text.main, marginBottom: '20px', textAlign: 'left' }}>Status Distribution</h3>
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        innerRadius={75}
                                        outerRadius={100}
                                        paddingAngle={6}
                                        dataKey="value"
                                        stroke="none"
                                        animateNewValues={true}
                                        animationDuration={500}
                                        animationEasing="ease-out"
                                    >
                                        {statusData.map((entry) => (
                                            <Cell key={`cell-${entry.name}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '22px', fontWeight: 'bold', fill: '#0f172a' }}>
                                        {totalStatusCount}
                                    </text>
                                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '15px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* INTERACTIVE TREND COMPLAINTS AREA */}
                    <div style={{ background: 'white', padding: '25px', borderRadius: theme.radius.card, boxShadow: theme.shadows.card }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: theme.colors.text.main, marginBottom: '20px', textAlign: 'left' }}>Complaint Trends</h3>
                        <div style={{ height: '300px', width: '100%' }}>
                            {processedTrendData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={processedTrendData} margin={{ left: -20, right: 10 }}>
                                        <defs>
                                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={theme.colors.brand.primary} stopOpacity={0.2} />
                                                <stop offset="95%" stopColor={theme.colors.brand.primary} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                                            allowDecimals={false}
                                        />
                                        <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                        <Area
                                            type="monotone"
                                            dataKey="count"
                                            stroke={theme.colors.brand.primary}
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorCount)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', fontSize: '14px' }}>
                                    No data entries logged for this selection frame.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* BOTTOM METRIC TABLES (DYNAMICALLY ADAPT TO FILTERS) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '25px' }}>

                    {/* RECENT COMPLAINTS LOGGER */}
                    <div style={{ background: 'white', padding: '25px', borderRadius: theme.radius.card, boxShadow: theme.shadows.card }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: theme.colors.text.main, marginBottom: '15px', textAlign: 'left' }}>Recent Complaints</h3>
                        {dashboard.recent && dashboard.recent.length > 0 ? (
                            dashboard.recent.map((c, i) => (
                                <ComplaintRow
                                    key={c.complaintId || i}
                                    title={c.title}
                                    dept={c.dept}
                                    status={c.status}
                                    time={c.time}
                                    priority={c.priority}
                                    isLast={i === dashboard.recent.length - 1}
                                />
                            ))
                        ) : (
                            <p style={{ color: '#94a3b8', padding: '20px 0', fontSize: '14px' }}>No active recent complaints mapped.</p>
                        )}
                    </div>

                    {/* DEPARTMENT PERFORMANCE */}
                    <div style={{ background: 'white', padding: '25px', borderRadius: theme.radius.card, boxShadow: theme.shadows.card }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: theme.colors.text.main, marginBottom: '20px', textAlign: 'left' }}>Department Performance</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #F1F5F9' }}>
                                        <th style={{ paddingBottom: '12px', color: '#64748b', fontWeight: '600' }}>Department</th>
                                        <th style={{ paddingBottom: '12px', color: '#64748b', fontWeight: '600', textAlign: 'center' }}>Total Cases</th>
                                        <th style={{ paddingBottom: '12px', color: '#64748b', fontWeight: '600', textAlign: 'right' }}>SLA Breaches</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dashboard.departmentStats && dashboard.departmentStats.length > 0 ? (
                                        dashboard.departmentStats.map((d, i) => (
                                            <DeptRow key={i} name={d.department} total={d.total} breach={d.breach} />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" style={{ padding: '20px 0', color: '#94a3b8', textAlign: 'center' }}>No functional logs found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div style={{ background: 'white', padding: '22px', borderRadius: theme.radius.card, boxShadow: theme.shadows.card, display: 'flex', alignItems: 'center', gap: '18px' }}>
        <div style={{ padding: '12px', borderRadius: '10px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {Icon && <Icon size={22} color={color} />}
        </div>
        <div style={{ textAlign: 'left' }}>
            <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px 0' }}>{title}</p>
            <h4 style={{ color: '#0f172a', fontSize: '24px', fontWeight: '700', margin: 0 }}>{value}</h4>
        </div>
    </div>
);

const ComplaintRow = ({ title, dept, status, time, priority, isLast }) => {
    const priorityConfig = {
        High: { color: '#EF4444', bg: '#FEF2F2' },
        Medium: { color: '#F59E0B', bg: '#FFFBEB' },
        Low: { color: '#10B981', bg: '#ECFDF5' }
    };
    const pStyle = priorityConfig[priority] || priorityConfig.Medium;
    const formattedTime = time ? new Date(time).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';

    const getStatusColor = (st) => {
        const norm = st?.toLowerCase();
        if (norm === 'submitted') return '#F59E0B';
        if (norm === 'rejected') return '#EF4444';
        if (norm === 'resolved') return '#10B981';
        return theme.colors.brand.primary;
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: isLast ? 'none' : '1px solid #F1F5F9' }}>
            <div style={{ flex: 1, paddingRight: '15px', textAlign: 'left' }}>
                <div style={{ color: '#334155', fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{title}</div>
                <div style={{ color: '#94a3b8', fontSize: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontWeight: '700', color: theme.colors.brand.primary }}>{dept}</span>
                    <span>•</span>
                    <span>{formattedTime}</span>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '10px', fontWeight: '800', color: pStyle.color, background: pStyle.bg, padding: '3px 8px', borderRadius: '5px', textTransform: 'uppercase' }}>
                    {priority}
                </span>
                <span style={{ fontSize: '13px', color: getStatusColor(status), fontWeight: '600', minWidth: '75px', textAlign: 'right' }}>
                    {status}
                </span>
            </div>
        </div>
    );
};

const DeptRow = ({ name, total, breach }) => (
    <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
        <td style={{ padding: '12px 0', fontWeight: '500', color: '#334155', textAlign: 'left' }}>{name}</td>
        <td style={{ padding: '12px 0', color: '#64748b', textAlign: 'center' }}>{total}</td>
        <td style={{ padding: '12px 0', color: parseInt(breach) > 0 ? '#EF4444' : '#64748b', textAlign: 'right', fontWeight: '700' }}>{breach}</td>
    </tr>
);

export default AdminDashboard;