import React, { useEffect, useState } from "react";
import OfficerLayout from "../../layout/OfficerLayout";
import { adminTheme as theme } from '../../services/AdminServices/AdminTheme';
import { Eye, X, Clock, User, Tag, AlertCircle } from 'lucide-react';
import { getMyComplaints, updateStatus } from "../../services/OfficerServices/OfficerService";
import { showSuccessToast, showError } from "../../services/AlertService";
import usePagination from '../../services/usePagination';
import Pagination from '../../Components/AdminComponents/Pagination';

const OfficerComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [newStatus, setNewStatus] = useState("");

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const data = await getMyComplaints();
            console.log("API Data:", data); // Check your console to see the exact field name for the user
            setComplaints(data);
        } catch (error) {
            showError(error.message || "Failed to load complaints.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchComplaints(); }, []);

    const handleUpdate = async () => {
        if (!newStatus) return;
        try {
            await updateStatus(selected.complaint_id, newStatus);
            showSuccessToast("Status updated successfully!");
            setSelected(null);
            fetchComplaints();
        } catch (error) {
            showError(error.response?.data?.message || "Could not update status.");
        }
    };

    const { currentPage, totalPages, currentData, nextPage, prevPage, setCurrentPage } = usePagination(complaints, 5);

    return (
        <OfficerLayout pageTitle="Complaint Management">
            <div style={containerStyle}>
                <h2 style={{ color: theme.colors.text.main, fontWeight: '700', marginBottom: '20px' }}>My Assignments</h2>

                <div style={tableWrapperStyle}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#FAFCFF', borderBottom: '1px solid #F4F7FE' }}>
                                <th style={thStyle}>Complaint No</th>
                                <th style={thStyle}>Citizen Name</th>
                                <th style={thStyle}>Category</th>
                                <th style={thStyle}>Status</th>
                                <th style={{ ...thStyle, textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={loadingStyle}>Loading...</td></tr>
                            ) : currentData.map((c) => (
                                <tr key={c.complaint_id} style={trStyle}>
                                    <td style={{ ...tdStyle, fontWeight: '700', color: theme.colors.brand.primary }}>{c.complaint_number}</td>
                                    {/* Fix: Checking both user_name and userName */}
                                    <td style={{ ...tdStyle, fontWeight: '600' }}>{c.citizen_name || "Unknown User"}</td>
                                    <td style={tdStyle}>{c.category_name}</td>
                                    <td style={tdStyle}>
                                        <span style={getStatusBadge(c.status)}>{c.status}</span>
                                    </td>
                                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                                        {/* Updated: Only Icon Button */}
                                        <button
                                            onClick={() => { setSelected(c); setNewStatus(c.status); }}
                                            style={iconButtonStyle}
                                            title="View Details"
                                        >
                                            <Eye size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: '20px' }}>
                    <Pagination currentPage={currentPage} totalPages={totalPages} nextPage={nextPage} prevPage={prevPage} setCurrentPage={setCurrentPage} />
                </div>
            </div>

            {/* POPUP MODAL */}
            {selected && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <div style={modalHeaderStyle}>
                            <h3 style={{ margin: 0 }}>Case: {selected.complaint_number}</h3>
                            <X style={{ cursor: 'pointer' }} onClick={() => setSelected(null)} />
                        </div>

                        <div style={modalBodyStyle}>
                            <div style={{ flex: 1 }}>
                                <DetailRow
                                    icon={<User size={16} />}
                                    label="Citizen"
                                    value={selected.citizen_name}
                                />
                                <DetailRow icon={<Tag size={16} />} label="Category" value={selected.category_name} />
                                <DetailRow icon={<Clock size={16} />} label="Priority" value={selected.priority_level} />

                                <div style={{ marginTop: '20px' }}>
                                    <label style={labelStyle}>Update Status</label>
                                    <select style={selectStyle} value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                                        <option value="Assigned">Assigned</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                    <button onClick={handleUpdate} style={updateBtnStyle}>Update</button>
                                    <button onClick={() => setSelected(null)} style={cancelBtnStyle}>Cancel</button>
                                </div>
                            </div>

                            <div style={{ flex: 1.2 }}>
                                <p style={labelStyle}>Map Location</p>
                                {selected.location_data?.latitude &&
                                    selected.location_data?.longitude ? (
                                    <iframe
                                        title="map"
                                        width="100%"
                                        height="180"
                                        style={{
                                            border: 0,
                                            borderRadius: '12px',
                                            marginBottom: '15px'
                                        }}
                                        src={`https://maps.google.com/maps?q=${selected.location_data.latitude},${selected.location_data.longitude}&z=16&output=embed`}
                                    />
                                ) : (
                                    <div style={noDataBox}>No GPS Data</div>
                                )}

                                <p style={labelStyle}>Attachment</p>
                                {selected.image ? (
                                    <img src={`https://localhost:7224/${selected.image}`} alt="evidence" style={imgStyle} />
                                ) : <div style={noDataBox}>No Image</div>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </OfficerLayout>
    );
};

// Internal Components
const DetailRow = ({ icon, label, value }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
        <div style={{ color: theme.colors.brand.primary }}>{icon}</div>
        <div>
            <div style={{ fontSize: '11px', color: '#A3AED0', fontWeight: '700' }}>{label}</div>
            <div style={{ fontSize: '14px', color: '#2B3674', fontWeight: '600' }}>{value || "N/A"}</div>
        </div>
    </div>
);

// --- Styles ---
const containerStyle = { width: '100%', maxWidth: 'calc(100vw - 350px)', margin: '0 auto', padding: '20px' };
const tableWrapperStyle = { background: 'white', borderRadius: '15px', boxShadow: theme.shadows.card, overflow: 'hidden' };
const thStyle = { padding: '15px', color: '#A3AED0', fontSize: '12px', fontWeight: '800', textAlign: 'left', textTransform: 'uppercase' };
const tdStyle = { padding: '15px', color: '#2B3674', fontSize: '14px', borderBottom: '1px solid #F4F7FE' };
const trStyle = { transition: '0.2s' };

const iconButtonStyle = {
    background: '#F4F7FE',
    color: theme.colors.brand.primary,
    border: 'none',
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: '0.2s',
    margin: '0 auto'
};

const getStatusBadge = (status) => ({
    padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
    background: status === 'Resolved' ? '#E2F9EF' : '#FFF4E5',
    color: status === 'Resolved' ? '#22C55E' : '#F59E0B'
});

const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle = { background: 'white', padding: '25px', borderRadius: '20px', width: '750px' };
const modalHeaderStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' };
const modalBodyStyle = { display: 'flex', gap: '20px' };
const labelStyle = { fontSize: '12px', fontWeight: '700', color: '#2B3674', marginBottom: '5px', display: 'block' };
const selectStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E0E5F2' };
const updateBtnStyle = { background: theme.colors.brand.primary, color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' };
const cancelBtnStyle = { background: '#F4F7FE', color: '#2B3674', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' };
const imgStyle = { width: '100%', borderRadius: '12px', height: '140px', objectFit: 'cover' };
const noDataBox = { background: '#F4F7FE', color: '#A3AED0', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', fontSize: '12px' };
const loadingStyle = { padding: '50px', textAlign: 'center', color: '#A3AED0' };

export default OfficerComplaints;