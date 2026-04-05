import React, { useState } from "react";
import { theme } from "../../services/theme";
import {
    forgotPassword,
    verifyOtp,
    resetPassword
} from "../../services/accountservice";
import { showError, showSuccessToast } from "../../services/alertService";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {

    const navigate = useNavigate();

    const [step, setStep] = useState(1);

    const [mobileNo, setMobileNo] = useState("");
    const [otp, setOtp] = useState("");
    const [passwords, setPasswords] = useState({
        newPassword: "",
        confirmPassword: ""
    });

    // 🎨 Styles (same as login)
    const container = {
        minHeight: "100vh",
        background: theme.colors.background.primary,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    };

    const card = {
        background: "white",
        padding: "40px",
        borderRadius: theme.borderRadius.lg,
        width: "400px",
        boxShadow: theme.shadows.lg
    };

    const input = {
        width: "100%",
        padding: "12px",
        marginTop: "6px",
        marginBottom: "20px",
        borderRadius: "6px",
        border: "1px solid #ddd"
    };

    const button = {
        width: "100%",
        padding: "12px",
        background: theme.colors.primary[500],
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontWeight: "600",
        cursor: "pointer"
    };

    // 🔥 Step 1: Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();

        try {
            await forgotPassword({ mobileNo });

            showSuccessToast("OTP Sent Successfully");
            localStorage.setItem("mobileNo", mobileNo);
            localStorage.setItem("flow", "reset");
            setStep(2);

        } catch (err) {
            showError(err.message);
        }
    };

    // 🔥 Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        try {
            await verifyOtp({
                mobileNo,
                otp,
                purpose: "reset"
            });

            showSuccessToast("OTP Verified");
            setStep(3);

        } catch (err) {
            showError(err.message);
        }
    };

    // 🔥 Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (passwords.newPassword !== passwords.confirmPassword) {
            showError("Passwords do not match");
            return;
        }

        try {
            await resetPassword({
                mobileNo,
                newPassword: passwords.newPassword
            });

            showSuccessToast("Password Reset Successfully");
            navigate("/login");

        } catch (err) {
            showError(err.message);
        }
    };

    return (
        <div style={container}>
            <div style={card}>

                {/* STEP 1 */}
                {step === 1 && (
                    <>
                        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                            Forgot Password
                        </h2>

                        <form onSubmit={handleSendOtp}>
                            <label>Mobile Number</label>
                            <input
                                style={input}
                                value={mobileNo}
                                onChange={(e) => setMobileNo(e.target.value)}
                            />

                            <button style={button}>Send OTP</button>
                        </form>
                    </>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <>
                        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                            Verify OTP
                        </h2>

                        <form onSubmit={handleVerifyOtp}>
                            <label>Enter OTP</label>
                            <input
                                style={input}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />

                            <button style={button}>Verify OTP</button>
                        </form>
                    </>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <>
                        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                            Reset Password
                        </h2>

                        <form onSubmit={handleResetPassword}>

                            <label>New Password</label>
                            <input
                                type="password"
                                style={input}
                                onChange={(e) =>
                                    setPasswords({
                                        ...passwords,
                                        newPassword: e.target.value
                                    })
                                }
                            />

                            <label>Confirm Password</label>
                            <input
                                type="password"
                                style={input}
                                onChange={(e) =>
                                    setPasswords({
                                        ...passwords,
                                        confirmPassword: e.target.value
                                    })
                                }
                            />

                            <button style={button}>Reset Password</button>
                        </form>
                    </>
                )}

                {/* Back */}
                <p style={{ textAlign: "center", marginTop: "20px" }}>
                    Back to Login?
                    <span
                        onClick={() => navigate("/login")}
                        style={{
                            color: theme.colors.primary[600],
                            marginLeft: "5px",
                            cursor: "pointer",
                            fontWeight: "600"
                        }}
                    >
                        Login
                    </span>
                </p>

            </div>
        </div>
    );
};

export default ForgotPassword;