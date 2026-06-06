import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { adminTheme as theme } from "../../services/AdminServices/AdminTheme";
import {
    ClipboardList,
    UserCircle,
    ArrowRight,
    CalendarDays
} from "lucide-react";

import { getComplaintAssignments } from "../../services/AdminServices/AdminService";
import { showError } from "../../services/alertService";

import usePagination from "../../services/usePagination";
import Pagination from "../../Components/AdminComponents/Pagination";

const AdminComplaintAssignmentList = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadAssignments = async () => {
        try {
            setLoading(true);

            const res = await getComplaintAssignments();

            setAssignments(res.data || []);
        } catch (error) {
            console.error(error);
            showError("Failed to load complaint assignments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAssignments();
    }, []);

    const {
        currentPage,
        totalPages,
        currentData,
        nextPage,
        prevPage,
        setCurrentPage
    } = usePagination(assignments, 5);

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case "assigned":
                return {
                    background: "#E3F2FD",
                    color: "#1976D2"
                };

            case "in progress":
                return {
                    background: "#FFF3E0",
                    color: "#F57C00"
                };

            case "completed":
                return {
                    background: "#E8F5E9",
                    color: "#2E7D32"
                };

            case "rejected":
                return {
                    background: "#FFEBEE",
                    color: "#D32F2F"
                };

            case "reassigned":
                return {
                    background: "#F3E5F5",
                    color: "#7B1FA2"
                };

            case "escalated":
                return {
                    background: "#FFF8E1",
                    color: "#FF8F00"
                };

            case "forwarded":
                return {
                    background: "#E0F7FA",
                    color: "#00838F"
                };

            default:
                return {
                    background: "#F4F7FE",
                    color: "#707EAE"
                };
        }
    };

    return (
        <AdminLayout pageTitle="Complaint Assignments">
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "25px"
                }}
            >
                {/* HEADER */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <div>
                        {/*<h2*/}
                        {/*    style={{*/}
                        {/*        margin: 0,*/}
                        {/*        color: theme.colors.text.main*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    Complaint Assignments*/}
                        {/*</h2>*/}

                        <p
                            style={{
                                color: theme.colors.text.gray,
                                marginTop: "5px",
                                fontSize: "14px"
                            }}
                        >
                            View complaint assignment history
                        </p>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            background: "white",
                            padding: "12px 20px",
                            borderRadius: "14px",
                            boxShadow: theme.shadows.card,
                            color: theme.colors.brand.primary,
                            fontWeight: "700"
                        }}
                    >
                        <ClipboardList size={20} />
                        Total: {assignments.length}
                    </div>
                </div>

                {/* TABLE */}
                <div
                    style={{
                        background: "white",
                        borderRadius: theme.radius.card,
                        boxShadow: theme.shadows.card,
                        overflow: "hidden"
                    }}
                >
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse"
                        }}
                    >
                        <thead>
                            <tr
                                style={{
                                    background: "#FAFCFF",
                                    borderBottom: "1px solid #F4F7FE"
                                }}
                            >
                                <th style={thStyle}>COMPLAINT</th>
                                <th style={thStyle}>ASSIGNED BY</th>
                                <th style={thStyle}>ASSIGNED TO</th>
                                <th style={thStyle}>STATUS</th>
                                <th style={thStyle}>REMARKS</th>
                                <th style={thStyle}>DATE</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        style={{
                                            padding: "40px",
                                            textAlign: "center",
                                            color: theme.colors.text.gray
                                        }}
                                    >
                                        Loading assignments...
                                    </td>
                                </tr>
                            ) : currentData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        style={{
                                            padding: "40px",
                                            textAlign: "center",
                                            color: theme.colors.text.gray
                                        }}
                                    >
                                        No assignments found
                                    </td>
                                </tr>
                            ) : (
                                currentData.map((item) => (
                                    <tr
                                        key={item.assignmentId}
                                        style={{
                                            borderBottom: "1px solid #F4F7FE",
                                            transition: "0.2s"
                                        }}
                                    >
                                        {/* Complaint */}
                                        <td style={tdStyle}>
                                            <div
                                                style={{
                                                    fontWeight: "700",
                                                    color: "#2B3674",
                                                    fontSize: "15px"
                                                }}
                                            >
                                                {item.complaintNumber}
                                            </div>

                                            <div
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#A3AED0",
                                                    marginTop: "3px"
                                                }}
                                            >
                                                Complaint ID #{item.complaintId}
                                            </div>
                                        </td>

                                        {/* Assigned By */}
                                        <td style={tdStyle}>
                                            <div
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                    background: "#F4F7FE",
                                                    padding: "10px 14px",
                                                    borderRadius: "14px"
                                                }}
                                            >
                                                <UserCircle size={22} color="#4318FF" />

                                                <div>
                                                    <div
                                                        style={{
                                                            fontWeight: "700",
                                                            color: "#2B3674"
                                                        }}
                                                    >
                                                        {item.assignedBy?.name}
                                                    </div>

                                                    <span
                                                        style={{
                                                            fontSize: "11px",
                                                            background: "#E9E3FF",
                                                            color: "#4318FF",
                                                            padding: "3px 10px",
                                                            borderRadius: "20px",
                                                            fontWeight: "600"
                                                        }}
                                                    >
                                                        {item.assignedBy?.role}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Assigned To */}
                                        <td style={tdStyle}>
                                            <div
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                    background: "#ECFDF3",
                                                    padding: "10px 14px",
                                                    borderRadius: "14px"
                                                }}
                                            >
                                                <ArrowRight size={18} color="#05CD99" />
                                                <div>
                                                    <div
                                                        style={{
                                                            fontWeight: "700",
                                                            color: "#2B3674",
                                                            fontSize: "14px"
                                                        }}
                                                    >
                                                        {item.assignedTo?.name}
                                                    </div>

                                                    <div
                                                        style={{
                                                            marginTop: "4px",
                                                            display: "inline-block",
                                                            background: "#E9E3FF",
                                                            color: "#4318FF",
                                                            padding: "3px 10px",
                                                            borderRadius: "20px",
                                                            fontSize: "11px",
                                                            fontWeight: "600"
                                                        }}
                                                    >
                                                        {item.assignedTo?.role}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Assignment Status */}
                                        <td style={tdStyle}>
                                            <span
                                                style={{
                                                    ...getStatusStyle(item.assignmentStatus),
                                                    padding: "8px 14px",
                                                    borderRadius: "10px",
                                                    fontSize: "12px",
                                                    fontWeight: "700"
                                                }}
                                            >
                                                {item.assignmentStatus}
                                            </span>
                                        </td>

                                        {/* Remarks */}
                                        <td style={tdStyle}>
                                            <div
                                                style={{
                                                    maxWidth: "250px",
                                                    color: "#707EAE",
                                                    fontSize: "13px"
                                                }}
                                            >
                                                {item.remarks || "-"}
                                            </div>
                                        </td>

                                        {/* Date */}
                                        <td style={tdStyle}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    color: "#707EAE",
                                                    fontWeight: "500"
                                                }}
                                            >
                                                <CalendarDays
                                                    size={16}
                                                    color="#4318FF"
                                                />

                                                {formatDate(item.assignedAt)}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && assignments.length > 0 && (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end"
                        }}
                    >
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            nextPage={nextPage}
                            prevPage={prevPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

const thStyle = {
    padding: "18px",
    textAlign: "left",
    color: "#A3AED0",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.5px"
};

const tdStyle = {
    padding: "20px",
    color: "#2B3674",
    fontSize: "14px",
    verticalAlign: "middle"
};

export default AdminComplaintAssignmentList;