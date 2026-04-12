import React, { useState, useEffect } from "react";
//import { theme } from "../../services/theme";

const CitizenComplaint = () => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [address, setAddress] = useState("");
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState("");

    useEffect(() => {
        fetch("https://localhost:7224/api/Complaint/categories")
            .then(res => res.json())
            .then(data => setCategories(data));
    }, []);


    const handleSubmit = async () => {

        const formData = new FormData();
        const userId = sessionStorage.getItem("userId");
        formData.append("userId", userId);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("priorityLevel", priority);
        formData.append("address", address);
        formData.append("categoryId", categoryId);

        if (image) {
            formData.append("image", image);
        }

        try {

            const response = await fetch("https://localhost:7224/api/Complaint", {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                alert("Complaint submitted successfully!");

                // reset form
                setTitle("");
                setDescription("");
                setPriority("Medium");
                setAddress("");
                setImage(null);
            }
            else {
                const errorText = await response.text();
                console.error(errorText);
                alert("Error submitting complaint");
            }

        } catch (error) {
            console.error(error);
            alert("Server error");
        }
    };

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

                <label style={styles.label}>Complaint Category *</label>
                {/*<input*/}
                {/*    style={styles.input}*/}
                {/*    placeholder="Example: Garbage not collected for 3 days"*/}
                {/*    value={title}*/}
                {/*    onChange={(e) => setTitle(e.target.value)}*/}
                {/*/>*/}
                <select style={styles.input} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                    <option value="">Select Category</option>
                    {categories.map(c => (
                        <option key={c.categoryId} value={c.categoryId}>
                            {c.categoryName}
                        </option>
                    ))}
                </select>

                <label style={styles.label}>Description (optional if uploading media)</label>
                <textarea
                    style={{ ...styles.input, height: "120px" }}
                    placeholder="Describe your complaint in detail..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <div style={styles.mediaSection}>
                    <div style={{ fontWeight: "700", marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
                        📎 Upload Media (Optional)
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <div style={{ fontSize: "0.85rem", fontWeight: "600", marginBottom: "5px" }}>📷 Image Evidence</div>
                        <div style={styles.fileInputContainer}>
                            <input
                                type="file"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
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
                        <select
                            style={styles.input}
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}>
                            <option>Medium</option>
                            <option>High</option>
                            <option>Low</option>
                        </select>
                    </div>
                    {/*<div style={styles.col}>*/}
                    {/*    <label style={styles.label}>Urgency Level</label>*/}
                    {/*    <select style={styles.input}>*/}
                    {/*        <option>Medium</option>*/}
                    {/*        <option>Immediate</option>*/}
                    {/*        <option>Routine</option>*/}
                    {/*    </select>*/}
                    {/*</div>*/}
                </div>

                <label style={styles.label}>📍 Incident Address</label>
                <input
                    style={styles.input}
                    placeholder="Enter incident address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}/>

                {/*<button style={styles.locationBtn} >*/}
                {/*    📍 Get My Current Location*/}
                {/*</button>*/}

                <button style={styles.submitBtn} onClick={handleSubmit}>
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