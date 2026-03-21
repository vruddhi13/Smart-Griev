import React, { useState } from "react";
import { forgotPassword } from "../../services/accountservice";

const ForgotPassword = () => {

    const [mobileNo, setMobileNo] = useState("");

    const submit = async (e) => {

        e.preventDefault();

        await forgotPassword({ mobileNo });

        localStorage.setItem("mobileNo", mobileNo);

        alert("OTP Sent");

    };

    return (

        <form onSubmit={submit}>

            <h2>Forgot Password</h2>

            <input
                placeholder="Mobile Number"
                onChange={(e) => setMobileNo(e.target.value)}
            />

            <button>Send OTP</button>

        </form>

    );
};

export default ForgotPassword;