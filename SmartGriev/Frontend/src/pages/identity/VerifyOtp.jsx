import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp } from "../../services/accountservice";
import { theme } from "../../services/theme";
import { showSuccessToast, showError } from "../../services/alertService";

const VerifyOtp = () => {

    const navigate = useNavigate();
    const [otp, setOtp] = useState("");

    const container = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: theme.colors.background.primary
    };

    const card = {
        background: "white",
        padding: "40px",
        width: "380px",
        borderRadius: "10px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
    };

    const input = {
        width: "100%",
        padding: "12px",
        marginTop: "20px",
        borderRadius: "6px",
        border: "1px solid #ddd"
    };

    const button = {
        width: "100%",
        marginTop: "20px",
        padding: "12px",
        background: theme.colors.primary[500],
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontWeight: "600",
        cursor: "pointer"
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const mobileNo = localStorage.getItem("mobileNo");

        if (!mobileNo) {
            showError("Mobile number missing. Please login again.");
            navigate("/login");
            return;
        }

        if (!otp) {
            showError("Please enter OTP");
            return;
        }

        try {

            const result = await verifyOtp({
                mobileNo,
                otp
            });

            const data = result.data; // 🔥 IMPORTANT

            // LOGIN FLOW
            if (data.type === "login") {

                showSuccessToast("Login Successful");

                sessionStorage.setItem("user", JSON.stringify({
                    userId: data.userId,
                    roleId: data.roleId,
                    name: data.name || 'User'
                }));
                console.log("OTP Response:", data);
                sessionStorage.setItem("roleId", data.roleId);
                sessionStorage.setItem("userId", data.userId);
                localStorage.removeItem("mobileNo");

                switch (data.roleId) {
                    case 1:
                        navigate("/admin");
                        break;
                    case 4:
                        navigate("/dashboard");
                        break;
                    default:
                        navigate("/login");
                        break;
                }
            }

            // RESET FLOW
            else if (data.type === "reset") {

                showSuccessToast("OTP Verified");

                navigate("/forgot-password");
            }

            else {
                showError("Invalid response from server");
                navigate("/login");
            }

        } catch (error) {
            showError(error.message);
        }
    };

    return (
        <div style={container}>
            <div style={card}>

                <h2 style={{ textAlign: "center" }}>
                    Verify OTP
                </h2>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="Enter OTP"
                        style={input}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />

                    <button style={button}>
                        Verify OTP
                    </button>

                </form>

            </div>
        </div>
    );
};

export default VerifyOtp;