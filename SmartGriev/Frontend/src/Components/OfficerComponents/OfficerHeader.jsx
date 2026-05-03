import React, { useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OfficerHeader = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem("user"));

    const logout = () => {
        sessionStorage.clear();
        navigate("/login");
    };

    return (
        <div style={{
            height: "70px",
            background: "white",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "0 30px",
            borderBottom: "1px solid #e2e8f0"
        }}>
            <Bell style={{ marginRight: "20px", cursor: "pointer" }} />

            <div style={{ position: "relative" }}>
                <div
                    onClick={() => setOpen(!open)}
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "#6366f1",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer"
                    }}
                >
                    {user?.full_name?.charAt(0)}
                </div>

                {open && (
                    <div style={{
                        position: "absolute",
                        right: 0,
                        top: "50px",
                        background: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        width: "180px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                    }}>
                        <div
                            onClick={() => navigate("/officer/account")}
                            style={{ padding: "10px", cursor: "pointer" }}
                        >
                            Account Settings
                        </div>

                        <div
                            onClick={logout}
                            style={{ padding: "10px", color: "red", cursor: "pointer" }}
                        >
                            Logout
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OfficerHeader;