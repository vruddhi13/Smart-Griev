import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "../../services/theme";
import { loginUser } from "../../services/accountservice";
import { showError, showSuccessToast } from "../../services/alertService";

const Login = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        emailOrMobile: "",
        password: ""
    });

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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const result = await loginUser(formData);

            showSuccessToast("OTP Sent Successfully");

//            console.log("LOGIN RESULT:", result); 

            // 🔥 store correct mobile from backend
            localStorage.setItem("mobileNo", result.data.mobile_no);
            navigate("/verify-otp");

        } catch (error) {
            showError(error.message);
        }
    };

    return (
        <div style={container}>

            <div style={card}>

                <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
                    SmartGriev Login
                </h2>

                <form onSubmit={handleSubmit}>

                    <label>Email or Mobile</label>
                    <input
                        type="text"
                        name="emailOrMobile"
                        style={input}
                        value={formData.emailOrMobile}
                        onChange={handleChange}
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        style={input}
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <p
                        onClick={() => navigate("/forgot-password")}
                        style={{
                            textAlign: "right",
                            color: theme.colors.primary[600],
                            cursor: "pointer",
                            fontSize: "14px",
                            marginTop: "-10px",
                            marginBottom: "15px"
                        }}
                    >
                        Forgot Password?
                    </p>

                    <button style={button}>Login</button>

                </form>

                <p style={{ marginTop: "20px", textAlign: "center" }}>
                    Don't have account?
                    <span
                        onClick={() => navigate("/register")}
                        style={{
                            color: theme.colors.primary[600],
                            marginLeft: "5px",
                            cursor: "pointer",
                            fontWeight: "600"
                        }}
                    >
                        Register
                    </span>
                </p>

            </div>

        </div>
    );
};

export default Login;