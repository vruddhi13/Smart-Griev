import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layout/DeptHeadLayout';
import { deptHeadTheme as theme } from '../../services/DeptHeadServices/DeptHeadTheme';
import { Eye, MapPin, AlertCircle, X, RefreshCcw } from 'lucide-react';
import { getOfficers } from '../../services/AdminServices/AdminService';

// Logic Fix: Matching lowercase export and aliasing to avoid component name conflict
import { deptHeadAssignComplaint as assignComplaintService, getDepartmentComplaints } from '../../services/DeptHeadServices/DeptHeadService';

import usePagination from '../../services/usePagination';
import Pagination from '../../Components/AdminComponents/Pagination';
import { showSuccessToast, showError } from "../../services/alertService";

const DeptHeadAssignComplaint = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [officers, setOfficers] = useState([]);
    const [assigning, setAssigning] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [showOfficers, setShowOfficers] = useState(false);

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'in progress': return { bg: '#DBEAFE', text: '#1D4ED8' };
            case 'resolved': return { bg: '#DCFCE7', text: '#15803D' };
            case 'rejected': return { bg: '#FEE2E2', text: '#B91C1C' };
            case 'assigned': return { bg: '#FEF3C7', text: '#92400E' };
            default: return { bg: '#E5E7EB', text: '#374151' };
        }
    };

    const fetchComplaints = async () => {
        try {

            setLoading(true);

            const deptId = sessionStorage.getItem("deptId");

            const response =
                await getDepartmentComplaints(deptId);

            const data = response || [];

            setComplaints(data);

        } catch (err) {

            console.error(
                "Error fetching complaints:",
                err
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchComplaints();

        const loadOfficers = async () => {
            try {
                const response = await getOfficers();
                const myDeptId = sessionStorage.getItem("deptId");
                const allOfficers = response?.data || response || [];

                const filtered = allOfficers.filter(o =>
                    Number(o.departmentId) === Number(myDeptId) && (o.role === "Officer" || o.roleName === "Officer")
                );

                setOfficers(filtered);
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

    const handleDeptHeadAssign = async (officerId) => {
        if (assigning) return;

        try {
            setAssigning(true);
            const deptHeadId = sessionStorage.getItem("userId");
            const isReassign = selectedComplaint?.assignedTo != null;

            await assignComplaintService({
                complaintId: selectedComplaint.complaintId,
                officerId: officerId,
                adminId: Number(deptHeadId),
                remarks: isReassign ? "Reassigned by Dept Head" : "Assigned by Dept Head",
                forceReassign: true
            });

            showSuccessToast(isReassign ? "Reassigned Successfully 🔁" : "Assigned Successfully ✅");
            setSelectedComplaint(null);
            setShowOfficers(false);
            fetchComplaints();

        } catch (err) {
            console.error(err);
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ color: theme.colors.text.main, margin: 0, fontSize: '26px', fontWeight: '700' }}>
                            Complaint Management
                        </h2>
                        <p style={{ color: theme.colors.text.gray, fontSize: '15px' }}>
                            Monitor and manage city grievances
                        </p>
                    </div>
                </div>

                <div style={{
                    background: 'white',
                    borderRadius: theme.radius.card,
                    boxShadow: theme.shadows.card,
                    overflowX: 'auto',
                    width: '100%',
                    border: '1px solid #F4F7FE'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1400px', tableLayout: 'auto' }}>
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
                                const isAssigned = c.assignedTo !== null;
                                return (
                                    <tr key={c.complaintId} style={trStyle}>
                                        <td style={{ ...tdStyle, fontWeight: '700', color: theme.colors.brand.primary }}>{c.complaintNumber}</td>
                                        <td style={{ ...tdStyle, fontWeight: '600' }}>{c.citizen_name || c.userName || "Unknown User"}</td>
                                        <td style={tdStyle}>{c.departmentName}</td>
                                        <td style={tdStyle}>{c.categoryName}</td>
                                        <td style={{ ...tdStyle, maxWidth: '250px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <MapPin size={14} />

                                                <span style={ellipsisText}>
                                                    {
                                                        c.location?.length > 0
                                                            ? c.location[0].address
                                                            : "N/A"
                                                    }
                                                </span>
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
                                            <button
                                                onClick={() => { setSelectedComplaint(c); setShowOfficers(true); }}
                                                style={{ border: "none", background: "none", cursor: "pointer" }}
                                                title={isAssigned ? "Reassign" : "Assign"}
                                            >
                                                {isAssigned ? <RefreshCcw size={20} color="#F59E0B" /> : <Eye size={20} color="#22C55E" />}
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

            {selectedComplaint && (
                <div style={modalOverlay}>
                    <div style={modalBox}>
                        <button onClick={() => { setSelectedComplaint(null); setShowOfficers(false); }} style={closeBtn}>
                            <X />
                        </button>
                        <div style={{ display: 'flex', gap: '30px' }}>
                            <div style={{ flex: 1 }}>
                                <h3 style={title}>Complaint Details</h3>
                                <p><b>No:</b> {selectedComplaint.complaintNumber}</p>
                                <p><b>User:</b> {selectedComplaint.citizen_name || selectedComplaint.userName}</p>
                                <p><b>Dept:</b> {selectedComplaint.departmentName}</p>
                                <button style={assignBtn} onClick={() => setShowOfficers(true)}>
                                    {selectedComplaint?.assignedTo ? "Reassign Officer" : "Assign Officer"}
                                </button>
                            </div>

                            {showOfficers && (
                                <div style={{ flex: 1, maxHeight: '400px', overflowY: 'auto' }}>
                                    <h3 style={title}>Select Officer</h3>
                                    {officers.length > 0 ? (
                                        officers
                                            .filter(o => Number(o.userId) !== Number(selectedComplaint.assignedTo))
                                            .map(o => (
                                                <div key={o.userId} style={officerCardStyle}>
                                                    <h4 style={{ margin: "0 0 6px", color: "#4318FF", fontSize: '16px' }}>
                                                        {o.fullName || o.userName || "Unnamed Officer"}
                                                    </h4>

                                                    {/* Adding all details here */}
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                        <p style={textStyle}><b>ID:</b> {o.userId}</p>
                                                        <p style={textStyle}><b>Mobile:</b> {o.mobileNo || 'N/A'}</p>
                                                        <p style={textStyle}><b>Email:</b> {o.email || 'N/A'}</p>
                                                        <p style={textStyle}><b>Role:</b> {o.roleName || o.role || 'Officer'}</p>
                                                        <p style={textStyle}><b>Dept ID:</b> {o.departmentId}</p>
                                                    </div>

                                                    <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                                                        <button
                                                            disabled={assigning}
                                                            onClick={() => handleDeptHeadAssign(o.userId)}
                                                            style={confirmBtn}
                                                        >
                                                            {assigning ? "⌛ Assigning..." : "✅ Assign Officer"}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                    ) : (
                                        <p style={{ color: '#A3AED0' }}>No officers available for this department.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

// --- RESTORED ORIGINAL STYLES ---
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 };
const modalBox = { width: '900px', background: 'white', borderRadius: '16px', padding: '30px', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' };
const closeBtn = { position: 'absolute', top: 15, right: 15, border: 'none', background: '#F4F7FE', padding: '6px', borderRadius: '8px', cursor: 'pointer' };
const assignBtn = { marginTop: '15px', padding: '10px 18px', background: '#4318FF', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' };
const officerCardStyle = { padding: "16px", borderRadius: "12px", background: "#F9FAFF", border: "1px solid #E0E5F2", marginBottom: "12px" };
const confirmBtn = { flex: 1, background: "#22C55E", color: "white", padding: "10px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", width: '100%' };
const textStyle = { margin: "4px 0", fontSize: "14px", color: "#2B3674" };
const thStyle = { padding: '18px 20px', color: '#A3AED0', fontSize: '13px', fontWeight: '800' };
const tdStyle = { padding: '20px', color: '#2B3674', fontSize: '15px' };
const trStyle = { borderBottom: '1px solid #F4F7FE' };
const ellipsisText = { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const loadingStyle = { padding: '80px', textAlign: 'center' };
const title = { marginBottom: '10px' };

export default DeptHeadAssignComplaint;