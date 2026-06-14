import React, { useState, useEffect, useCallback } from 'react';
import DeptHeadLayout from '../../layout/DeptHeadLayout';
import { deptHeadTheme as theme } from '../../services/DeptHeadServices/DeptHeadTheme';
import { ClipboardList, Clock, CheckCircle2, AlertTriangle, ShieldCheck, Users } from 'lucide-react';
import {
    getMyDepartment,
    getDashboardStats,
    getOfficerPerformance,
    getSlaHealth
} from '../../services/DeptHeadServices/DeptHeadService';

// Sub-component defined outside to avoid re-creation on every parent re-render frame
const StatCard = ({ title, value, icon, color }) => (
    <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: theme.radius?.card || '12px',
        boxShadow: theme.shadows?.card || '0 4px 6px -1px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        flex: 1
    }}>
        <div style={{ padding: '12px', borderRadius: '12px', background: `${color}15` }}>
            {icon}
        </div>
        <div>
            <p style={{ color: theme.colors.text.gray, fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0, letterSpacing: '0.5px' }}>
                {title}
            </p>
            <h4 style={{ color: theme.colors.text.main, fontSize: '22px', fontWeight: 'bold', margin: '2px 0 0 0' }}>
                {value}
            </h4>
        </div>
    </div>
);

const DeptHeadDashboard = () => {
    const [stats, setStats] = useState(null);
    const [officers, setOfficers] = useState([]);
    const [slaHealth, setSlaHealth] = useState(null);
    const [loading, setLoading] = useState(true);
    const [departmentName, setDepartmentName] = useState("Department");
    const [isUnauthorized, setIsUnauthorized] = useState(false);

    // Track hovered row IDs for a interactive table UX without adding an external CSS file
    const [hoveredRowId, setHoveredRowId] = useState(null);

    const fetchDeptData = useCallback(async () => {
        setLoading(true);
        setIsUnauthorized(false);

        try {
            // Executes all queries asynchronously across a single thread frame 
            const [department, dashboardStats, performanceData, slaData] = await Promise.all([
                getMyDepartment(),
                getDashboardStats(),
                getOfficerPerformance(),
                getSlaHealth()
            ]);

            setDepartmentName(department?.departmentName || "Department");
            setStats(dashboardStats);
            setOfficers(performanceData || []);
            setSlaHealth(slaData);

        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
            if (error.response?.status === 401) {
                setIsUnauthorized(true);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDeptData();
    }, [fetchDeptData]);

    const getPerformanceStyles = (perf) => {
        switch (perf) {
            case "Good":
                return { bg: `${theme.colors.status.success}15`, text: theme.colors.status.success };
            case "Average":
                return { bg: `${theme.colors.status.warning}15`, text: theme.colors.status.warning };
            case "Poor":
            default:
                return { bg: `${theme.colors.status.error}15`, text: theme.colors.status.error };
        }
    };

    if (loading) {
        return (
            <DeptHeadLayout pageTitle="Department Overview">
                <div style={{ padding: '40px', color: theme.colors.text.gray, textAlign: 'center' }}>
                    Loading Department Data...
                </div>
            </DeptHeadLayout>
        );
    }

    if (isUnauthorized) {
        return (
            <DeptHeadLayout pageTitle="Session Expired">
                <div style={{ padding: '40px', textAlign: 'center', color: theme.colors.status.error }}>
                    <AlertTriangle size={48} style={{ marginBottom: '15px' }} />
                    <h3 style={{ margin: '0 0 10px 0' }}>Unauthorized Access (401)</h3>
                    <p style={{ color: theme.colors.text.gray, margin: 0 }}>
                        Your token is invalid or has expired. Please clear your session storage and sign back in.
                    </p>
                </div>
            </DeptHeadLayout>
        );
    }

    return (
        <DeptHeadLayout pageTitle={`${departmentName} Dashboard`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', fontFamily: 'sans-serif' }}>

                {/* HEADER */}
                <h2 style={{ color: theme.colors.brand.primary, margin: 0, fontWeight: '700' }}>
                    {departmentName} Overview
                </h2>

                {/* STAT CARDS */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '20px'
                }}>
                    <StatCard
                        title="Dept. Complaints"
                        value={stats?.total || 0}
                        icon={<ClipboardList size={22} color={theme.colors.brand.primary} />}
                        color={theme.colors.brand.primary}
                    />
                    <StatCard
                        title="Active Pending"
                        value={stats?.pending || 0}
                        icon={<Clock size={22} color={theme.colors.status.warning} />}
                        color={theme.colors.status.warning}
                    />
                    <StatCard
                        title="Completed"
                        value={stats?.resolved || 0}
                        icon={<CheckCircle2 size={22} color={theme.colors.status.success} />}
                        color={theme.colors.status.success}
                    />
                    <StatCard
                        title="SLA Violations"
                        value={stats?.overdue || 0}
                        icon={<AlertTriangle size={22} color={theme.colors.status.error} />}
                        color={theme.colors.status.error}
                    />
                </div>

                {/* MIDDLE SECTION: SLA HEALTH METRIC AND ANALYTICS */}
                {slaHealth && (
                    <div style={{
                        background: 'white',
                        padding: '25px',
                        borderRadius: theme.radius?.card || '12px',
                        boxShadow: theme.shadows?.card || '0 4px 6px -1px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '20px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ padding: '15px', borderRadius: '12px', background: `${theme.colors.brand.primary}10` }}>
                                <ShieldCheck size={32} color={theme.colors.brand.primary} />
                            </div>
                            <div>
                                <h3 style={{ margin: '0 0 5px 0', color: theme.colors.text.main, fontSize: '18px' }}>
                                    Department SLA Health
                                </h3>
                                <p style={{ margin: 0, color: theme.colors.text.gray, fontSize: '14px' }}>
                                    Resolved <strong>{slaHealth.withinSla}</strong> out of <strong>{slaHealth.totalResolved}</strong> tickets on time.
                                </p>
                            </div>
                        </div>

                        {/* Radial Indicator Box */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '12px', color: theme.colors.text.gray, display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>
                                    Compliance Rate
                                </span>
                                <span style={{ fontSize: '28px', fontWeight: 'bold', color: slaHealth.compliance >= 80 ? theme.colors.status.success : theme.colors.status.warning }}>
                                    {slaHealth.compliance}%
                                </span>
                            </div>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: `conic-gradient(${theme.colors.status.success} ${slaHealth.compliance}%, #f3f4f6 0)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: 'inset 0 0 0 8px white'
                            }} />
                        </div>
                    </div>
                )}

                {/* BOTTOM SECTION: OFFICER PERFORMANCE TABLE */}
                <div style={{
                    background: 'white',
                    padding: '25px',
                    borderRadius: theme.radius?.card || '12px',
                    boxShadow: theme.shadows?.card || '0 4px 6px -1px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <Users size={20} color={theme.colors.text.main} />
                        <h3 style={{ fontWeight: 'bold', color: theme.colors.text.main, margin: 0, fontSize: '18px' }}>
                            Officer Performance Leaderboard
                        </h3>
                    </div>

                    {officers.length === 0 ? (
                        <div style={{ color: theme.colors.text.gray, textAlign: 'center', padding: '40px 0' }}>
                            <p>No officers registered under this department yet.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: `2px solid #f3f4f6` }}>
                                        <th style={{ padding: '12px 8px', color: theme.colors.text.gray, fontWeight: '600', fontSize: '14px' }}>Officer</th>
                                        <th style={{ padding: '12px 8px', color: theme.colors.text.gray, fontWeight: '600', fontSize: '14px', textAlign: 'center' }}>Assigned</th>
                                        <th style={{ padding: '12px 8px', color: theme.colors.text.gray, fontWeight: '600', fontSize: '14px', textAlign: 'center' }}>Resolved</th>
                                        <th style={{ padding: '12px 8px', color: theme.colors.text.gray, fontWeight: '600', fontSize: '14px', textAlign: 'center' }}>Pending</th>
                                        <th style={{ padding: '12px 8px', color: theme.colors.text.gray, fontWeight: '600', fontSize: '14px', textAlign: 'center' }}>Overdue</th>
                                        <th style={{ padding: '12px 8px', color: theme.colors.text.gray, fontWeight: '600', fontSize: '14px', textAlign: 'right' }}>Standing</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {officers.map((officer) => {
                                        const badgeStyles = getPerformanceStyles(officer.performance);
                                        const isHovered = hoveredRowId === officer.officerId;

                                        return (
                                            <tr
                                                key={officer.officerId}
                                                onMouseEnter={() => setHoveredRowId(officer.officerId)}
                                                onMouseLeave={() => setHoveredRowId(null)}
                                                style={{
                                                    borderBottom: `1px solid #f3f4f6`,
                                                    backgroundColor: isHovered ? '#f9fafb' : 'transparent',
                                                    transition: 'background-color 0.15s ease'
                                                }}
                                            >
                                                <td style={{ padding: '14px 8px', fontWeight: '500', color: theme.colors.text.main }}>
                                                    {officer.officerName}
                                                </td>
                                                <td style={{ padding: '14px 8px', textAlign: 'center', color: theme.colors.text.main }}>
                                                    {officer.assigned}
                                                </td>
                                                <td style={{ padding: '14px 8px', textAlign: 'center', color: theme.colors.status.success, fontWeight: '500' }}>
                                                    {officer.resolved}
                                                </td>
                                                <td style={{ padding: '14px 8px', textAlign: 'center', color: theme.colors.status.warning }}>
                                                    {officer.pending}
                                                </td>
                                                <td style={{ padding: '14px 8px', textAlign: 'center', color: officer.overdue > 0 ? theme.colors.status.error : theme.colors.text.gray, fontWeight: officer.overdue > 0 ? '600' : 'normal' }}>
                                                    {officer.overdue}
                                                </td>
                                                <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                                                    <span style={{
                                                        padding: '4px 10px',
                                                        borderRadius: '20px',
                                                        fontSize: '12px',
                                                        fontWeight: '600',
                                                        backgroundColor: badgeStyles.bg,
                                                        color: badgeStyles.text
                                                    }}>
                                                        {officer.performance}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </DeptHeadLayout>
    );
};

export default DeptHeadDashboard;