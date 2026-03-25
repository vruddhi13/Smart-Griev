import React from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { adminTheme as theme } from '../../services/AdminServices/AdminTheme';
import { ClipboardList, Users, ShieldAlert } from 'lucide-react';

const AdminDashboard = () => {
    return (
        <AdminLayout pageTitle="Admin Dashboard">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                {/* TOP STATS BOXES */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px' }}>
                    <StatCard title="Total Complaints" value="2,433" icon={ClipboardList} color={theme.colors.brand.primary} />
                    <StatCard title="Active Officers" value="124" icon={Users} color={theme.colors.status.success} />
                    <StatCard title="SLA Breaches" value="12" icon={ShieldAlert} color={theme.colors.status.error} />
                </div>

                {/* MIDDLE SECTION: PERFORMANCE HEATMAP */}
                <div style={{ background: 'white', padding: '30px', borderRadius: theme.radius.card, boxShadow: theme.shadows.card, height: '400px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontWeight: 'bold', color: theme.colors.text.main }}>City-wide Performance</h3>
                        <select style={{ padding: '8px', borderRadius: '10px', border: '1px solid #eee', color: theme.colors.text.gray }}>
                            <option>This Month</option>
                            <option>Last 6 Months</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#CBD5E0' }}>
                        [Chart Data Visualization Area]
                    </div>
                </div>

                {/* LOWER SECTION: RECENT ACTIVITY */}
                <div style={{ background: 'white', padding: '30px', borderRadius: theme.radius.card, boxShadow: theme.shadows.card }}>
                    <h3 style={{ fontWeight: 'bold', color: theme.colors.text.main, marginBottom: '20px' }}>Admin Activity Logs</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '1px solid #F4F7FE' }}>
                                <span style={{ color: theme.colors.text.main, fontSize: '14px' }}>System Admin updated <b>SLA Rules</b> for Water Dept.</span>
                                <span style={{ color: theme.colors.text.gray, fontSize: '12px' }}>2 mins ago</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

// Sub-component for Stats (kept in file or moved to a 'components' folder)
const StatCard = ({ title, value, icon: Icon, color }) => (
    <div style={{ background: 'white', padding: '25px', borderRadius: theme.radius.card, boxShadow: theme.shadows.card, display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ padding: '15px', borderRadius: '50%', background: '#F4F7FE' }}>
            {Icon && <Icon size={24} color={color} />}
        </div>
        <div>
            <p style={{ color: theme.colors.text.gray, fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>{title}</p>
            <h4 style={{ color: theme.colors.text.main, fontSize: '24px', fontWeight: 'bold' }}>{value}</h4>
        </div>
    </div>
);

export default AdminDashboard;