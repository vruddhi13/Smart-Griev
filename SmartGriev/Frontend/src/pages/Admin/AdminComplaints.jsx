import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { adminTheme as theme } from '../../services/AdminServices/AdminTheme';
import { Eye, UserCheck, MapPin, AlertCircle } from 'lucide-react';
import { getComplaints } from '../../services/AdminServices/AdminService';
import usePagination from '../../services/usePagination';
import Pagination from '../../Components/AdminComponents/Pagination';

const AdminComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const data = await getComplaints();
            setComplaints(data);
        } catch (error) {
            console.error("Error fetching complaints:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const {
        currentPage,
        totalPages,
        currentData,
        nextPage,
        prevPage,
        setCurrentPage
    } = usePagination(complaints, 4);

    const getPriorityStyle = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return { bg: '#FFE9E9', text: '#EE5D50' };
            case 'medium': return { bg: '#FFF4E5', text: '#F59E0B' };
            case 'low': return { bg: '#E2F9EF', text: '#22C55E' };
            default: return { bg: '#F4F7FE', text: '#A3AED0' };
        }
    };

    return (
        <AdminLayout pageTitle="Complaints">
            {/* FIX: The wrapper uses flex-grow and overflow: hidden to ensure 
               the sidebar and search bar never move from their original positions.
            */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                width: '100%',
                maxWidth: 'calc(100vw - 350px)', // Ensures it respects sidebar width
                margin: '0 auto',
            }}>

                {/* HEADER SECTION */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{
                            color: theme.colors.text.main,
                            margin: 0,
                            fontSize: '26px', // Increased size for better visibility
                            fontWeight: '700',
                            letterSpacing: '-0.5px'
                        }}>
                            Complaint Management
                        </h2>
                        <p style={{ color: theme.colors.text.gray, fontSize: '15px', marginTop: '4px' }}>
                            Monitor and manage city grievances
                        </p>
                    </div>
                </div>

                {/* TABLE CONTAINER - INTERNAL SCROLLING 
                   This is the key fix. The 'overflowX: auto' creates a local scrollbar 
                   so the dashboard layout (sidebar/search) stays static.
                */}
                <div style={{
                    background: 'white',
                    borderRadius: theme.radius.card,
                    boxShadow: theme.shadows.card,
                    overflowX: 'auto',
                    width: '100%',
                    border: '1px solid #F4F7FE'
                }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        minWidth: '1400px', // Forces the internal scroll
                        tableLayout: 'auto'
                    }}>
                        <thead>
                            <tr style={{ background: '#FAFCFF', borderBottom: '1px solid #F4F7FE' }}>
                                <th style={thStyle}>Complaint No</th>
                                <th style={thStyle}>User</th>
                                <th style={thStyle}>Department</th>
                                <th style={thStyle}>Category</th>
                                <th style={thStyle}>Location</th>
                                <th style={thStyle}>Assigned To</th>
                                <th style={thStyle}>Priority</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Date</th>
                            {/*    <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>*/}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="10" style={loadingStyle}>Loading data...</td></tr>
                            ) : currentData.map((c) => {
                                const priorityStyle = getPriorityStyle(c.priorityLevel);
                                return (
                                    <tr key={c.complaintId} style={trStyle}>
                                        <td style={{ ...tdStyle, fontWeight: '700', color: theme.colors.brand.primary }}>
                                            {c.complaintNumber}
                                        </td>
                                        <td style={{ ...tdStyle, fontWeight: '600' }}>{c.userName}</td>
                                        <td style={tdStyle}>{c.departmentName}</td>
                                        <td style={tdStyle}>{c.categoryName}</td>
                                        <td style={{ ...tdStyle, maxWidth: '250px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <MapPin size={14} color={theme.colors.brand.primary} />
                                                <span style={ellipsisText} title={c.location}>{c.location || "N/A"}</span>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>{c.assignedTo || "Unassigned"}</td>
                                        <td style={tdStyle}>
                                            <div style={{
                                                padding: '6px 12px',
                                                borderRadius: '8px',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                background: priorityStyle.bg,
                                                color: priorityStyle.text
                                            }}>
                                                <AlertCircle size={12} />
                                                {c.priorityLevel}
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={{
                                                padding: '6px 14px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: '700',
                                                background: c.status === 'Resolved' ? '#E2F9EF' : '#FFF4E5',
                                                color: c.status === 'Resolved' ? '#22C55E' : '#F59E0B'
                                            }}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td style={tdStyle}>
                                            {new Date(c.createdAt).toLocaleDateString('en-GB')}
                                        </td>
                                        {/*<td style={{ ...tdStyle, textAlign: 'center' }}>*/}
                                        {/*    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>*/}
                                        {/*        <button style={actionBtn} title="View Details">*/}
                                        {/*            <Eye size={20} color="#A3AED0" />*/}
                                        {/*        </button>*/}
                                        {/*        <button style={actionBtn} title="Assign User">*/}
                                        {/*            <UserCheck size={20} color="#4318FF" />*/}
                                        {/*        </button>*/}
                                        {/*    </div>*/}
                                        {/*</td>*/}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION SECTION */}
                <div style={{ display: "flex", justifyContent: "flex-end", paddingBottom: '20px' }}>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        nextPage={nextPage}
                        prevPage={prevPage}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            </div>
        </AdminLayout>
    );
};

// --- ENHANCED STYLES ---
const thStyle = {
    padding: '18px 20px',
    color: '#A3AED0',
    fontSize: '13px', // Larger font for readability
    fontWeight: '800',
    textAlign: 'left',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    whiteSpace: 'nowrap'
};

const tdStyle = {
    padding: '20px',
    color: '#2B3674',
    fontSize: '15px', // Standardized larger font
    borderBottom: '1px solid #F4F7FE',
    whiteSpace: 'nowrap'
};

const trStyle = {
    transition: 'all 0.2s ease',
    background: 'white',
    borderBottom: '1px solid #F4F7FE'
};

//const actionBtn = {
//    border: 'none',
//    background: 'none',
//    cursor: 'pointer',
//    padding: '6px',
//    borderRadius: '8px',
//    display: 'flex',
//    alignItems: 'center',
//    transition: 'background 0.2s',
//    ':hover': { background: '#F4F7FE' }
//};

const ellipsisText = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'inline-block',
    width: '100%',
    verticalAlign: 'middle'
};

const loadingStyle = {
    padding: '80px',
    textAlign: 'center',
    color: '#A3AED0',
    fontSize: '16px',
    fontWeight: '600'
};

export default AdminComplaints;