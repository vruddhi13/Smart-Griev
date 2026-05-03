import React, { useState } from "react";
import OfficerLayout from "../../layout/OfficerLayout";
import { updateAccount } from "../../services/OfficerServices/OfficerService";

const OfficerAccount = () => {
    // Pull current user info from session
    const user = JSON.parse(sessionStorage.getItem("user"));

    const [formData, setFormData] = useState({
        fullName: user?.full_name || "",
        email: user?.email || "",
        mobile: user?.mobile_no || "",
        password: ""
    }); 

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        await updateAccount({
            email: formData.email,
            password: formData.password
        });

        alert("Updated successfully");
    };
    const inputStyle = {
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        marginTop: "6px",
        fontSize: "14px",
        outline: "none"
    };

    const readOnlyStyle = {
        ...inputStyle,
        background: "#f8fafc",
        color: "#94a3b8",
        cursor: "not-allowed"
    };

    return (
        <OfficerLayout>
            <div style={{ maxWidth: "600px", margin: "0 auto", background: "white", padding: "40px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                <h2 style={{ marginBottom: "8px", fontSize: "22px", fontWeight: "700" }}>Profile Settings</h2>
                <p style={{ color: "#64748b", marginBottom: "24px", fontSize: "14px" }}>Manage your login credentials. Administrative roles are read-only.</p>

                <form onSubmit={handleUpdate}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                        <div>
                            <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Full Name</label>
                            <input value={user?.full_name} readOnly style={readOnlyStyle} />
                        </div>
                        <div>
                            <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Role</label>
                            <input value="Field Officer" readOnly style={readOnlyStyle} />
                        </div>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Email Address</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            style={{ ...inputStyle, border: "1px solid #6366f1" }}
                        />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>New Password</label>
                        <input
                            type="password"
                            placeholder="Leave blank to keep current"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: "30px" }}>
                        <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Confirm Password</label>
                        <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            style={inputStyle}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: "100%", padding: "14px", background: "#6366f1", color: "white",
                            border: "none", borderRadius: "10px", fontWeight: "600", cursor: "pointer",
                            transition: "0.2s"
                        }}
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </OfficerLayout>
    );
};

export default OfficerAccount;