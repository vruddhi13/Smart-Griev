import React, { useEffect, useState } from "react";

import OfficerLayout from "../../layout/OfficerLayout";

import {
    getEscalatedComplaints,
    getComplaintDetails,
    getComplaintHistory
} from "../../services/OfficerServices/OfficerService";

import usePagination from "../../services/usePagination";

import Pagination from "../../Components/AdminComponents/Pagination";

import {
    FileText,
    History,
    MapPin,
    ImageIcon,
    X,
    User
} from "lucide-react";

const OfficerEscalation = () => {

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showDetailsModal, setShowDetailsModal] =
        useState(false);

    const [showHistoryModal, setShowHistoryModal] =
        useState(false);

    const [complaintDetails, setComplaintDetails] =
        useState(null);

    const [historyData, setHistoryData] =
        useState([]);

    const [loadingDetails, setLoadingDetails] =
        useState(false);

    const [loadingHistory, setLoadingHistory] =
        useState(false);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {

        try {

            setLoading(true);

            const data =
                await getEscalatedComplaints();

            setComplaints(data || []);

        } catch (error) {

            console.error(error);

            setComplaints([]);

        } finally {

            setLoading(false);
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return "-";

        return new Date(dateString).toLocaleString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    };

    const openDetails = async (
        complaintId
    ) => {

        try {

            setLoadingDetails(true);

            setShowDetailsModal(true);

            const data = await getComplaintDetails(complaintId);

            console.log("Details Response:", data);

            setComplaintDetails(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoadingDetails(false);
        }
    };

    const openHistory = async (complaintId) => {
        try {
            setLoadingHistory(true);
            setShowHistoryModal(true);

            const history = await getComplaintHistory(complaintId);

            console.log("History API Response:", history);

            setHistoryData(history || []);

        } catch (error) {
            console.error(error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const {
        currentPage,
        totalPages,
        currentData,
        nextPage,
        prevPage,
        setCurrentPage
    } = usePagination(
        complaints,
        5
    );

    const getPriorityStyle = (
        priority
    ) => {

        switch (
        priority?.toLowerCase()
        ) {

            case "high":
                return {
                    bg: "#FFE9E9",
                    text: "#EE5D50"
                };

            case "medium":
                return {
                    bg: "#FFF4E5",
                    text: "#F59E0B"
                };

            case "low":
                return {
                    bg: "#E2F9EF",
                    text: "#22C55E"
                };

            default:
                return {
                    bg: "#F4F7FE",
                    text: "#A3AED0"
                };
        }
    };

    const thStyle = {
        padding: "16px",
        textAlign: "left",
        fontSize: "14px",
        color: "#4B5563",
        fontWeight: "700",
    };

    const tdStyle = {
        padding: "16px",
        fontSize: "14px",
        color: "#111827",
        borderTop: "1px solid #F1F5F9",
    };

    const loadingStyle = {
        padding: "20px",
        textAlign: "center",
        color: "#6B7280",
    };

    const overlayStyle = {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999
    };

    const modalStyle = {
        background: "#fff",
        width: "80%",
        maxWidth: "900px",
        borderRadius: "16px",
        padding: "20px",
        height: "85vh",
        overflowY: "auto"
    };

    const modalHeaderStyle = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "15px",
    };

    const sectionStyle = {
        marginTop: "20px",
    };

    const InfoCard = ({ icon, title, value }) => {
        return (
            <div style={{
                background: "#F9FAFB",
                padding: "12px",
                borderRadius: "10px",
                display: "flex",
                gap: "10px",
                alignItems: "center"
            }}>
                <div>{icon}</div>
                <div>
                    <div style={{ fontSize: "12px", color: "#6B7280" }}>
                        {title}
                    </div>
                    <div style={{ fontWeight: "600", color: "#111827" }}>
                        {value || "-"}
                    </div>
                </div>
            </div>
        );
    };
    return (

        <OfficerLayout pageTitle="Escalated Complaints">

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px"
                }}
            >

                {/* TABLE CARD */}

                <div
                    style={{
                        background: "#fff",
                        borderRadius: "20px",
                        boxShadow:
                            "0 10px 30px rgba(0,0,0,.06)",
                        border:
                            "1px solid #F4F7FE",
                        overflowX: "auto"
                    }}
                >

                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            minWidth: "800px"
                        }}
                    >
                        <thead>
                            <tr style={{ background: "#FAFCFF" }}>
                                <th style={thStyle}>Complaint No</th>
                                <th style={thStyle}>Citizen Name</th>
                                <th style={thStyle}>Department</th>
                                <th style={thStyle}>Date</th>
                                <th style={thStyle}>Priority</th>
                                <th style={thStyle}>Action</th>
                            </tr>
                        </thead>

                        <tbody>

                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="9"
                                        style={loadingStyle}
                                    >
                                        Loading...
                                    </td>
                                </tr>
                            ) : currentData.length ===
                                0 ? (
                                <tr>
                                    <td
                                        colSpan="9"
                                        style={loadingStyle}
                                    >
                                        No escalated complaints found
                                    </td>
                                </tr>
                            ) : (
                                currentData.map((c) => {

                                  

                                    return (
                                        <tr key={c.complaintId}>
                                            <td style={tdStyle}>
                                                <b style={{ color: "#4318FF" }}>
                                                    {c.complaintNumber}
                                                </b>
                                            </td>

                                            <td style={tdStyle}>
                                                {c.citizenName}
                                            </td>

                                            <td style={tdStyle}>
                                                {c.departmentName}
                                            </td>

                                            <td style={tdStyle}>
                                                {new Date(c.createdAt).toLocaleDateString("en-GB")}
                                            </td>

                                            <td style={tdStyle}>
                                                <span
                                                    style={{
                                                        padding: "5px 10px",
                                                        borderRadius: "10px",
                                                        background: getPriorityStyle(c.priorityLevel).bg,
                                                        color: getPriorityStyle(c.priorityLevel).text,
                                                        fontSize: "12px",
                                                        fontWeight: "700"
                                                    }}
                                                >
                                                    {c.priorityLevel}
                                                </span>
                                            </td>

                                            <td style={tdStyle}>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        gap: "12px",
                                                        justifyContent: "center",
                                                        cursor: "pointer"
                                                    }}
                                                ><div
                                                    onClick={() => openDetails(c.complaintId)}
                                                    style={{
                                                        width: "38px",
                                                        height: "38px",
                                                        borderRadius: "10px",
                                                        background: "#EEF2FF",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        cursor: "pointer",
                                                        transition: "0.2s"
                                                    }}
                                                >
                                                        <FileText
                                                            size={20}
                                                            color="#4F46E5"
                                                        />
                                                    </div>

                                                    <div
                                                        onClick={() => openHistory(c.complaintId)}
                                                        style={{
                                                            width: "38px",
                                                            height: "38px",
                                                            borderRadius: "10px",
                                                            background: "#ECFDF5",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            cursor: "pointer",
                                                            transition: "0.2s"
                                                        }}
                                                    >
                                                        <History
                                                            size={20}
                                                            color="#16A34A"
                                                        />
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

                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "flex-end"
                    }}
                >
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        nextPage={nextPage}
                        prevPage={prevPage}
                        setCurrentPage={
                            setCurrentPage
                        }
                    />
                </div>
                {/* ================= DETAILS MODAL ================= */}

                {showDetailsModal && (
                    <div style={overlayStyle}>

                        <div style={modalStyle}>

                            {/* HEADER */}

                            <div style={modalHeaderStyle}>

                                <div>
                                    <h2 style={{ margin: 0, color: "#2B3674" }}>
                                        Complaint Details
                                    </h2>

                                    <p style={{ marginTop: "5px", color: "#64748B" }}>
                                        Full complaint information
                                    </p>
                                </div>

                                <X
                                    onClick={() =>
                                        setShowDetailsModal(false)
                                    }
                                    style={{ cursor: "pointer" }}
                                />
                            </div>

                            {/* LOADING */}

                            {loadingDetails ? (
                                <div style={loadingStyle}>
                                    Loading...
                                </div>
                            ) : (
                                <>
                                    {/* INFO CARDS */}

                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: "repeat(2,1fr)",
                                                gap: "15px",
                                                marginBottom: "20px"
                                            }}
                                        >
                                            <InfoCard title="Complaint Number" value={complaintDetails?.complaintNumber} />

                                            <InfoCard title="Citizen" value={complaintDetails?.citizenName} />

                                            <InfoCard title="Department" value={complaintDetails?.departmentName} />

                                            <InfoCard title="Category" value={complaintDetails?.categoryName} />

                                            <InfoCard title="Priority" value={complaintDetails?.priorityLevel} />

                                            <InfoCard title="Status" value={complaintDetails?.status} />

                                            <InfoCard title="Assigned Officer" value={complaintDetails?.assignedOfficer} />

                                            <InfoCard title="Escalated Officer" value={complaintDetails?.escalatedOfficer} />

                                            <InfoCard title="SLA Due Time" value={formatDateTime(complaintDetails?.slaDueTime)} />

                                            <InfoCard title="Resolved At" value={formatDateTime(complaintDetails?.resolvedAt)} />

                                            <InfoCard title="Closed At" value={formatDateTime(complaintDetails?.closedAt)} />

                                            <InfoCard title="Created At" value={formatDateTime(complaintDetails?.createdAt)} />

                                            <InfoCard title="Updated At" value={formatDateTime(complaintDetails?.updatedAt)} />

                                            <InfoCard title="Active" value={complaintDetails?.isActive ? "Yes" : "No"} />
                                        </div>

                                    {/* DESCRIPTION */}
                                        <div style={sectionStyle}>
                                            <h3>Description</h3>

                                            <div
                                                style={{
                                                    background: "#F8FAFC",
                                                    padding: "15px",
                                                    borderRadius: "12px",
                                                    lineHeight: "1.8"
                                                }}
                                            >
                                                {complaintDetails?.description}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: "1fr 1fr",
                                                gap: "15px",
                                                marginTop: "20px"
                                            }}
                                        >
                                            {/* IMAGES */}

                                            <div>
                                                <h3
                                                    style={{
                                                        marginBottom: "10px",
                                                        fontSize: "14px",
                                                        fontWeight: "600"
                                                    }}
                                                >
                                                    Complaint Images
                                                </h3>

                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexWrap: "wrap",
                                                        gap: "8px",
                                                        maxHeight: "320px",
                                                        overflowY: "auto"
                                                    }}
                                                >
                                                    {complaintDetails?.images?.map((img, i) => (
                                                        <img
                                                            key={i}
                                                            src={`https://localhost:7224/${img}`}
                                                            alt=""
                                                            style={{
                                                                width: "100%",
                                                                height: "250px",
                                                                objectFit: "cover",
                                                                borderRadius: "8px",
                                                                border: "1px solid #E5E7EB"
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* LOCATION */}

                                            <div>
                                                <h3
                                                    style={{
                                                        marginBottom: "10px",
                                                        fontSize: "14px",
                                                        fontWeight: "600"
                                                    }}
                                                >
                                                    Location
                                                </h3>

                                                {complaintDetails?.location?.latitude &&
                                                    complaintDetails?.location?.longitude ? (
                                                    <iframe
                                                        title="map"
                                                        width="100%"
                                                        height="250"
                                                        style={{
                                                            border: "1px solid #E5E7EB",
                                                            borderRadius: "8px"
                                                        }}
                                                        src={`https://maps.google.com/maps?q=${complaintDetails.location.latitude},${complaintDetails.location.longitude}&z=15&output=embed`}
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            padding: "12px",
                                                            background: "#F9FAFB",
                                                            borderRadius: "8px",
                                                            border: "1px solid #E5E7EB"
                                                        }}
                                                    >
                                                        {complaintDetails?.location?.address || "N/A"}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* ================= HISTORY MODAL ================= */}
                {showHistoryModal && (
                    <div style={overlayStyle}>
                        <div style={modalStyle}>

                            {/* HEADER */}
                            <div style={modalHeaderStyle}>
                                <div>
                                    <h2 style={{ margin: 0, color: "#2B3674" }}>
                                        Complaint History
                                    </h2>
                                    <p style={{ marginTop: "5px", color: "#64748B" }}>
                                        Status change timeline
                                    </p>
                                </div>

                                <X
                                    onClick={() => setShowHistoryModal(false)}
                                    style={{ cursor: "pointer" }}
                                />
                            </div>

                            {/* LOADING */}
                            {loadingHistory ? (
                                <div style={loadingStyle}>Loading...</div>
                            ) : historyData.length === 0 ? (
                                <div style={loadingStyle}>No history found</div>
                            ) : (
                                <div style={{ marginTop: "10px" }}>

                                            {historyData.map((h, i) => {

                                                const isLast = i === historyData.length - 1;

                                                const user = h.changedBy?.user || "Unknown User";
                                                const role = h.changedBy?.role || "-";
                                                const email = h.changedBy?.email || "-";
                                                const mobile = h.changedBy?.mobile || "-";

                                                return (
                                                    <div
                                                        key={i}
                                                        style={{
                                                            display: "flex",
                                                            gap: "16px",
                                                            position: "relative",
                                                            paddingBottom: isLast ? 0 : "26px"
                                                        }}
                                                    >

                                                        {/* TIMELINE */}
                                                        <div style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            alignItems: "center"
                                                        }}>
                                                            <div style={{
                                                                width: "12px",
                                                                height: "12px",
                                                                borderRadius: "50%",
                                                                background: "#4F46E5",
                                                                border: "3px solid #E0E7FF"
                                                            }} />

                                                            {!isLast && (
                                                                <div style={{
                                                                    width: "2px",
                                                                    flex: 1,
                                                                    background: "#E5E7EB",
                                                                    marginTop: "4px"
                                                                }} />
                                                            )}
                                                        </div>

                                                        {/* CARD */}
                                                        <div style={{
                                                            flex: 1,
                                                            background: "#fff",
                                                            border: "1px solid #E5E7EB",
                                                            borderRadius: "14px",
                                                            padding: "14px",
                                                            boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                                                        }}>

                                                            {/* USER HEADER */}
                                                            <div style={{
                                                                display: "flex",
                                                                justifyContent: "space-between",
                                                                alignItems: "center",
                                                                marginBottom: "12px"
                                                            }}>

                                                                {/* LEFT USER INFO */}
                                                                <div style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    gap: "12px"
                                                                }}>

                                                                    {/* CLEAN CIRCLE (NO AVATAR LIBRARY) */}
                                                                    <div style={{
                                                                        width: "42px",
                                                                        height: "42px",
                                                                        borderRadius: "50%",
                                                                        background: "#EEF2FF",
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "center",
                                                                        fontWeight: "700",
                                                                        color: "#4F46E5",
                                                                        fontSize: "16px"
                                                                    }}>
                                                                        {user.charAt(0)}
                                                                    </div>

                                                                    <div>
                                                                        <div style={{
                                                                            fontWeight: "600",
                                                                            fontSize: "14px",
                                                                            color: "#111827"
                                                                        }}>
                                                                            {user}
                                                                        </div>

                                                                        <div style={{
                                                                            fontSize: "12px",
                                                                            color: "#6B7280"
                                                                        }}>
                                                                            {role}
                                                                        </div>

                                                                        <div style={{
                                                                            fontSize: "11px",
                                                                            color: "#9CA3AF"
                                                                        }}>
                                                                            {email} • {mobile}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* TIME */}
                                                                <div style={{
                                                                    fontSize: "11px",
                                                                    color: "#9CA3AF"
                                                                }}>
                                                                    {formatDateTime(h.changedAt)}
                                                                </div>
                                                            </div>
                                                             
                                                            {/* STATUS FLOW */}
                                                            <div style={{
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                gap: "10px"
                                                            }}>

                                                                {/* OLD STATUS CARD */}
                                                                <div style={{
                                                                    background: "#FEF2F2",
                                                                    border: "1px solid #FECACA",
                                                                    padding: "10px",
                                                                    borderRadius: "10px"
                                                                }}>

                                                                    <div style={{ fontSize: "11px", color: "#991B1B", marginBottom: "5px" }}>
                                                                        OLD STATUS
                                                                    </div>

                                                                    <div style={{ fontWeight: "600", color: "#B91C1C" }}>
                                                                        {h.oldStatus?.status || "-"}
                                                                    </div>

                                                                    <div style={{ fontSize: "12px", marginTop: "4px", color: "#7F1D1D" }}>
                                                                        {h.oldStatus?.user} ({h.oldStatus?.role})
                                                                    </div>

                                                                    <div style={{ fontSize: "11px", color: "#991B1B" }}>
                                                                        {h.oldStatus?.email} • {h.oldStatus?.mobile}
                                                                    </div>
                                                                </div>

                                                                {/* ARROW */}
                                                                <div style={{
                                                                    textAlign: "center",
                                                                    fontSize: "18px",
                                                                    fontWeight: "700",
                                                                    color: "#6366F1"
                                                                }}>
                                                                    ↓
                                                                </div>

                                                                {/* NEW STATUS CARD */}
                                                                <div style={{
                                                                    background: "#ECFDF5",
                                                                    border: "1px solid #A7F3D0",
                                                                    padding: "10px",
                                                                    borderRadius: "10px"
                                                                }}>

                                                                    <div style={{ fontSize: "11px", color: "#065F46", marginBottom: "5px" }}>
                                                                        NEW STATUS
                                                                    </div>

                                                                    <div style={{ fontWeight: "600", color: "#047857" }}>
                                                                        {h.newStatus?.status || "-"}
                                                                    </div>

                                                                    <div style={{ fontSize: "12px", marginTop: "4px", color: "#065F46" }}>
                                                                        {h.newStatus?.user} ({h.newStatus?.role})
                                                                    </div>

                                                                    <div style={{ fontSize: "11px", color: "#065F46" }}>
                                                                        {h.newStatus?.email} • {h.newStatus?.mobile}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* REMARKS */}
                                                            {h.remarks && (
                                                                <div style={{
                                                                    marginTop: "10px",
                                                                    fontSize: "12px",
                                                                    color: "#475569",
                                                                    background: "#F8FAFC",
                                                                    padding: "8px",
                                                                    borderRadius: "8px"
                                                                }}>
                                                                    <strong>Remarks:</strong> {h.remarks}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                </div>
                            )}
                        </div>
                    </div>
                               )}

            </div> {/* main container */}

        </OfficerLayout>
    );
};

export default OfficerEscalation;