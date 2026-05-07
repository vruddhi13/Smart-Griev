import React, { useEffect,useState } from "react";
import OfficerLayout from "../../layout/OfficerLayout";
import { updateAccount, getMyProfile } from "../../services/OfficerServices/OfficerService";
import { showError, showSuccessToast } from "../../services/alertService";

const OfficerAccount = () => {
    // Pull current user info from session
    const user = JSON.parse(sessionStorage.getItem("user"));

    const [formData, setFormData] = useState({
        fullName: user?.name || "",
        roleName: user?.role_name || "",
        email: user?.email || "",
        mobile: user?.mobile_no || "",
        password: "",
        confirmPassword: ""
    });

    useEffect(() => {
        const loadProfile = async () => {
            try {

                const response = await getMyProfile();

                console.log("Profile API:", response);

                const data = response.data || response;

                setFormData((prev) => ({
                    ...prev,
                    fullName: data.full_name || "",
                    roleName: data.role_name || "",
                    email: data.email || "",
                    mobile: data.mobile_no || ""
                }));

            } catch (error) {
                console.log(error);
            }
        };

        loadProfile();
    }, []);

    const handleUpdate = async (e) => {

        e.preventDefault();

        // ✅ Mobile validation
        if (!/^[0-9]{10}$/.test(formData.mobile)) {
            showError("Mobile number must be exactly 10 digits");
            return;
        }

        // ✅ Password validation
        if (formData.password) {

            // Minimum 6 characters
            if (formData.password.length < 6) {
                showError("Password must be at least 6 characters");
                return;
            }

            // Password match
            if (formData.password !== formData.confirmPassword) {
                showError("Passwords do not match");
                return;
            }
        }

        try {

            await updateAccount({
                Email: formData.email,
                MobileNo: formData.mobile,
                Password: formData.password
            });

            // ✅ Update session storage user
            const oldUser = JSON.parse(sessionStorage.getItem("user"));

            sessionStorage.setItem(
                "user",
                JSON.stringify({
                    ...oldUser,
                    mobile_no: formData.mobile
                })
            );

            showSuccessToast("Profile updated successfully");

            // Clear password fields
            setFormData((prev) => ({
                ...prev,
                password: "",
                confirmPassword: ""
            }));

        } catch (error) {

            console.log(error);

            showError(
                error?.response?.data?.message ||
                "Failed to update profile"
            );
        }
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
                            <input value={formData.fullName} readOnly style={readOnlyStyle} />
                        </div>
                        <div>
                            <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Role</label>
                            <input value={formData.roleName} readOnly style={readOnlyStyle} />                        </div>
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "#475569"
                        }}>
                            Mobile Number
                        </label>

                        <input
                            type="text"
                            value={formData.mobile}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    mobile: e.target.value
                                })
                            }
                            maxLength={10}
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Email Address</label>
                        <input value={formData.email} readOnly style={readOnlyStyle} />
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