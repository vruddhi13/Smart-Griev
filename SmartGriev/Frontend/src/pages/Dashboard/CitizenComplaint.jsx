import React from "react";
//import { theme } from "../../services/theme";

const CitizenComplaint = () => {
    const styles = {
        pageWrapper: {
            backgroundColor: "#e2e8f0", 
            minHeight: "100vh",
            padding: "40px 20px",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        },
        formCard: {
            maxWidth: "900px",
            margin: "0 auto",
            backgroundColor: "#f1f5f9",
            borderRadius: "8px",
            borderTop: "4px solid #14532d",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            padding: "30px"
        },
        header: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "1.8rem",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: "5px"
        },
        subHeader: {
            color: "#64748b",
            fontSize: "0.95rem",
            marginBottom: "25px"
        },
        label: {
            display: "block",
            fontWeight: "700",
            fontSize: "0.85rem",
            color: "#334155",
            marginBottom: "8px"
        },
        input: {
            width: "100%",
            padding: "10px 15px",
            borderRadius: "6px",
            border: "2px solid #059669", 
            backgroundColor: "white",
            fontSize: "1rem",
            color: "#1e293b",
            boxSizing: "border-box",
            marginBottom: "20px",
            outline: "none"
        },
        mediaSection: {
            border: "2px solid #059669",
            borderRadius: "12px",
            padding: "20px",
            backgroundColor: "#ecfdf5", 
            marginBottom: "25px"
        },
        fileInputContainer: {
            border: "1px dashed #059669",
            borderRadius: "8px",
            padding: "8px 12px",
            display: "inline-block",
            backgroundColor: "white",
            cursor: "pointer"
        },
        row: {
            display: "flex",
            gap: "20px",
            marginBottom: "20px"
        },
        col: {
            flex: 1
        },
        locationBtn: {
            backgroundColor: "#7c3aed", 
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "6px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            marginBottom: "30px"
        },
        submitBtn: {
            width: "100%",
            padding: "14px",
            background: "linear-gradient(to bottom, #ca8a04, #14532d)", 
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1.1rem",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
        },
        noteBox: {
            marginTop: "25px",
            backgroundColor: "#fef3c7", 
            border: "1px solid #fcd34d",
            borderRadius: "8px",
            padding: "15px",
            fontSize: "0.85rem",
            color: "#92400e",
            display: "flex",
            gap: "8px"
        }
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.formCard}>
                <div style={styles.header}>
                    🎥 Submit Multimodal Complaint
                </div>
                <div style={styles.subHeader}>
                    Submit your complaint using text, images, or audio. AI will process your submission automatically.
                </div>

                <label style={styles.label}>Complaint Title *</label>
                <input style={styles.input} placeholder="Brief title for your complaint" />

                <label style={styles.label}>Description (optional if uploading media)</label>
                <textarea
                    style={{ ...styles.input, height: "120px", resize: "none" }}
                    placeholder="Describe your complaint in detail..."
                />

                <div style={styles.mediaSection}>
                    <div style={{ fontWeight: "700", marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
                        📎 Upload Media (Optional)
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <div style={{ fontSize: "0.85rem", fontWeight: "600", marginBottom: "5px" }}>📷 Image Evidence</div>
                        <div style={styles.fileInputContainer}>
                            <input type="file" />
                        </div>
                    </div>

                    {/*<div>*/}
                    {/*    <div style={{ fontSize: "0.85rem", fontWeight: "600", marginBottom: "5px" }}>🎤 Audio Recording</div>*/}
                    {/*    <div style={styles.fileInputContainer}>*/}
                    {/*        <input type="file" />*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>

                <div style={styles.row}>
                    <div style={styles.col}>
                        <label style={styles.label}>Priority</label>
                        <select style={styles.input}>
                            <option>Medium</option>
                            <option>High</option>
                            <option>Low</option>
                        </select>
                    </div>
                    <div style={styles.col}>
                        <label style={styles.label}>Urgency Level</label>
                        <select style={styles.input}>
                            <option>Medium</option>
                            <option>Immediate</option>
                            <option>Routine</option>
                        </select>
                    </div>
                </div>

                <label style={styles.label}>📍 Incident Address</label>
                <input style={styles.input} placeholder="Enter incident address or location" />

                <button style={styles.locationBtn}>
                    📍 Get My Current Location
                </button>

                <button style={styles.submitBtn}>
                    📥 Submit Complaint
                </button>

                {/*<div style={styles.noteBox}>*/}
                {/*    💡 <strong>Note:</strong> AI will automatically analyze your uploaded media to extract text, detect objects, and classify your complaint to the appropriate department.*/}
                {/*</div>*/}
            </div>
        </div>
    );
};

export default CitizenComplaint;