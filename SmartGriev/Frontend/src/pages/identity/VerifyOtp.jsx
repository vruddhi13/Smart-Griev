import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp } from "../../services/accountservice";
import { theme } from "../../services/theme";
import { showSuccessToast, showError } from "../../services/alertService";

const VerifyOtp = () => {

    const navigate = useNavigate();

    const [otp, setOtp] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        const mobileNo = localStorage.getItem("mobileNo");

        try {

            const result = await verifyOtp({
                mobileNo: mobileNo,
                otp: otp
            });

            showSuccessToast("Login Successful");

            localStorage.setItem("user", JSON.stringify({
                userId: result.userId,
                roleId: result.roleId,
                name: result.name || 'User'
            }));

            localStorage.setItem("roleId", result.roleId);

            // 🔥 ROLE BASED REDIRECT
            if (result.roleId == 4) {
                navigate("/dashboard"); // Citizen
            } else {
                navigate("/admin"); // Admin Panel
            }

        } catch (error) {

            showError(error.message);

        }
    };

    return (

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>

            <div style={{ background: "white", padding: "40px", width: "380px" }}>

                <h2>Verify OTP</h2>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="Enter OTP"
                        style={{ width: "100%", padding: "10px", marginTop: "20px" }}
                        onChange={(e) => setOtp(e.target.value)}
                    />

                    <button
                        style={{
                            width: "100%",
                            marginTop: "20px",
                            padding: "12px",
                            background: theme.colors.primary[500],
                            color: "white",
                            border: "none"
                        }}
                    >
                        Verify OTP
                    </button>

                </form>

            </div>

        </div>

    );

};

export default VerifyOtp;