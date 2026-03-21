const API = "https://localhost:7224/api/identity/account";

export const registerUser = async (data) => {

    const response = await fetch(`${API}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    let result;
    try {
        result = await response.json();
    }
    catch {
        throw new Error("Server returned invalid response");
    }

    if (!response.ok) {
        throw new Error(result.message || "Registration failed");
    }

    return result;
};

export const loginUser = async (data) => {

    const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    let result;

    try {
        result = await response.json();
    } catch {
        throw new Error("Server error. Please check backend.");
    }

    //const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Login failed");
    }

    return result;
};
export const verifyOtp = async (data) => {

    const response = await fetch(`${API}/verify-otp`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "OTP failed");
    }

    return result;
};
export const forgotPassword = async (data) => {

    const response = await fetch(`${API}/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Forgot password failed");
    }

    return response.json();
};