import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { adminTheme as theme } from '../../services/AdminServices/AdminTheme';
import { Eye, Info, ShieldAlert, X, HelpCircle, BarChart3 } from 'lucide-react';
import { getAuditLogs, getUsers } from '../../services/AdminServices/AdminService';
import usePagination from '../../services/usePagination';
import Pagination from '../../Components/AdminComponents/Pagination';

const AdminAuditLog = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState(null);
    const [usersMap, setUsersMap] = useState({});


    const getRoleName = (roleId) => {
        switch (Number(roleId)) {
            case 1: return "Admin";
            case 2: return "Department Head";
            case 3: return "Officer";
            case 4: return "Citizen";
            default: return "Unknown";
        }
    };

    const getActionStyle = (actionType) => {
        switch (actionType?.toUpperCase()) {
            case 'INSERT':
            case 'CREATE':
                return { bg: '#DCFCE7', text: '#15803D' };
            case 'UPDATE':
            case 'EDIT':
                return { bg: '#FEF3C7', text: '#92400E' };
            case 'DELETE':
            case 'REMOVE':
                return { bg: '#FEE2E2', text: '#B91C1C' };
            case 'LOGIN':
            case 'LOGOUT':
                return { bg: '#E0F2FE', text: '#0369A1' };
            default:
                return { bg: '#E5E7EB', text: '#374151' };
        }
    };

    const fetchAuditLogs = async () => {
        try {
            setLoading(true);
            const data = await getAuditLogs();
            setLogs(Array.isArray(data) ? data : data.data || []);
        }
        catch (error) {
            console.error("Audit Error:", error);
        }
        finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await getUsers();
            const users = res.data || res;
            const map = {};

            if (Array.isArray(users)) {
                users.forEach(user => {
                    // Use snake_case keys if your backend sends raw database models
                    const id = user.user_id || user.userId;
                    const name = user.full_name || user.name;
                    const roleId = user.role_id || user.roleId;

                    if (id) {
                        map[id] = {
                            name: name || "Unknown User",
                            roleId: roleId
                        };
                    }
                });
            }

            console.log("Mapped Users Account Dictionary: ", map);
            setUsersMap(map);
        }
        catch (error) {
            console.error("Users Mapping Discovery Error:", error);
        }
    };

    useEffect(() => {
        fetchAuditLogs();
        fetchUsers();
    }, []);

    const {
        currentPage,
        totalPages,
        currentData,
        nextPage,
        prevPage,
        setCurrentPage
    } = usePagination(logs, 5);

    // Dictionary dictionary maps backend database property schemas to pristine natural English
    const labelMapping = {
        Id: "Record Reference ID",
        SlaId: "SLA Rule ID",
        DepartmentId: "Department ID",
        CategoryId: "Category ID",
        DepartmentName: "Department Name",
        CategoryName: "Category Classification",
        Priority: "Urgency Rank",
        PriorityLevel: "Urgency Rank",
        Hours: "Resolution Deadline Time",
        ResolutionHours: "Resolution Target (Hours)",
        EscalationHours: "Escalation Buffer (Hours)",
        IsActive: "Operational Lifecycle Status",
        Name: "Identified Designation Name"
    };

    // Humanize parsing mechanism that formats JSON datasets into clear text structures
    const parsePayloadToDictionary = (rawString) => {
        if (!rawString) return null;
        try {
            const data = typeof rawString === 'string' ? JSON.parse(rawString) : rawString;
            if (!data || typeof data !== 'object') return null;
            return data;
        } catch {
            return null;
        }
    };

    const calculateDataDiff = (oldRaw, newRaw) => {
        if (!oldRaw || !newRaw) return [];
        try {
            const oldObj = JSON.parse(oldRaw);
            const newObj = JSON.parse(newRaw);
            const numericalDiffs = [];

            Object.keys(newObj).forEach(key => {
                if (Object.prototype.hasOwnProperty.call(oldObj, key)) {
                    const oldVal = Number(oldObj[key]);
                    const newVal = Number(newObj[key]);

                    if (!isNaN(oldVal) && !isNaN(newVal) && oldVal !== newVal) {
                        numericalDiffs.push({
                            property: labelMapping[key] || key,
                            before: oldVal,
                            after: newVal,
                            change: newVal - oldVal
                        });
                    }
                }
            });
            return numericalDiffs;
        } catch {
            return [];
        }
    };

    const numericChanges = selectedLog ? calculateDataDiff(
        selectedLog.oldData || selectedLog.OldData || selectedLog.old_data,
        selectedLog.newData || selectedLog.NewData || selectedLog.new_data
    ) : [];

    // Generates a structural grid table matching production audit systems
    const renderComparisonLedger = () => {
        const oldObj = parsePayloadToDictionary(selectedLog.oldData || selectedLog.OldData || selectedLog.old_data);
        const newObj = parsePayloadToDictionary(selectedLog.newData || selectedLog.NewData || selectedLog.new_data);

        if (!oldObj && !newObj) {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#A3AED0', gap: '8px' }}>
                    <HelpCircle size={24} />
                    <span style={{ fontSize: '14px', fontStyle: 'italic' }}>No profile record modifications captured for this ledger transactional history line item.</span>
                </div>
            );
        }

        // Aggregate unique property headers between snapshots
        const masterKeys = Array.from(new Set([...Object.keys(oldObj || {}), ...Object.keys(newObj || {})]));

        const formatDisplayValue = (val) => {
            if (val === null || val === undefined) return <span style={{ color: '#A3AED0', fontStyle: 'italic' }}>Empty / None</span>;
            if (typeof val === 'boolean') {
                return val ? (
                    <span style={{ color: '#15803D', fontWeight: '700', background: '#DCFCE7', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>Active / Enabled</span>
                ) : (
                    <span style={{ color: '#B91C1C', fontWeight: '700', background: '#FEE2E2', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>Inactive / Disabled</span>
                );
            }
            return String(val);
        };

        return (
            <div style={{ width: '100%', border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden', background: '#FFF' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                            <th style={{ padding: '12px', color: '#475569', fontWeight: '700', width: '30%' }}>Monitored Field Property</th>
                            <th style={{ padding: '12px', color: '#64748B', fontWeight: '600', width: '35%', background: '#FDF2F2' }}>Original Value (Before)</th>
                            <th style={{ padding: '12px', color: '#16A34A', fontWeight: '600', width: '35%', background: '#F0FDF4' }}>Updated Value (After)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {masterKeys.map((key) => {
                            const beforeValue = oldObj ? oldObj[key] : undefined;
                            const afterValue = newObj ? newObj[key] : undefined;
                            const isModified = JSON.stringify(beforeValue) !== JSON.stringify(afterValue);

                            return (
                                <tr key={key} style={{ borderBottom: '1px solid #F1F5F9', background: isModified ? '#FFFBEB' : 'transparent', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '12px', fontWeight: '700', color: '#334155' }}>
                                        {labelMapping[key] || key}
                                    </td>
                                    <td style={{ padding: '12px', color: '#475569', background: isModified ? '#FEF2F2' : 'transparent' }}>
                                        {formatDisplayValue(beforeValue)}
                                    </td>
                                    <td style={{ padding: '12px', color: '#1E293B', fontWeight: isModified ? '600' : '400', background: isModified ? '#F0FDF4' : 'transparent' }}>
                                        {formatDisplayValue(afterValue)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <AdminLayout pageTitle="Audit Logs">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: 'calc(100vw - 350px)', margin: '0 auto' }}>

                {/* HEADER PANEL */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        {/*<h2 style={{ color: theme.colors.text.main, margin: 0, fontSize: '26px', fontWeight: '700' }}>System Audit Trails</h2>*/}
                        <p style={{ color: theme.colors.text.gray, fontSize: '15px' }}>Monitor, track, and historicalize administrative and user alterations</p>
                    </div>
                </div>

                {/* LOG TRACE DATA GRID */}
                <div style={{ background: 'white', borderRadius: theme.radius.card, boxShadow: theme.shadows.card, overflowX: 'auto', width: '100%', border: '1px solid #F4F7FE' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1500px', tableLayout: 'auto' }}>
                        <thead>
                            <tr style={{ background: '#FAFCFF', borderBottom: '1px solid #F4F7FE' }}>
                                <th style={thStyle}>Log ID</th>
                                <th style={thStyle}>Performed By</th>
                                <th style={thStyle}>Action</th>
                                <th style={thStyle}>Target Entity</th>
                                <th style={thStyle}>Entity ID</th>
                                <th style={thStyle}>Description</th>
                                <th style={thStyle}>IP Address</th>
                                <th style={thStyle}>Timestamp</th>
                                <th style={thStyle}>Inspect</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="9" style={loadingStyle}>Loading audit files...</td></tr>
                            ) : currentData.length === 0 ? (
                                <tr><td colSpan="9" style={loadingStyle}>No audit logs found.</td></tr>
                            ) : currentData.map((log) => {
                                const actionStyle = getActionStyle(log.actionType || log.action_type);
                                return (
                                    <tr key={log.auditId || log.audit_id} style={trStyle}>
                                        <td style={{ ...tdStyle, fontWeight: '700', color: theme.colors.brand.primary }}>{log.auditId || log.audit_id}</td>
                                        <td style={{ ...tdStyle, fontWeight: '600' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                {/* Render Name or Fallback User ID */}
                                                <span>
                                                    {usersMap[log.userId || log.user_id]
                                                        ? usersMap[log.userId || log.user_id].name
                                                        : ` #${log.userId || log.user_id}`}
                                                </span>

                                                {/* Render Dynamic Role Tag below the Name */}
                                                {usersMap[log.userId || log.user_id] && (
                                                    <span style={{
                                                        fontSize: '14px',
                                                        color: theme.colors.text.gray || '#707EAE',
                                                        fontWeight: '500',
                                                        marginTop: '2px'
                                                    }}>
                                                        {getRoleName(usersMap[log.userId || log.user_id].roleId)}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-block', background: actionStyle.bg, color: actionStyle.text }}>
                                                {(log.actionType || log.action_type)?.toUpperCase()}
                                            </div>
                                        </td>
                                        <td style={{ ...tdStyle, fontWeight: '500' }}>{log.entityName || log.entity_name}</td>
                                        <td style={tdStyle}>{log.entityId || log.entity_id || 'N/A'}</td>
                                        <td style={{ ...tdStyle, maxWidth: '280px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Info size={14} style={{ color: '#A3AED0', flexShrink: 0 }} />
                                                <span style={ellipsisText} title={log.description}>{log.description || "N/A"}</span>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>{log.ipAddress || log.ip_address || "0.0.0.0"}</td>
                                        <td style={tdStyle}>{(log.createdAt || log.created_at) ? new Date(log.createdAt || log.created_at).toLocaleString('en-GB') : 'N/A'}</td>
                                        <td style={tdStyle}>
                                            <button onClick={() => setSelectedLog(log)} style={{ border: "none", background: "none", cursor: "pointer" }} title="View Comparison View">
                                                <Eye size={20} color={theme.colors.brand.primary} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", paddingBottom: '20px' }}>
                    <Pagination {...{ currentPage, totalPages, nextPage, prevPage, setCurrentPage }} />
                </div>
            </div>

            {/* ================= INSPECT COMPARISON LEDGER MODAL ================= */}
            {selectedLog && (
                <div style={modalOverlay}>
                    <div style={{ ...modalBox, width: '900px' }}>
                        <button onClick={() => setSelectedLog(null)} style={closeBtn}><X size={18} /></button>

                        <div style={{ marginBottom: '25px', borderBottom: '1px solid #E2E8F0', paddingBottom: '15px' }}>
                            <h3 style={{ ...title, color: theme.colors.text.main, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ShieldAlert color="#4318FF" /> Change Profile Inspection Audit Detail [Record #{selectedLog.auditId || selectedLog.audit_id}]
                            </h3>
                            <p style={{ margin: '4px 0', fontSize: '14px', color: '#707EAE' }}>
                                <b>Environment Context:</b> {selectedLog.userAgent || selectedLog.user_agent || 'Unknown Client Engine'}
                            </p>
                        </div>

                        {/* METRIC DIFFERENCES DEVIATION CHART CONTAINER */}
                        {numericChanges.length > 0 && (
                            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #E2E8F0' }}>
                                <span style={{ ...modalSectionTitle, color: '#4318FF', marginBottom: '12px' }}>
                                    <BarChart3 size={16} style={{ marginRight: '6px' }} /> Numeric Metric Deviation Analytics
                                </span>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {numericChanges.map((item, index) => {
                                        const maxVal = Math.max(Math.abs(item.before), Math.abs(item.after), 1);
                                        const beforeWidth = `${Math.min((Math.abs(item.before) / maxVal) * 100, 100)}%`;
                                        const afterWidth = `${Math.min((Math.abs(item.after) / maxVal) * 100, 100)}%`;

                                        return (
                                            <div key={index} style={{ background: '#FFF', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', color: '#2B3674', marginBottom: '6px' }}>
                                                    <span>Impacted Metric Field: <span style={{ color: '#4318FF' }}>{item.property}</span></span>
                                                    <span style={{ color: item.change >= 0 ? '#22C55E' : '#EF4444' }}>
                                                        Delta Offset: {item.change >= 0 ? `+${item.change}` : item.change}
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <span style={{ width: '50px', fontSize: '11px', color: '#707EAE', fontWeight: '600' }}>Before</span>
                                                        <div style={{ flex: 1, background: '#E2E8F0', height: '10px', borderRadius: '4px', overflow: 'hidden' }}>
                                                            <div style={{ width: beforeWidth, background: '#A3AED0', height: '100%' }}></div>
                                                        </div>
                                                        <span style={{ width: '40px', fontSize: '12px', textAlign: 'right', fontWeight: '600', color: '#707EAE' }}>{item.before}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <span style={{ width: '50px', fontSize: '11px', color: '#22C55E', fontWeight: '600' }}>After</span>
                                                        <div style={{ flex: 1, background: '#E2E8F0', height: '10px', borderRadius: '4px', overflow: 'hidden' }}>
                                                            <div style={{ width: afterWidth, background: '#22C55E', height: '100%' }}></div>
                                                        </div>
                                                        <span style={{ width: '40px', fontSize: '12px', textAlign: 'right', fontWeight: '700', color: '#22C55E' }}>{item.after}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* RENDER CLEAN ENGLISH COMPARISON LEDGER TABLE */}
                        <div style={{ minHeight: '200px', maxHeight: '450px', overflowY: 'auto', marginBottom: '20px' }}>
                            {renderComparisonLedger()}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                            <button onClick={() => setSelectedLog(null)} style={{ ...assignBtn, background: '#475569' }}>
                                Close Inspection Window
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

/* DESIGN SPECIFICATIONS */
const modalOverlay = {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%', height: '100%',
    background: 'rgba(15, 23, 42, 0.45)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
};

const modalBox = {
    background: 'white',
    borderRadius: '16px',
    padding: '30px',
    position: 'relative',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    maxHeight: '85vh',
    overflowY: 'auto'
};

const closeBtn = {
    position: 'absolute',
    top: 20,
    right: 20,
    border: 'none',
    background: '#F1F5F9',
    padding: '6px',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#64748B'
};

const assignBtn = {
    padding: '10px 20px',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
};

const title = { margin: '0 0 6px 0', fontSize: '20px', fontWeight: '700' };
const modalSectionTitle = { fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '8px', display: 'flex', alignItems: 'center' };

const thStyle = { padding: '18px 20px', color: '#A3AED0', fontSize: '13px', fontWeight: '800', textAlign: 'left' };
const tdStyle = { padding: '16px 20px', color: '#2B3674', fontSize: '14px' };
const trStyle = { borderBottom: '1px solid #F4F7FE' };
const ellipsisText = { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const loadingStyle = { padding: '80px', textAlign: 'center', color: '#A3AED0', fontSize: '15px' };

export default AdminAuditLog;