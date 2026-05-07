import React, { useState } from "react";
import axios from "axios";

const ComplaintCard = ({ complaint, reload }) => {
    const [status, setStatus] = useState(complaint.status);

    const handleUpdate = async () => {
        const token = sessionStorage.getItem("token");

        await axios.post(
            "https://localhost:7224/api/Officer/update-status",
            {
                complaintId: complaint.complaintId,
                status
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        reload();
    };

    return (
        <div style={{
            background: "white",
            padding: "18px",
            borderRadius: "14px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
        }}>
            <h4 style={{ marginBottom: "5px" }}>{complaint.complaintNumber}</h4>
            <p style={{ color: "#64748b" }}>{complaint.description}</p>

            <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px"
            }}>
                <span><b>Priority:</b> {complaint.priorityLevel}</span>
                <span><b>Status:</b> {complaint.status}</span>
            </div>

            <div style={{ marginTop: "10px" }}>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option>Submitted</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                    <option>Closed</option>
                </select>

                <button
                    onClick={handleUpdate}
                    style={{
                        marginLeft: "10px",
                        padding: "6px 12px",
                        background: "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "6px"
                    }}
                >
                    Update
                </button>
            </div>
        </div>
    );
};

export default ComplaintCard;