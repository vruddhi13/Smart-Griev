import React, { useState, useEffect, useCallback } from 'react';
import DeptHeadLayout from '../../layout/DeptHeadLayout';
import { deptHeadTheme as theme } from '../../services/DeptHeadServices/DeptHeadTheme';
import { ClipboardList, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

const DeptHeadDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Using useCallback to define the fetch logic properly
    const fetchDeptData = useCallback(async () => {
        setLoading(true);
        try {
            // In a real scenario, you'd fetch from your API:
            // const res = await fetch(`https://localhost:7224/api/Dept/dashboard`);
            // const result = await res.json();

            // Simulating API delay to prevent "synchronous setState" warning
            await new Promise(resolve => setTimeout(resolve, 500));

            setData({
                total: 45,
                pending: 12,
                resolved: 30,
                overdue: 3
            });
        } catch (error) {
            console.error("Failed to fetch department data", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDeptData();
    }, [fetchDeptData]);

    if (loading) {
        return (
            <DeptHeadLayout pageTitle="Department Overview">
                <div style={{ padding: '40px', color: theme.colors.text.gray }}>
                    Loading Department Data...
                </div>
            </DeptHeadLayout>
        );
    }

    return (
        <DeptHeadLayout pageTitle="Department Overview">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                {/* STAT CARDS */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '25px'
                }}>
                    <StatCard
                        title="Dept. Complaints"
                        value={data?.total}
                        icon={<ClipboardList size={24} color={theme.colors.brand.primary} />}
                        color={theme.colors.brand.primary}
                    />
                    <StatCard
                        title="Active Pending"
                        value={data?.pending}
                        icon={<Clock size={24} color={theme.colors.status.warning} />}
                        color={theme.colors.status.warning}
                    />
                    <StatCard
                        title="Completed"
                        value={data?.resolved}
                        icon={<CheckCircle2 size={24} color={theme.colors.status.success} />}
                        color={theme.colors.status.success}
                    />
                    <StatCard
                        title="SLA Violations"
                        value={data?.overdue}
                        icon={<AlertTriangle size={24} color={theme.colors.status.error} />}
                        color={theme.colors.status.error}
                    />
                </div>

                {/* RECENT ACTIVITY TABLE (Layout matching Admin) */}
                <div style={{
                    background: 'white',
                    padding: '30px',
                    borderRadius: theme.radius.card,
                    boxShadow: theme.shadows.card
                }}>
                    <h3 style={{ fontWeight: 'bold', color: theme.colors.text.main, marginBottom: '20px' }}>
                        Pending Department Actions
                    </h3>
                    <div style={{ color: theme.colors.text.gray, textAlign: 'center', padding: '40px 0' }}>
                        <p>No urgent actions required for your department today.</p>
                    </div>
                </div>
            </div>
        </DeptHeadLayout>
    );
};

// Fixed StatCard to use the passed Icon component correctly
const StatCard = ({ title, value, icon, color }) => (
    <div style={{
        background: 'white',
        padding: '25px',
        borderRadius: theme.radius.card,
        boxShadow: theme.shadows.card,
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
    }}>
        <div style={{
            padding: '15px',
            borderRadius: '12px',
            background: `${color}15`
        }}>
            {icon}
        </div>
        <div>
            <p style={{
                color: theme.colors.text.gray,
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                margin: 0
            }}>
                {title}
            </p>
            <h4 style={{
                color: theme.colors.text.main,
                fontSize: '24px',
                fontWeight: 'bold',
                margin: 0
            }}>
                {value}
            </h4>
        </div>
    </div>
);

export default DeptHeadDashboard;