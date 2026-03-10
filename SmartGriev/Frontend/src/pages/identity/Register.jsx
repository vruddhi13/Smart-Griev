import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "../../services/theme";
import { registerUser } from "../../services/accountservice";


const Register = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        mobile_no: "",
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
        width: "420px",
        boxShadow: theme.shadows.lg
    };

    const input = {
        width: "100%",
        padding: "12px",
        marginTop: "6px",
        marginBottom: "18px",
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

            const result = await registerUser(formData);

            console.log(result);

            alert("Registration successful");

            navigate("/login");

        } catch (error) {

            console.log(error);

            alert("Registration failed");

        }

    };
    return (

        <div style={container}>

            <div style={card}>

                <h2 style={{ textAlign: "center", marginBottom: "25px" }}>
                    Create Account
                </h2>

                <form onSubmit={handleSubmit}>

                    <label>Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        style={input}
                        onChange={handleChange}
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        style={input}
                        onChange={handleChange}
                    />

                    <label>Mobile No</label>
                    <input
                        type="text"
                        name="mobileNo"
                        style={input}
                        onChange={handleChange}
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        style={input}
                        onChange={handleChange}
                    />

                    <button style={button}>
                        Register
                    </button>

                </form>

                <p style={{ textAlign: "center", marginTop: "20px" }}>
                    Already have account?
                    <span
                        onClick={() => navigate("/login")}
                        style={{
                            color: theme.colors.primary[600],
                            marginLeft: "6px",
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

export default Register;