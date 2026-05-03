import React, { useEffect, useState } from "react";
import OfficerLayout from "../../layout/OfficerLayout";
import { getMyComplaints, updateStatus } from "../../services/OfficerServices/OfficerService";

const OfficerComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [selected, setSelected] = useState(null);

    const fetchComplaints = async () => {
        const data = await getMyComplaints();
        setComplaints(data);
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleUpdate = async (id, status) => {
        await updateStatus(id, status);
        fetchComplaints();
    };

    return (
        <OfficerLayout>
            <h2>Complaints</h2>

            <table style={{ width: "100%", background: "white" }}>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>View</th>
                    </tr>
                </thead>

                <tbody>
                    {complaints.map(c => (
                        <tr key={c.complaint_id}>
                            <td>{c.complaint_number}</td>
                            <td>{c.priority_level}</td>
                            <td>{c.status}</td>
                            <td>
                                <button onClick={() => setSelected(c)}>👁</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* MODAL */}
            {selected && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0,0,0,0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <div style={{
                        background: "white",
                        padding: "20px",
                        width: "500px",
                        borderRadius: "10px"
                    }}>
                        <h3>{selected.complaint_number}</h3>
                        <p>{selected.description}</p>

                        {selected.image && (
                            <img
                                src={`https://localhost:7224/${encodeURI(selected.image)}`}
                                style={{ width: "100%" }}
                            />
                        )}

                        <select
                            value={selected.status}
                            onChange={(e) =>
                                handleUpdate(selected.complaint_id, e.target.value)
                            }
                        >
                            <option>Assigned</option>
                            <option>In Progress</option>
                            <option>Resolved</option>
                            <option>Rejected</option>
                        </select>

                        <br /><br />
                        <button onClick={() => setSelected(null)}>Close</button>
                    </div>
                </div>
            )}
        </OfficerLayout>
    );
};

export default OfficerComplaints;