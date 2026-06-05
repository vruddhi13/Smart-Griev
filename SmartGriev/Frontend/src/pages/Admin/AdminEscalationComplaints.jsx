import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { adminTheme as theme } from '../../services/AdminServices/AdminTheme';
import {
    MapPin,
    AlertCircle
} from 'lucide-react';
import {
    getEscalationComplaints,
    manualEscalation
} from '../../services/AdminServices/AdminService';
import { CornerUpRight } from 'lucide-react';
import usePagination from '../../services/usePagination';
import Pagination from '../../Components/AdminComponents/Pagination';
import {
    showError,
    showSuccessToast
} from "../../services/alertService";

const AdminEscalationComplaints = () => {
    
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reason, setReason] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [officers, setOfficers] = useState([]);
    const [selectedOfficer, setSelectedOfficer] = useState("");
    // =====================================================
    // FETCH COMPLAINTS
    // =====================================================
    const fetchOfficers = async (departmentId, currentEscalatedToId) => {

        try {

            if (!departmentId) {

                console.error("No departmentId provided");

                setOfficers([]);

                return;
            }

            const res = await fetch(
                `https://localhost:7224/api/admin/escalation/officers/${departmentId}`
            );

            const json = await res.json();

            let officerList = json?.data ?? [];

            // ❌ REMOVE CURRENT ESCALATED OFFICER
            officerList = officerList.filter(
                (o) => o.userId !== currentEscalatedToId
            );

            setOfficers(officerList);

        } catch (err) {

            console.error("Officer API error:", err);

            setOfficers([]);
        }
    };
    const fetchComplaints = async () => {
        try {
            setLoading(true);

            const data = await getEscalationComplaints();

            // SAFE RESPONSE HANDLING
            setComplaints(data?.data || data || []);

        } catch (error) {
            console.error("Error fetching complaints:", error);
            setComplaints([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleEscalation = async () => {
        try {
            setSubmitting(true);

            if (!selectedComplaint?.assignedToId) {
                showError(
                    "This complaint is not assigned to any officer yet"
                );
                return;
            }

            if (!selectedOfficer) {
                showError(
                    "Please select officer"
                );
                return;
            }
            if (!reason.trim()) {
                showError(
                    "Please enter escalation reason"
                );
                return;
            }

            const payload = {
                complaintId: selectedComplaint.complaintId,

                escalatedFrom: Number(sessionStorage.getItem("userId")),

                escalatedTo: Number(selectedOfficer),

                reason: reason || "No reason provided",

                escalationLevel: (selectedComplaint.escalationLevel || 0) + 1
            };
            if (
                Number(selectedOfficer) ===
                Number(selectedComplaint?.escalatedToId)
            ) {
                showError(
                    "Complaint already escalated to this officer"
                );
                return;
            }
            await manualEscalation(payload, sessionStorage.getItem("token"));

            showSuccessToast(
                "Complaint escalated successfully"
            );

            setShowModal(false);
            setReason("");
            setSelectedOfficer("");

            fetchComplaints();

        } catch (err) {
            console.error(err);
            alert(err.message || "Escalation failed");
        } finally {
            setSubmitting(false);
        }
    };

    // =====================================================
    // PAGINATION
    // =====================================================

    const {
        currentPage,
        totalPages,
        currentData,
        nextPage,
        prevPage,
        setCurrentPage
    } = usePagination(complaints || [], 5);

    // =====================================================
    // PRIORITY STYLE
    // =====================================================

    const getPriorityStyle = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high':
                return { bg: '#FFE9E9', text: '#EE5D50' };
            case 'medium':
                return { bg: '#FFF4E5', text: '#F59E0B' };
            case 'low':
                return { bg: '#E2F9EF', text: '#22C55E' };
            default:
                return { bg: '#F4F7FE', text: '#A3AED0' };
        }
    };

    // =====================================================
    // STATUS STYLE
    // =====================================================

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'assigned':
                return { bg: '#DBEAFE', text: '#2563EB' };
            case 'in progress':
                return { bg: '#FEF3C7', text: '#D97706' };
            case 'resolved':
                return { bg: '#E2F9EF', text: '#16A34A' };
            case 'rejected':
                return { bg: '#FEE2E2', text: '#DC2626' };
            case 'escalated':
                return { bg: '#FEE2E2', text: '#B91C1C' };
            default:
                return { bg: '#F4F7FE', text: '#64748B' };
        }
    };

    // =====================================================
    // ROLE STYLE
    // =====================================================

    const getRoleStyle = (role) => {
        switch (role) {
            case 'Officer':
                return { bg: '#DBEAFE', text: '#2563EB' };
            case 'Department Head':
                return { bg: '#FEF3C7', text: '#D97706' };
            case 'Admin':
                return { bg: '#F3E8FF', text: '#7C3AED' };
            default:
                return { bg: '#F1F5F9', text: '#475569' };
        }
    };

    return (
        <AdminLayout pageTitle="Escalation Complaints">

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
                            letterSpacing: '-0.5px'
                        }}>
                            Escalation Tracking
                        </h2>
                        <p style={{ color: theme.colors.text.gray, fontSize: '15px', marginTop: '4px' }}>
                            Officer → Department Head → Admin escalation flow
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
                        minWidth: '1500px'
                    }}>

                        <thead>
                            <tr style={{ background: '#FAFCFF' }}>
                                <th style={thStyle}>Complaint</th>
                                <th style={thStyle}>User</th>
                                <th style={thStyle}>Department</th>
                                {/*<th style={thStyle}>Category</th>*/}
                                <th style={thStyle}>Assigned To</th>
                                <th style={thStyle}>Escalated To</th>
                                <th style={thStyle}>Role</th>
                                <th style={thStyle}>Escalation</th>
                                <th style={thStyle}>Priority</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Date</th>
                                <th style={thStyle}>Action</th>
                            </tr>
                        </thead>

                        <tbody>

                            {loading ? (
                                <tr>
                                    <td colSpan="9" style={loadingStyle}>
                                        Loading...
                                    </td>
                                </tr>
                            ) : currentData.length === 0 ? (
                                <tr>
                                    <td colSpan="9" style={loadingStyle}>
                                        No complaints found
                                    </td>
                                </tr>
                            ) : (
                                currentData.map((c) => {

                                    const priorityStyle = getPriorityStyle(c.priorityLevel);
                                    const roleStyle = getRoleStyle(c.assignedRole);
                                    const statusStyle = getStatusStyle(c.status);

                                    return (
                                        <tr key={c.complaintId}>

                                            {/* Complaint */}
                                            <td style={tdStyle}>
                                                <b style={{ color: theme.colors.brand.primary }}>
                                                    {c.complaintNumber}
                                                </b>
                                            </td>

                                            {/* User */}
                                            <td style={tdStyle}>{c.userName}</td>

                                            {/* Department */}
                                            <td style={tdStyle}>{c.departmentName}</td>

                                            {/*<td style={tdStyle}>{c.categoryName}</td>*/}

                                            {/* Assigned */}
                                            <td style={tdStyle}>
                                                <div style={{ fontWeight: "700" }}>
                                                    {c.assignedToName || "Not assigned"}
                                                </div>
                                            </td>

                                            <td style={tdStyle}>
                                                <div style={{ fontWeight: "700" }}>
                                                {c.escalatedToName ||
                                                    c.escalatedTo ||
                                                    c.escalated_to ||
                                                    "-"}
                                                </div>
                                            </td>

                                            {/* Role */}
                                            <td style={tdStyle}>
                                                <span style={{ padding: '5px 10px', borderRadius: '20px', background: roleStyle.bg, color: roleStyle.text, fontSize: '12px', fontWeight: '700' }}> {c.assignedRole || "-"} </span>
                                              
                                            </td>

                                            {/* ESCALATION FIELD (IMPORTANT PART) */}
                                            <td style={tdStyle}>

                                                {c.status?.toLowerCase() === "escalated" ? (

                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: '4px'
                                                    }}>

                                                        <span style={{
                                                            background: '#FEE2E2',
                                                            color: '#B91C1C',
                                                            padding: '5px 10px',
                                                            borderRadius: '10px',
                                                            fontSize: '12px',
                                                            fontWeight: '700'
                                                        }}>
                                                            Level {c.escalationLevel || 1}
                                                        </span>

                                                        <small style={{
                                                            color: '#64748B',
                                                            fontSize: '11px'
                                                        }}>
                                                            {c.escalatedFromRole} → {c.assignedRole}
                                                        </small>

                                                    </div>

                                                ) : (
                                                    "-"
                                                )}

                                            </td>

                                            {/* Priority */}
                                            <td style={tdStyle}>
                                                <span style={{
                                                    padding: '5px 10px',
                                                    borderRadius: '8px',
                                                    background: priorityStyle.bg,
                                                    color: priorityStyle.text,
                                                    fontSize: '12px',
                                                    fontWeight: '700'
                                                }}>
                                                    <AlertCircle size={12} style={{ marginRight: '4px' }} />
                                                    {c.priorityLevel}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td style={tdStyle}>
                                                <span style={{
                                                    padding: '6px 12px',
                                                    borderRadius: '20px',
                                                    background: statusStyle.bg,
                                                    color: statusStyle.text,
                                                    fontSize: '12px',
                                                    fontWeight: '700'
                                                }}>
                                                    {c.status}
                                                </span>
                                            </td>

                                            {/* Date */}
                                            <td style={tdStyle}>
                                                {c.createdAt
                                                    ? new Date(c.createdAt).toLocaleDateString('en-GB')
                                                    : "-"}
                                            </td>

                                            <td style={tdStyle}>
                                                <div style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}>
                                                    <div
                                                        onClick={() => {
                                                            setSelectedComplaint(c);
                                                            setShowModal(true);
                                                            fetchOfficers(
                                                                c.departmentId ||
                                                                c.departmentID ||
                                                                c.department_id ||
                                                                c.department?.departmentId,

                                                                c.escalatedToId
                                                            );                                                        }}
                                                        style={{
                                                            width: "34px",
                                                            height: "34px",
                                                            borderRadius: "10px",
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            background: "#EEF2FF",
                                                            cursor: "pointer"
                                                        }}
                                                    >
                                                        <CornerUpRight size={16} color="#4F46E5" />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}

                        </tbody>

                    </table>
                </div>

                {/* PAGINATION */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        nextPage={nextPage}
                        prevPage={prevPage}
                        setCurrentPage={setCurrentPage}
                    />
                </div>

            </div>
            {showModal && (
                <div style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 999
                }}>
                    <div style={{
                        width: "500px",
                        background: "white",
                        borderRadius: "10px",
                        padding: "20px"
                    }}>

                        <h3>Escalate Complaint</h3>

                        <p>
                            Complaint: <b>{selectedComplaint?.complaintNumber}</b>
                        </p>

                        {/* OFFICER LIST */}
                        <div style={{
                            maxHeight: "200px",
                            overflowY: "auto",
                            border: "1px solid #eee",
                            borderRadius: "8px",
                            marginBottom: "10px"
                        }}>
                            {officers.length === 0 ? (
                                <p style={{ padding: "10px" }}>No officers found</p>
                            ) : (
                                officers.map((o) => (
                                    <div
                                        key={o.userId}
                                        onClick={() => setSelectedOfficer(o.userId)}
                                        style={{
                                            padding: "10px",
                                            cursor: "pointer",
                                            borderBottom: "1px solid #f1f1f1",
                                            background: selectedOfficer === o.userId ? "#dbeafe" : "white"
                                        }}
                                    >
                                        <div style={{ fontWeight: "700" }}>
                                            {o.userName}
                                        </div>

                                        <div style={{ fontSize: "12px", color: "#64748b" }}>
                                            {o.email}
                                        </div>

                                        <div style={{ fontSize: "12px", color: "#64748b" }}>
                                            {o.mobileNo}
                                        </div>

                                        <div style={{ fontSize: "12px", color: "#64748b" }}>
                                            {o.departmentName}
                                        </div>

                                        <span style={{
                                            fontSize: "11px",
                                            padding: "2px 6px",
                                            borderRadius: "6px",
                                            background: "#e0f2fe",
                                            color: "#0369a1"
                                        }}>
                                            {o.role}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* REASON */}
                        <textarea
                            placeholder="Enter reason for escalation"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            style={{
                                width: "100%",
                                height: "80px",
                                padding: "10px",
                                marginBottom: "10px"
                            }}
                        />

                        {/* BUTTONS */}
                        <div style={{ display: "flex", gap: "10px" }}>

                            <button
                                onClick={handleEscalation}
                                disabled={submitting}
                                style={{
                                    background: "green",
                                    color: "white",
                                    padding: "10px",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer"
                                }}
                            >
                                {submitting ? "Submitting..." : "Escalate"}
                            </button>

                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    background: "#ccc",
                                    padding: "10px",
                                    border: "none",
                                    borderRadius: "6px"
                                }}
                            >
                                Cancel
                            </button>

                        </div>

                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

// STYLES
const thStyle = {
    padding: '15px',
    color: '#A3AED0',
    fontSize: '13px',
    fontWeight: '800',
    textAlign: 'left'
};

const tdStyle = {
    padding: '14px 12px',
    color: '#2B3674',
    fontSize: '16px',
    borderBottom: '1px solid #F4F7FE',
    verticalAlign: 'middle'
};

const loadingStyle = {
    padding: '80px',
    textAlign: 'center',
    color: '#A3AED0'
};


export default AdminEscalationComplaints;