import React, { useEffect, useState} from "react";
import { theme } from "../../services/theme";
import Pagination from "../../Components/AdminComponents/Pagination";
import usePagination from "../../services/usePagination";

const MyComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    //const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");

    const userId = 1; // You can also get this from sessionStorage.getItem("user")

    //const fetchComplaints = useCallback(() => {
    //    setLoading(true);
    //    fetch(`https://localhost:7224/api/Complaint/user/${userId}`)
    //        .then((res) => res.json())
    //        .then((data) => {
    //            setComplaints(data);
    //            setLoading(false);
    //        })
    //        .catch((err) => {
    //            console.error("Error fetching complaints:", err);
    //            setLoading(false);
    //        });
    //}, [userId]);

    //// Add this to trigger the fetch on component mount
    //useEffect(() => {
    //    fetchComplaints();
    //}, [fetchComplaints]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await fetch(`https://localhost:7224/api/Complaint/user/${userId}`);
                const data = await res.json();
                setComplaints(data);
            } catch (err) {
                console.error("Error fetching complaints:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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


    // Stats Calculation
    const stats = {
        total: complaints.length,
        pending: complaints.filter(c => c.status === "Submitted").length,
        resolved: complaints.filter(c => c.status === "Resolved").length
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

    const getStepStatus = (step) => {
        const statusMap = { "Submitted": 1, "In Progress": 2, "Resolved": 3 };
        return statusMap[selectedComplaint?.status] >= step;
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.blueBanner}>
                <h1 style={styles.headerText}>My Complaints</h1>
                <p style={styles.subText}>Track and manage all your submitted complaints effortlessly.</p>
            </div>

            <div style={styles.mainContainer}>
                {/* Stats */}
                <div style={styles.statsGrid}>
                    <div style={styles.statCard(theme.colors.primary[500])}>
                        <div style={{ fontSize: "1.5rem" }}>📋</div>
                        <h2 style={{ margin: "10px 0 5px" }}>{stats.total}</h2>
                        <p style={{ color: "#64748b", margin: 0 }}>Total Complaints</p>
                    </div>
                    <div style={styles.statCard("#f59e0b")}>
                        <div style={{ fontSize: "1.5rem" }}>⏳</div>
                        <h2 style={{ margin: "10px 0 5px" }}>{stats.pending}</h2>
                        <p style={{ color: "#64748b", margin: 0 }}>Pending</p>
                    </div>
                    <div style={styles.statCard("#10b981")}>
                        <div style={{ fontSize: "1.5rem" }}>✅</div>
                        <h2 style={{ margin: "10px 0 5px" }}>{stats.resolved}</h2>
                        <p style={{ color: "#64748b", margin: 0 }}>Resolved</p>
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
                        <option value="All">All Status</option>
                        <option value="Submitted">Submitted</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                    <select style={styles.select} onChange={(e) => setPriorityFilter(e.target.value)}>
                        <option value="All">All Priority</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>

                {/* Table */}
                <div style={styles.tableCard}>
                    {loading ? (
                        <p style={{ padding: "40px", textAlign: "center" }}>Loading complaints...</p>
                    ) : (
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Complaint Details</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Priority</th>
                                    <th style={styles.th}>Date</th>
                                    <th style={styles.th}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.length > 0 ? currentData.map(c => (
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
                                            <button
                                                style={styles.viewBtn}
                                                onClick={() => openModal(c)}
                                            >View</button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="5" style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>No complaints found.</td></tr>
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
                                <h4 style={{ margin: "0 0 5px 0", fontSize: "0.8rem", color: "#64748b" }}>Status</h4>
                                <span style={styles.badge(selectedComplaint.status)}>{selectedComplaint.status}</span>
                            </div>
                            <div>
                                <h4 style={{ margin: "0 0 5px 0", fontSize: "0.8rem", color: "#64748b" }}>Priority</h4>
                                <span style={styles.badge(selectedComplaint.priority)}>{selectedComplaint.priority}</span>
                            </div>
                        </div>

                        <div style={{ marginTop: "20px" }}>
                            <h4 style={{ margin: "0 0 5px 0", fontSize: "0.8rem", color: "#64748b" }}>Description</h4>
                            <p style={{ fontSize: "0.9rem", lineHeight: "1.5" }}>{selectedComplaint.description}</p>
                        </div>

                        <div style={{ marginTop: "20px" }}>
                            <h4 style={{ margin: "0 0 5px 0", fontSize: "0.8rem", color: "#64748b" }}>Address</h4>
                            <p style={{ fontSize: "0.9rem" }}>{selectedComplaint.address || "No address provided"}</p>
                        </div>

                        <div style={{ marginTop: "20px" }}>
                            <h4 style={{ margin: "0 0 10px 0", fontSize: "0.8rem", color: "#64748b" }}>Evidence</h4>
                            {selectedComplaint.imageUrl ? (
                                <img src={selectedComplaint.imageUrl} alt="Complaint" style={{ width: "100%", borderRadius: "8px" }} />
                            ) : (
                                <div style={{ padding: "20px", background: "#f8fafc", textAlign: "center", borderRadius: "8px", color: "#94a3b8" }}>No Image Available</div>
                            )}
                        </div>

                        {/* Progress Tracker */}
                        <div style={{ marginTop: "30px" }}>
                            <h4 style={{ margin: "0 0 15px 0", fontSize: "0.8rem", color: "#64748b", textAlign: "center" }}>Complaint Progress</h4>
                            <div style={styles.tracker}>
                                <div style={{ position: "absolute", top: "15px", left: 0, right: 0, height: "2px", background: "#e2e8f0", zIndex: 0 }}></div>
                                <div style={{ ...styles.step(getStepStatus(1)) }}>1</div>
                                <div style={{ ...styles.step(getStepStatus(2)) }}>2</div>
                                <div style={{ ...styles.step(getStepStatus(3)) }}>3</div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#64748b", marginTop: "-15px" }}>
                                <span>Submitted</span>
                                <span>In Progress</span>
                                <span>Resolved</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyComplaints;