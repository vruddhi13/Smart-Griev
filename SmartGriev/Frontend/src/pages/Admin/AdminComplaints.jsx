import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { adminTheme as theme } from '../../services/AdminServices/AdminTheme';
import { Eye, MapPin, AlertCircle, X, RefreshCcw } from 'lucide-react';
import { getComplaints, getOfficers, assignComplaint } from '../../services/AdminServices/AdminService';
import usePagination from '../../services/usePagination';
import Pagination from '../../Components/AdminComponents/Pagination';
import { showSuccessToast, showError } from "../../services/alertService";


const AdminComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [officers, setOfficers] = useState([]);
    const [assigning, setAssigning] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [showOfficers, setShowOfficers] = useState(false);

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'in progress':
                return { bg: '#DBEAFE', text: '#1D4ED8' };
            case 'resolved':
                return { bg: '#DCFCE7', text: '#15803D' };
            case 'rejected':
                return { bg: '#FEE2E2', text: '#B91C1C' };
            case 'assigned':
                return { bg: '#FEF3C7', text: '#92400E' };
            default:
                return { bg: '#E5E7EB', text: '#374151' };
        }
    };

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

        const loadOfficers = async () => {
            try {
                const data = await getOfficers();
                console.log("OFFICERS:", data);
                setOfficers(data.data || data); // ✅ important fix
            } catch (err) {
                console.error("Officer error:", err);
            }
        };

        loadOfficers();
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


    const handleAssign = async (officerId) => {
        if (assigning) return;

        try {
            setAssigning(true);

            const adminId = sessionStorage.getItem("userId");
            const isReassign = selectedComplaint?.assignedTo != null;

            await assignComplaint({
                complaintId: selectedComplaint.complaintId,
                officerId,
                adminId: Number(adminId),
                remarks: isReassign ? "Reassigned by admin" : "Assigned by admin",
                forceReassign: isReassign
            });

            showSuccessToast(isReassign ? "Reassigned Successfully 🔁" : "Assigned Successfully ✅");

            setSelectedComplaint(null);
            setShowOfficers(false);
            fetchComplaints();

        } catch (error) {
                console.error(error); // ✅ now it's used
                showError("Assignment Failed ❌");
            
        } finally {
            setAssigning(false);
        }
    };

    return (
        <AdminLayout pageTitle="Complaints">

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                width: '100%',
                maxWidth: 'calc(100vw - 350px)',
                margin: '0 auto',
            }}>

                {/* HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{
                            color: theme.colors.text.main,
                            margin: 0,
                            fontSize: '26px',
                            fontWeight: '700',
                        }}>
                            Complaint Management
                        </h2>
                        <p style={{ color: theme.colors.text.gray, fontSize: '15px' }}>
                            Monitor and manage city grievances
                        </p>
                    </div>
                </div>

                {/* TABLE */}
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
                        minWidth: '1400px',
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
                                <th style={thStyle}>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr><td colSpan="10" style={loadingStyle}>Loading data...</td></tr>
                            ) : currentData.map((c) => {
                                const priorityStyle = getPriorityStyle(c.priorityLevel);
                                const isAssigned = c.assignedTo !== null;                                console.log("Complaint:", c.complaintId, c.assignedTo);
                                return (
                                    <tr key={c.complaintId} style={trStyle}>
                                        <td style={{ ...tdStyle, fontWeight: '700', color: theme.colors.brand.primary }}>{c.complaintNumber}</td>
                                        <td style={{ ...tdStyle, fontWeight: '600' }}>{c.userName}</td>
                                        <td style={tdStyle}>{c.departmentName}</td>
                                        <td style={tdStyle}>{c.categoryName}</td>

                                        <td style={{ ...tdStyle, maxWidth: '250px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <MapPin size={14} />
                                                <span style={ellipsisText}>{c.location || "N/A"}</span>
                                            </div>
                                        </td>

                                        <td style={tdStyle}>{c.assignedToName || "Not Assigned"}</td>

                                        <td style={tdStyle}>
                                            <div style={{
                                                padding: '6px 12px',
                                                borderRadius: '8px',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                display: 'inline-flex',
                                                gap: '4px',
                                                background: priorityStyle.bg,
                                                color: priorityStyle.text
                                            }}>
                                                <AlertCircle size={12} />
                                                {c.priorityLevel}
                                            </div>
                                        </td>

                                        <td style={tdStyle}>
                                            <div style={{
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                display: 'inline-block',
                                                background: getStatusStyle(c.status).bg,
                                                color: getStatusStyle(c.status).text
                                            }}>
                                                {c.status}
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            {new Date(c.createdAt).toLocaleDateString('en-GB')}
                                        </td>
                                        <td style={tdStyle}>

                                            {/* ✅ NOT ASSIGNED → ONLY ASSIGN */}
                                            {!isAssigned && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedComplaint(c);
                                                        setShowOfficers(true); // open directly
                                                    }}
                                                    style={{ border: "none", background: "none", cursor: "pointer" }}
                                                    title="Assign"
                                                >
                                                    <Eye size={20} color="#22C55E" />
                                                </button>
                                            )}

                                            {/* ✅ ASSIGNED → ONLY REASSIGN */}
                                            {isAssigned && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedComplaint(c);
                                                        setShowOfficers(true);
                                                    }}
                                                    style={{ border: "none", background: "none", cursor: "pointer" }}
                                                    title="Reassign"
                                                >
                                                    <RefreshCcw size={20} color="#F59E0B" />
                                                </button>
                                            )}

                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div style={{ display: "flex", justifyContent: "flex-end", paddingBottom: '20px' }}>
                    <Pagination {...{ currentPage, totalPages, nextPage, prevPage, setCurrentPage }} />
                </div>
            </div>

            {/* ================= MODAL ================= */}
            {selectedComplaint && (
                <div style={modalOverlay}>
                    <div style={modalBox}>

                        <button onClick={() => {
                            setSelectedComplaint(null);
                            setShowOfficers(false);
                        }} style={closeBtn}>
                            <X />
                        </button>

                        <div style={{ display: 'flex', gap: '30px' }}>

                            {/* LEFT */}
                            <div style={{ flex: 1 }}>
                                <h3 style={title}>Complaint Details</h3>
                                <p><b>No:</b> {selectedComplaint.complaintNumber}</p>
                                <p><b>User:</b> {selectedComplaint.userName}</p>
                                <p><b>Dept:</b> {selectedComplaint.departmentName}</p>

                                <button
                                    style={assignBtn}
                                    onClick={() => setShowOfficers(true)}
                                >
                                    {selectedComplaint?.assignedTo ? "Reassign Officer" : "Assign Officer"}                                </button>
                            </div>

                            {/* RIGHT */}
                            {showOfficers && (
                                <div style={{ flex: 1 }}>
                                    <h3 style={title}>Select Officer</h3>

                                    {officers
                                        .filter(o => {
                                            // Hide ONLY current assigned officer
                                            return Number(o.userId) !== Number(selectedComplaint.assignedTo);
                                        })
                                        .map(o => (
                                        <div key={o.userId} style={{
                                            padding: "16px",
                                            borderRadius: "12px",
                                            background: "#F9FAFF",
                                            border: "1px solid #E0E5F2",
                                            marginBottom: "12px",
                                            boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
                                        }}>

                                            <h4 style={{ margin: "0 0 6px", color: "#4318FF" }}>
                                                {o.fullName}
                                            </h4>

                                            <p style={text}><b>Email:</b> {o.email || "N/A"}</p>
                                            <p style={text}><b>Mobile:</b> {o.mobileNo}</p>
                                            <p style={text}><b>Role:</b> {o.role}</p>
                                            <p style={text}><b>Dept:</b> {o.departmentId || "N/A"}</p>

                                            <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>

                                                <button
                                                    onClick={() => handleAssign(o.userId)}
                                                    style={{
                                                        flex: 1,
                                                        background: "#22C55E",
                                                        color: "white",
                                                        padding: "10px",
                                                        border: "none",
                                                        borderRadius: "8px",
                                                        cursor: "pointer",
                                                        fontWeight: "600"
                                                    }}
                                                >
                                                    ✅ Assign
                                                </button>

                                                <button
                                                    onClick={() => setShowOfficers(false)}
                                                    style={{
                                                        flex: 1,
                                                        background: "#EF4444",
                                                        color: "white",
                                                        padding: "10px",
                                                        border: "none",
                                                        borderRadius: "8px",
                                                        cursor: "pointer",
                                                        fontWeight: "600"
                                                    }}
                                                >
                                                    ❌ Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
};

/* EXTRA MODAL STYLES (NO CHANGE TO YOUR DESIGN) */
const modalOverlay = {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%', height: '100%',
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
};

const modalBox = {
    width: '900px',
    background: 'white',
    borderRadius: '16px',
    padding: '30px',
    position: 'relative',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
};

const closeBtn = {
    position: 'absolute',
    top: 15,
    right: 15,
    border: 'none',
    background: '#F4F7FE',
    padding: '6px',
    borderRadius: '8px',
    cursor: 'pointer'
};

const assignBtn = {
    marginTop: '15px',
    padding: '10px 18px',
    background: '#4318FF',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
};

const text = {
    margin: "4px 0",
    fontSize: "14px",
    color: "#2B3674"
};
//const officerCard = {
//    padding: '12px',
//    border: '1px solid #E0E5F2',
//    borderRadius: '10px',
//    marginBottom: '10px',
//    cursor: 'pointer',
//    transition: '0.2s'
//};

const title = { marginBottom: '10px' };

/* YOUR SAME STYLES */
const thStyle = { padding: '18px 20px', color: '#A3AED0', fontSize: '13px', fontWeight: '800' };
const tdStyle = { padding: '20px', color: '#2B3674', fontSize: '15px' };
const trStyle = { borderBottom: '1px solid #F4F7FE' };
const ellipsisText = { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const loadingStyle = { padding: '80px', textAlign: 'center' };

export default AdminComplaints;