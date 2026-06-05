import React, { useEffect, useState} from "react";
import { theme } from "../../services/theme";
import Pagination from "../../Components/AdminComponents/Pagination";
import usePagination from "../../services/usePagination";
import { useTranslationContext } from "../../Context/TranslationContext";
import { showError, showSuccessToast } from "../../services/alertService";
import {
    MessageSquareMore,
    RefreshCw } from "lucide-react";
import performanceIcon from "../../assets/good-feedback.png";

const MyComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    //const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackComplaint, setFeedbackComplaint] = useState(null);
    const [existingFeedback, setExistingFeedback] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showViewFeedbackModal, setShowViewFeedbackModal] = useState(false);
    const [viewFeedbackData, setViewFeedbackData] = useState(null);

    const [rating, setRating] = useState(0);
    const [comments, setComments] = useState("");
    const [isSatisfied, setIsSatisfied] = useState(true);
    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const { t } = useTranslationContext();

    let user = null;

    try {
        user = JSON.parse(sessionStorage.getItem("user"));
    } catch {
        user = null;
    }
    const userId = user?.userId;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const token = sessionStorage.getItem("token");

                const res = await fetch(
                    `https://localhost:7224/api/Complaint/user/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }

                const text = await res.text();

                const data = text ? JSON.parse(text) : [];

                setComplaints(data);

            } catch (err) {
                console.error("Error fetching complaints:", err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchData();
        }
    }, [userId]);

    const filteredComplaints = React.useMemo(() => {
        let temp = complaints;

        if (searchTerm.trim()) {
            const words = searchTerm.toLowerCase().split(" ");

            temp = temp.filter(c => {
                const text = `${c.title || ""} ${c.description || ""}`.toLowerCase();

                // every word must exist somewhere
                return words.every(word => text.includes(word));
            });
        }
        if (statusFilter !== "All") {
            temp = temp.filter(c => c.status === statusFilter);
        }
        if (priorityFilter !== "All") {
            temp = temp.filter(c => c.priority === priorityFilter);
        }
        return temp;
    }, [complaints, searchTerm, statusFilter, priorityFilter]);


    // 3. Pass the calculated filteredComplaints to your pagination hook
    const {
        currentPage, totalPages, currentData, nextPage, prevPage, setCurrentPage
    } = usePagination(filteredComplaints, 10);

    const openModal = (complaint) => {
        setSelectedComplaint(complaint);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedComplaint(null);
    };

    const resetFeedbackForm = () => {

        setRating(0);
        setComments("");
        setIsSatisfied(true);
        setExistingFeedback(null);
        setFeedbackComplaint(null);
        setIsEditMode(false);

    };

    //const openAddFeedbackModal = (complaint) => {

    //    resetFeedbackForm();

    //    setFeedbackComplaint(complaint);
    //    setShowFeedbackModal(true);

    //};

    const closeFeedbackModal = () => {

        setShowFeedbackModal(false);

        resetFeedbackForm();

    };


    // Stats Calculation
    const stats = {
        total: complaints.length,
        pending: complaints.filter(c => c.status === "Submitted").length,
        resolved: complaints.filter(c => c.status === "Resolved").length
    };


    const getStepStatus = (step) => {
        const statusMap = { "Submitted": 1, "In Progress": 2, "Resolved": 3 };
        return statusMap[selectedComplaint?.status] >= step;
    };

    const submitFeedback = async () => {

        try {

            if (!feedbackComplaint) {
                showError("Complaint not found");
                return;
            }

            if (rating === 0) {
                showError("Please select rating");
                return;
            }

            const payload = {
                complaintId: feedbackComplaint.complaintId,
                citizenId: userId,
                rating,
                comments,
                isSatisfied
            };

            const response = await fetch(

                isEditMode
                    ? `https://localhost:7224/api/Feedback/${existingFeedback.feedbackId}`
                    : "https://localhost:7224/api/Feedback",

                {
                    method: isEditMode ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (response.ok) {

                showSuccessToast(
                    isEditMode
                        ? "Feedback updated successfully"
                        : "Feedback submitted successfully"
                );

                closeFeedbackModal();

                // Update UI instantly
                setComplaints((prev) =>
                    prev.map((c) =>
                        c.complaintId === feedbackComplaint.complaintId
                            ? { ...c, hasFeedback: true }
                            : c
                    )
                );

            } else {

                const errorText = await response.text();

                console.error(errorText);

                alert(errorText);

            }

        } catch (error) {

            console.error("Submit feedback error:", error);

            showError("Something went wrong");

        }
    };

    const showFeedback = async (complaint) => {

        try {

            const response = await fetch(
                `https://localhost:7224/api/Feedback/${complaint.complaintId}`
            );

            const data = await response.json();

            setViewFeedbackData(data);

            setShowViewFeedbackModal(true);

        } catch (error) {

            console.error(error);

        }
    };
    const editFeedback = async (complaint) => {

        try {

            const response = await fetch(
                `https://localhost:7224/api/Feedback/${complaint.complaintId}`
            );

            const data = await response.json();

            setFeedbackComplaint(complaint);

            setRating(data.rating || 0);
            setComments(data.comments || "");
            setIsSatisfied(data.isSatisfied);

            setExistingFeedback(data);

            setIsEditMode(true);

            setShowFeedbackModal(true);

        } catch (error) {

            console.error(error);

        }
    };

    const styles = {
        pageWrapper: {
            backgroundColor: theme.colors.background.secondary,
            minHeight: "100vh",
            fontFamily: theme.fonts.primary,
        },
        blueBanner: {
            backgroundColor: theme.colors.primary[600],
            padding: "60px 5% 100px 5%",
            color: "white",
        },
        headerText: { fontSize: "2rem", fontWeight: "700", margin: "0 0 10px 0" },
        subText: { opacity: 0.9, fontSize: "1rem" },
        mainContainer: {
            maxWidth: "1200px",
            margin: "-60px auto 40px",
            padding: "0 20px",
        },
        statsGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            marginBottom: "30px"
        },
        statCard: (color) => ({
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "15px",
            boxShadow: theme.shadows.md,
            borderLeft: `6px solid ${color}`,
            textAlign: "center"
        }),
        filterSection: {
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "12px",
            display: "flex",
            gap: "15px",
            marginBottom: "20px",
            boxShadow: theme.shadows.sm,
            alignItems: "center"
        },
        input: {
            padding: "10px 15px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            fontSize: "0.9rem",
            flex: 2
        },
        select: {
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            flex: 1,
            backgroundColor: "white"
        },
        tableCard: {
            backgroundColor: "white",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: theme.shadows.lg,
            marginBottom: "20px"
        },
        table: { width: "100%", borderCollapse: "collapse" },
        th: {
            textAlign: "left",
            padding: "15px",
            backgroundColor: "#f8fafc",
            color: theme.colors.text.tertiary,
            fontSize: "0.75rem",
            textTransform: "uppercase",
            borderBottom: "1px solid #edf2f7"
        },
        td: { padding: "15px", borderBottom: "1px solid #edf2f7", fontSize: "0.9rem" },
        badge: (status) => {
            let colors = { bg: "#f1f5f9", text: "#475569" };
            if (status === "High" || status === "Rejected") colors = { bg: "#fee2e2", text: "#ef4444" };
            if (status === "Medium" || status === "Submitted") colors = { bg: "#fef3c7", text: "#d97706" };
            if (status === "Low" || status === "Resolved") colors = { bg: "#dcfce7", text: "#10b981" };
            if (status === "In Progress") colors = { bg: "#eff6ff", text: "#3b82f6" };

            return {
                backgroundColor: colors.bg,
                color: colors.text,
                padding: "5px 12px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontWeight: "600"
            };
        },
        viewBtn: {
            backgroundColor: theme.colors.primary[600],
            color: "white",
            border: "none",
            padding: "6px 15px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "0.2s"
        },
        feedbackBtn: {
            background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
            color: "white",
            border: "none",
            padding: "6px 15px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            boxShadow: "0 4px 10px rgba(245,158,11,0.3)"
        },
        modalOverlay: {
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center",
            alignItems: "center", zIndex: 2000
        },
        modalContent: {
            backgroundColor: "white", padding: "30px", borderRadius: "16px",
            width: "90%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto"
        },
        tracker: {
            display: "flex", justifyContent: "space-between", margin: "30px 0",
            position: "relative"
        },
        step: (active) => ({
            zIndex: 1, backgroundColor: active ? theme.colors.primary[500] : "#e2e8f0",
            color: active ? "white" : "#64748b", width: "30px", height: "30px",
            borderRadius: "50%", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "12px", fontWeight: "bold"
        })
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.blueBanner}>
                <h1 style={styles.headerText}>{t("my_complaints")}</h1>
                <p style={styles.subText}>{t("track_manage")}</p>
            </div>

            <div style={styles.mainContainer}>
                {/* Stats */}
                <div style={styles.statsGrid}>
                    <div style={styles.statCard(theme.colors.primary[500])}>
                        <div style={{ fontSize: "1.5rem" }}>📋</div>
                        <h2 style={{ margin: "10px 0 5px" }}>{stats.total}</h2>
                        <p style={{ color: "#64748b", margin: 0 }}>{t("total_complaints")}</p>
                    </div>
                    <div style={styles.statCard("#f59e0b")}>
                        <div style={{ fontSize: "1.5rem" }}>⏳</div>
                        <h2 style={{ margin: "10px 0 5px" }}>{stats.pending}</h2>
                        <p style={{ color: "#64748b", margin: 0 }}>{t("pending")}</p>
                    </div>
                    <div style={styles.statCard("#10b981")}>
                        <div style={{ fontSize: "1.5rem" }}>✅</div>
                        <h2 style={{ margin: "10px 0 5px" }}>{stats.resolved}</h2>
                        <p style={{ color: "#64748b", margin: 0 }}>{t("resolved")}</p>
                    </div>
                </div>

                {/* Filters */}
                <div style={styles.filterSection}>
                    <input
                        style={styles.input}
                        placeholder="Search by title..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select style={styles.select} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="All">{t("all_status")}</option>
                        <option value="Submitted">{t("submitted")}</option>
                        <option value="In Progress">{t("in_progress_step")}</option>
                        <option value="Resolved">{t("resolved_step")}</option>
                    </select>
                    <select style={styles.select} onChange={(e) => setPriorityFilter(e.target.value)}>
                        <option value="All">{t("all_priority")}</option>
                        <option value="High">{t("high")}</option>
                        <option value="Medium">{t("medium")}</option>
                        <option value="Low">{t("low")}</option>
                    </select>
                </div>

                {/* Table */}
                <div style={styles.tableCard}>
                    {loading ? (
                        <p style={{ padding: "40px", textAlign: "center" }}>{t("loading_complaints")}</p>
                    ) : (
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                        <th style={styles.th}>{t("complaint_details_1")}</th>
                                        <th style={styles.th}>{t("status")}</th>
                                        <th style={styles.th}>{t("priority")}</th>
                                        <th style={styles.th}>{t("date")}</th>
                                        <th style={styles.th}>{t("action")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.length > 0 ? (currentData.map(c => (
                                    <tr key={c.complaintId}>
                                        <td style={styles.td}>
                                            <div style={{ fontWeight: "600" }}>{c.title}</div>
                                            <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>ID: {c.complaintId}</div>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={styles.badge(c.status)}>{c.status}</span>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={styles.badge(c.priority)}>{c.priority}</span>
                                        </td>
                                        <td style={styles.td}>
                                            {new Date(c.date).toLocaleDateString('en-GB')}
                                        </td>
                                        <td style={styles.td}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "10px",
                                                    alignItems: "center"
                                                }}
                                            >
                                                {/* View Button */}
                                                <button
                                                    style={styles.viewBtn}
                                                    onClick={() => openModal(c)}
                                                >
                                                    {t("view_complaints")}
                                                </button>

                                                {/* Feedback Buttons */}
                                                {c.status === "Resolved" && (
                                                    c.hasFeedback ? (
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                gap: "10px",
                                                                alignItems: "center",
                                                                background: "#f8fafc",
                                                                padding: "6px",
                                                                borderRadius: "16px",
                                                                width: "fit-content"
                                                            }}
                                                        >

                                                            {/* Show Feedback */}
                                                            <button
                                                                onClick={() => showFeedback(c)}
                                                                style={{
                                                                    width: "44px",
                                                                    height: "44px",
                                                                    border: "none",
                                                                    borderRadius: "14px",
                                                                    background: "linear-gradient(135deg,#ecfdf5,#d1fae5)",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    cursor: "pointer",
                                                                    boxShadow: "0 4px 10px rgba(16,185,129,0.15)",
                                                                    transition: "all 0.25s ease"
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.currentTarget.style.transform = "translateY(-2px)";
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.currentTarget.style.transform = "translateY(0)";
                                                                }}
                                                                title="Show Feedback"
                                                            >
                                                                <MessageSquareMore size={18} color="#059669" />
                                                            </button>

                                                            {/* Edit Feedback */}
                                                            <button
                                                                onClick={() => editFeedback(c)}
                                                                style={{
                                                                    width: "44px",
                                                                    height: "44px",
                                                                    border: "none",
                                                                    borderRadius: "14px",
                                                                    background: "linear-gradient(135deg,#eff6ff,#dbeafe)",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    cursor: "pointer",
                                                                    boxShadow: "0 4px 10px rgba(37,99,235,0.15)",
                                                                    transition: "all 0.25s ease"
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.currentTarget.style.transform = "translateY(-2px)";
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.currentTarget.style.transform = "translateY(0)";
                                                                }}
                                                                title="Edit Feedback"
                                                            >
                                                                <RefreshCw size={18} color="#2563eb" />
                                                            </button>

                                                        </div>
                                                    ) : (

                                                        /* Add Feedback */
                                                        <button
                                                            onClick={() => {
                                                                setFeedbackComplaint(c);
                                                                setShowFeedbackModal(true);
                                                            }}
                                                            style={{
                                                                width: "56px",
                                                                height: "44px",
                                                                border: "none",
                                                                borderRadius: "14px",
                                                                background: "linear-gradient(135deg,#fff7ed,#ffedd5)",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                cursor: "pointer",
                                                                boxShadow: "0 4px 12px rgba(245,158,11,0.18)",
                                                                transition: "all 0.25s ease"
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.transform = "translateY(-2px)";
                                                                e.currentTarget.style.boxShadow =
                                                                    "0 8px 18px rgba(245,158,11,0.24)";
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.transform = "translateY(0)";
                                                                e.currentTarget.style.boxShadow =
                                                                    "0 4px 12px rgba(245,158,11,0.18)";
                                                            }}
                                                            title=""
                                                        >
                                                            <img
                                                                src={performanceIcon}
                                                                alt="feedback"
                                                                style={{
                                                                    width: "24px",
                                                                    height: "24px",
                                                                    objectFit: "contain"
                                                                }}
                                                            />
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) 

                                ): (
                                            <tr><td colSpan="5" style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>{t("no_complaints")}</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    nextPage={nextPage}
                    prevPage={prevPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>

            {/* Modal */}
            {showModal && selectedComplaint && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <h2 style={{ margin: 0 }}>{selectedComplaint.title}</h2>
                            <button onClick={closeModal} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}>×</button>
                        </div>
                        {/*<p style={{ color: "#94a3b8", fontSize: "0.8rem" }}>Complaint ID: {selectedComplaint.complaintId}</p>*/}

                        <hr style={{ margin: "20px 0", border: "0.5px solid #edf2f7" }} />

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                            <div>
                                <h4 style={{ margin: "0 0 5px 0", fontSize: "0.8rem", color: "#64748b" }}>{t("status")}</h4>
                                <span style={styles.badge(selectedComplaint.status)}>{selectedComplaint.status}</span>
                            </div>
                            <div>
                                <h4 style={{ margin: "0 0 5px 0", fontSize: "0.8rem", color: "#64748b" }}>{t("priority")}</h4>
                                <span style={styles.badge(selectedComplaint.priority)}>{selectedComplaint.priority}</span>
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>

                            <div>
                                <h4 style={{ margin: "0 0 5px 0", fontSize: "0.8rem", color: "#64748b" }}>
                                    Assigned Officer
                                </h4>

                                <p style={{ fontSize: "0.9rem", margin: 0, fontWeight: "600" }}>
                                    {selectedComplaint.assignedOfficerName || "Not Assigned Yet"}
                                </p>
                            </div>

                            <div>
                                <h4 style={{ margin: "0 0 5px 0", fontSize: "0.8rem", color: "#64748b" }}>
                                    Assigned At
                                </h4>

                                <p style={{ fontSize: "0.9rem", margin: 0 }}>
                                    {selectedComplaint.assignedAt
                                        ? new Date(selectedComplaint.assignedAt).toLocaleString("en-GB")
                                        : "Not Assigned"}
                                </p>
                            </div>

                        </div>

                        <div style={{ marginTop: "20px" }}>
                            <h4 style={{ margin: "0 0 5px 0", fontSize: "0.8rem", color: "#64748b" }}>{t("modal_description")}</h4>
                            <p style={{ fontSize: "0.9rem", lineHeight: "1.5" }}>{selectedComplaint.description}</p>
                        </div>

                        <div style={{ marginTop: "20px" }}>
                            <h4 style={{ margin: "0 0 5px 0", fontSize: "0.8rem", color: "#64748b" }}>{t("modal_address")}</h4>
                            <p style={{ fontSize: "0.9rem" }}>{selectedComplaint.address || "No address provided"}</p>
                        </div>

                        <div style={{ marginTop: "20px" }}>
                            <h4 style={{ margin: "0 0 10px 0", fontSize: "0.8rem", color: "#64748b" }}>{t("evidence")}</h4>
                            {selectedComplaint.imageUrl ? (
                                <img src={selectedComplaint.imageUrl} alt="Complaint" style={{ width: "100%", borderRadius: "8px" }} />
                            ) : (
                                    <div style={{ padding: "20px", background: "#f8fafc", textAlign: "center", borderRadius: "8px", color: "#94a3b8" }}>{t("no_image")}</div>
                            )}
                        </div>

                        {/* Progress Tracker */}
                        <div style={{ marginTop: "30px" }}>
                            <h4 style={{ margin: "0 0 15px 0", fontSize: "0.8rem", color: "#64748b", textAlign: "center" }}>{t("progress")}</h4>
                            <div style={styles.tracker}>
                                <div style={{ position: "absolute", top: "15px", left: 0, right: 0, height: "2px", background: "#e2e8f0", zIndex: 0 }}></div>
                                <div style={{ ...styles.step(getStepStatus(1)) }}>1</div>
                                <div style={{ ...styles.step(getStepStatus(2)) }}>2</div>
                                <div style={{ ...styles.step(getStepStatus(3)) }}>3</div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#64748b", marginTop: "-15px" }}>
                                <span>{t("submitted")}</span>
                                <span>{t("in_progress_step")}</span>
                                <span>{t("resolved_step")}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showFeedbackModal && (
                <div style={styles.modalOverlay}>

                    <div style={{
                        background: "white",
                        width: "90%",
                        maxWidth: "520px",
                        borderRadius: "22px",
                        overflow: "hidden",
                        boxShadow: "0 20px 50px rgba(0,0,0,0.25)"
                    }}>

                        {/* HEADER (same style as view feedback) */}
                        <div style={{
                            background: "linear-gradient(135deg,#f59e0b,#fbbf24)",
                            color: "white",
                            padding: "25px"
                        }}>

                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>

                                <div>
                                    <h2 style={{
                                        margin: 0,
                                        fontSize: "1.5rem",
                                        fontWeight: "700"
                                    }}>
                                        {isEditMode ? "✏ Edit Feedback" : "⭐ Add Feedback"}
                                    </h2>

                                    <p style={{
                                        marginTop: "6px",
                                        opacity: 0.9,
                                        fontSize: "0.9rem"
                                    }}>
                                        Share your experience about complaint resolution
                                    </p>
                                </div>

                                <button
                                    onClick={closeFeedbackModal}
                                    style={{
                                        background: "rgba(255,255,255,0.2)",
                                        border: "none",
                                        color: "white",
                                        width: "35px",
                                        height: "35px",
                                        borderRadius: "50%",
                                        cursor: "pointer",
                                        fontSize: "18px",
                                        fontWeight: "bold"
                                    }}
                                >
                                    ✕
                                </button>

                            </div>
                        </div>

                        {/* BODY */}
                        <div style={{ padding: "30px" }}>

                            {/* Rating */}
                            <div style={{
                                background: "#f8fafc",
                                borderRadius: "16px",
                                padding: "25px",
                                textAlign: "center",
                                marginBottom: "25px"
                            }}>
                                <h3 style={{ margin: "0 0 10px 0" }}>
                                    Rate Resolution
                                </h3>

                                <div style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "8px",
                                    marginTop: "15px"
                                }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            onClick={() => setRating(star)}
                                            style={{
                                                fontSize: "42px",
                                                cursor: "pointer",
                                                color: rating >= star ? "#fbbf24" : "#d1d5db"
                                            }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>

                                <p style={{
                                    marginTop: "12px",
                                    fontWeight: "600",
                                    color: "#475569"
                                }}>
                                    {rating}/5 Rating
                                </p>
                            </div>

                            {/* Satisfaction */}
                            <div style={{ marginBottom: "25px" }}>
                                <h4 style={{ marginBottom: "12px" }}>Satisfaction</h4>

                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button
                                        onClick={() => setIsSatisfied(true)}
                                        style={{
                                            flex: 1,
                                            padding: "12px",
                                            border: "none",
                                            borderRadius: "12px",
                                            background: isSatisfied ? "#10b981" : "#e2e8f0",
                                            color: isSatisfied ? "white" : "#475569",
                                            cursor: "pointer"
                                        }}
                                    >
                                        😊 Satisfied
                                    </button>

                                    <button
                                        onClick={() => setIsSatisfied(false)}
                                        style={{
                                            flex: 1,
                                            padding: "12px",
                                            border: "none",
                                            borderRadius: "12px",
                                            background: !isSatisfied ? "#ef4444" : "#e2e8f0",
                                            color: !isSatisfied ? "white" : "#475569",
                                            cursor: "pointer"
                                        }}
                                    >
                                        😔 Unsatisfied
                                    </button>
                                </div>
                            </div>

                            {/* Comments */}
                            <div>
                                <h4 style={{ marginBottom: "12px" }}>Comments</h4>

                                <textarea
                                    rows="5"
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    placeholder="Write your feedback..."
                                    style={{
                                        width: "100%",
                                        padding: "15px",
                                        borderRadius: "14px",
                                        border: "1px solid #e2e8f0",
                                        resize: "none",
                                        fontSize: "0.95rem"
                                    }}
                                />
                            </div>

                            {/* Footer */}
                            <div style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                marginTop: "30px"
                            }}>
                                <button
                                    onClick={submitFeedback}
                                    style={{
                                        background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                                        color: "white",
                                        border: "none",
                                        padding: "12px 24px",
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                        fontWeight: "600",
                                        boxShadow: "0 4px 10px rgba(37,99,235,0.3)"
                                    }}
                                >
                                    {isEditMode ? "Update Feedback" : "Submit Feedback"}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/*feedback*/}
            {showViewFeedbackModal && viewFeedbackData && (

                <div style={styles.modalOverlay}>

                    <div style={{
                        background: "white",
                        width: "90%",
                        maxWidth: "520px",
                        borderRadius: "22px",
                        overflow: "hidden",
                        boxShadow: "0 20px 50px rgba(0,0,0,0.25)"
                    }}>

                        {/* Header */}
                        <div style={{
                            background: "linear-gradient(135deg,#10b981,#059669)",
                            color: "white",
                            padding: "25px"
                        }}>

                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>

                                <div>

                                    <h2 style={{
                                        margin: 0,
                                        fontSize: "1.5rem",
                                        fontWeight: "700"
                                    }}>
                                        👁 Feedback Details
                                    </h2>

                                    <p style={{
                                        marginTop: "6px",
                                        opacity: 0.9,
                                        fontSize: "0.9rem"
                                    }}>
                                        Citizen submitted feedback
                                    </p>

                                </div>

                                <button
                                    onClick={() => setShowViewFeedbackModal(false)}
                                    style={{
                                        background: "rgba(255,255,255,0.2)",
                                        border: "none",
                                        color: "white",
                                        width: "35px",
                                        height: "35px",
                                        borderRadius: "50%",
                                        cursor: "pointer",
                                        fontSize: "18px",
                                        fontWeight: "bold"
                                    }}
                                >
                                    ✕
                                </button>

                            </div>

                        </div>

                        {/* Body */}
                        <div style={{ padding: "30px" }}>

                            {/* Rating Card */}
                            <div style={{
                                background: "#f8fafc",
                                borderRadius: "16px",
                                padding: "25px",
                                textAlign: "center",
                                marginBottom: "25px"
                            }}>

                                <h3 style={{
                                    margin: "0 0 10px 0",
                                    color: "#1e293b"
                                }}>
                                    Resolution Rating
                                </h3>

                                <div style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "8px",
                                    marginTop: "15px"
                                }}>

                                    {[1, 2, 3, 4, 5].map((star) => (

                                        <span
                                            key={star}
                                            style={{
                                                fontSize: "42px",
                                                color:
                                                    viewFeedbackData.rating >= star
                                                        ? "#fbbf24"
                                                        : "#d1d5db"
                                            }}
                                        >
                                            ★
                                        </span>

                                    ))}

                                </div>

                                <p style={{
                                    marginTop: "12px",
                                    fontWeight: "600",
                                    color: "#475569"
                                }}>
                                    {viewFeedbackData.rating} / 5 Rating
                                </p>

                            </div>

                            {/* Satisfaction Status */}
                            <div style={{
                                marginBottom: "25px"
                            }}>

                                <h4 style={{
                                    marginBottom: "12px",
                                    color: "#334155"
                                }}>
                                    Satisfaction Status
                                </h4>

                                <div style={{
                                    padding: "14px",
                                    borderRadius: "12px",
                                    fontWeight: "600",
                                    textAlign: "center",
                                    background:
                                        viewFeedbackData.isSatisfied
                                            ? "#dcfce7"
                                            : "#fee2e2",
                                    color:
                                        viewFeedbackData.isSatisfied
                                            ? "#16a34a"
                                            : "#dc2626"
                                }}>
                                    {viewFeedbackData.isSatisfied
                                        ? "😊 Citizen is Satisfied"
                                        : "😔 Citizen is Unsatisfied"}
                                </div>

                            </div>

                            {/* Comments */}
                            <div>

                                <h4 style={{
                                    marginBottom: "12px",
                                    color: "#334155"
                                }}>
                                    Comments
                                </h4>

                                <div style={{
                                    background: "#f8fafc",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "14px",
                                    padding: "18px",
                                    minHeight: "120px",
                                    lineHeight: "1.6",
                                    color: "#475569",
                                    fontSize: "0.95rem"
                                }}>
                                    {viewFeedbackData.comments || "No comments provided"}
                                </div>

                            </div>

                            {/* Footer */}
                            <div style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                marginTop: "30px"
                            }}>

                                <button
                                    onClick={() => setShowViewFeedbackModal(false)}
                                    style={{
                                        background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                                        color: "white",
                                        border: "none",
                                        padding: "11px 24px",
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                        fontWeight: "600",
                                        boxShadow: "0 4px 10px rgba(37,99,235,0.3)"
                                    }}
                                >
                                    Close
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}
        </div>
    );
};

export default MyComplaints;