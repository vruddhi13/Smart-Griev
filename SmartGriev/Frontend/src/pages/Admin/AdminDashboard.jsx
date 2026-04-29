import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { adminTheme as theme } from '../../services/AdminServices/AdminTheme';
import { ClipboardList, Users, ShieldAlert, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
    PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
    AreaChart, Area   
} from 'recharts';

const AdminDashboard = () => {

    const [dashboard, setDashboard] = useState(null);
    const [filter, setFilter] = useState('week');
    const COLORS = [theme.colors.brand.primary, '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    const statusData = (dashboard?.statusData || []).map(item => ({
        name: item.status,
        value: item.count
    }));

    const generateFallbackTrend = () => {
        const days = 7;
        const today = new Date();

        return Array.from({ length: days }).map((_, i) => {
            const d = new Date();
            d.setDate(today.getDate() - (days - i - 1));

            return {
                date: d.toLocaleDateString(),
                count: 0
            };
        });
    };

    const rawTrend = dashboard?.trendData || [];

    const filteredTrendData = (rawTrend.length ? rawTrend : generateFallbackTrend())
        .filter(item => {
            const date = new Date(item.date);
            const now = new Date();

            if (filter === 'week') {
                const weekAgo = new Date();
                weekAgo.setDate(now.getDate() - 7);
                return date >= weekAgo;
            }

            if (filter === 'month') {
                return date.getMonth() === now.getMonth() &&
                    date.getFullYear() === now.getFullYear();
            }

            if (filter === 'year') {
                return date.getFullYear() === now.getFullYear();
            }

            return true;
        })
        .map(item => ({
            date: new Date(item.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short'
            }),
            count: item.count
        }));

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await fetch("https://localhost:7224/api/Complaint/admin-dashboard");

                if (!res.ok) {
                    console.error("API error:", res.status);
                    return;
                }

                const data = await res.json();
                console.log("Dashboard Data:", data); // DEBUG

                setDashboard(data);
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };

        fetchDashboard();
    }, []);

    if (!dashboard) {
        return <div style={{ padding: '40px' }}>Loading dashboard...</div>;
    }

    return (
        <AdminLayout pageTitle="Admin Dashboard">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                {/* TOP STATS: SLA & PRIORITY MONITORING */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px' }}>
                    <StatCard title="Total Complaints" value={dashboard?.total || 0} icon={ClipboardList} color={theme.colors.brand.primary} />
                    <StatCard title="SLA Breached" value={dashboard?.slaBreached || 0} icon={ShieldAlert} color={theme.colors.status.error} />
                    <StatCard title="Near Deadline" value={dashboard?.nearDeadline || 0} icon={Clock} color="#F59E0B" /> {/* Amber */}
                    <StatCard title="Resolved Today" value={dashboard?.resolvedToday || 0} icon={CheckCircle2} color={theme.colors.status.success} />
                </div>

                <div style={{
                    display: 'flex',
                    gap: '10px',
                    background: '#F1F5F9',
                    padding: '5px',
                    borderRadius: '10px'
                }}>
                    {['week', 'month', 'year'].map(item => (
                        <button
                            key={item}
                            onClick={() => setFilter(item)}
                            style={{
                                padding: '6px 14px',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '600',
                                background: filter === item ? 'white' : 'transparent',
                                color: filter === item ? '#0f172a' : '#64748b',
                                boxShadow: filter === item ? '0 2px 6px rgba(0,0,0,0.1)' : 'none'
                            }}
                        >
                            {item === 'week' ? 'This Week' :
                                item === 'month' ? 'This Month' : 'This Year'}
                        </button>
                    ))}
                </div>

                {/* CHART SECTION */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>

                    {/* LEFT: STATUS DISTRIBUTION */}
                    <div style={{ background: 'white', padding: '25px', borderRadius: theme.radius.card, boxShadow: theme.shadows.card }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: theme.colors.text.main, marginBottom: '20px' }}>Status Distribution</h3>
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        innerRadius={80}
                                        outerRadius={105}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                        animationBegin={0}
                                        animationDuration={1500}
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <text
                                        x="50%"
                                        y="50%"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        style={{
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            fill: '#0f172a'
                                        }}
                                    >
                                        {dashboard.total}
                                    </text>
                                    <RechartsTooltip
                                        contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* RIGHT: TRENDS WITH AREA FILL */}
                    <div style={{ background: 'white', padding: '25px', borderRadius: theme.radius.card, boxShadow: theme.shadows.card }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: theme.colors.text.main, marginBottom: '20px' }}>Complaint Trends</h3>
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={filteredTrendData}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={theme.colors.brand.primary} stopOpacity={0.1} />
                                            <stop offset="95%" stopColor={theme.colors.brand.primary} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    />
                                    <RechartsTooltip
                                        contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke={theme.colors.brand.primary}
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorCount)"
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* LOWER SECTION: TWO COLUMN GRID */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>

                    {/* RECENT COMPLAINTS FEED */}
                    <div style={{ background: 'white', padding: '30px', borderRadius: theme.radius.card, boxShadow: theme.shadows.card }}>
                        <h3 style={{ fontWeight: 'bold', color: theme.colors.text.main, marginBottom: '20px' }}>Recent Complaints</h3>
                        
                        {dashboard.recent?.length > 0 ? (
                            dashboard.recent.map((c, i) => (
                                <ComplaintRow
                                    key={i}
                                    title={c.title}
                                    dept={c.dept}
                                    status={c.status}
                                    time={new Date(c.time).toLocaleString()}
                                    priority={c.priority}
                                />
                            ))
                        ) : (
                            <p style={{ color: '#94a3b8' }}>No recent complaints</p>
                        )}
                    </div>

                    {/* DEPARTMENT PERFORMANCE TABLE */}
                    <div style={{ background: 'white', padding: '30px', borderRadius: theme.radius.card, boxShadow: theme.shadows.card }}>
                        <h3 style={{ fontWeight: 'bold', color: theme.colors.text.main, marginBottom: '20px' }}>Dept. Performance</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid #F4F7FE' }}>
                                    <th style={{ paddingBottom: '10px', color: theme.colors.text.gray }}>Dept</th>
                                    <th style={{ paddingBottom: '10px', color: theme.colors.text.gray }}>Total</th>
                                    <th style={{ paddingBottom: '10px', color: theme.colors.text.gray, textAlign: 'right' }}>SLA Breach</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboard.departmentStats?.map((d, i) => (
                                    <DeptRow
                                        key={i}
                                        name={d.department}
                                        total={d.total}
                                        breach={d.breach}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
};

// --- HELPER COMPONENTS ---

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div style={{ background: 'white', padding: '25px', borderRadius: theme.radius.card, boxShadow: theme.shadows.card, display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ padding: '15px', borderRadius: '12px', background: `${color}10` }}>
            {Icon && <Icon size={24} color={color} />}
        </div>
        <div>
            <p style={{ color: theme.colors.text.gray, fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</p>
            <h4 style={{ color: theme.colors.text.main, fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{value}</h4>
        </div>
    </div>
);

const ComplaintRow = ({ title, dept, status, time, priority, isLast }) => {
    // Priority Colors
    const priorityConfig = {
        High: { color: '#E53E3E', bg: '#FFF5F5' },
        Medium: { color: '#D69E2E', bg: '#FFFAF0' },
        Low: { color: '#38A169', bg: '#F0FFF4' }
    };

    const pStyle = priorityConfig[priority] || priorityConfig.Medium;

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: '20px 0',
            borderBottom: isLast ? 'none' : '1px solid #F1F5F9'
        }}>
            {/* Left Section: Description & Metadata */}
            <div style={{ flex: 1, paddingRight: '20px' }}>
                <div style={{
                    color: '#334155',
                    fontWeight: '500',
                    fontSize: '15px',
                    lineHeight: '1.5',
                    marginBottom: '8px',
                    textAlign: 'left' // Explicit left alignment
                }}>
                    {title}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '12px', display: 'flex', gap: '10px' }}>
                    <span style={{ fontWeight: '600', color: theme.colors.brand.primary }}>{dept}</span>
                    <span>•</span>
                    <span>{time}</span>
                </div>
            </div>

            {/* Right Section: Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', paddingTop: '4px' }}>
                {/* Priority Badge */}
                <span style={{
                    width: '70px',
                    textAlign: 'center',
                    fontSize: '10px',
                    fontWeight: '800',
                    color: pStyle.color,
                    background: pStyle.bg,
                    padding: '4px 0',
                    borderRadius: '6px',
                    border: `1px solid ${pStyle.color}20`,
                    textTransform: 'uppercase'
                }}>
                    {priority}
                </span>

                {/* Status Badge */}
                <span style={{
                    width: '85px',
                    textAlign: 'center',
                    fontSize: '12px',
                    color: status.toLowerCase() === 'submitted' ? '#64748b' : theme.colors.status.success,
                    fontWeight: '600'
                }}>
                    {status}
                </span>
            </div>
        </div>
    );
};

const DeptRow = ({ name, total, breach }) => (
    <tr style={{ borderBottom: '1px solid #F4F7FE' }}>
        <td style={{ padding: '12px 0', fontWeight: '500', color: theme.colors.text.main, textAlign: 'left' }}>{name}</td>
        <td style={{ padding: '12px 0', color: theme.colors.text.gray, textAlign:'center' }}>{total}</td>
        <td style={{ padding: '12px 0', color: parseInt(breach) > 0 ? theme.colors.status.error : theme.colors.text.gray, textAlign: 'right', fontWeight: 'bold' }}>{breach}</td>
    </tr>
);

const ChartPlaceholder = ({ title }) => (
    <div style={{
        border: '2px dashed #EDF2F7',
        borderRadius: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#CBD5E0'
    }}>
        {title} (Chart coming soon)
    </div>
);

export default AdminDashboard;