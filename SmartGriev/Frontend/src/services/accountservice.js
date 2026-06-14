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

    if (result.data?.token) {
        sessionStorage.setItem("token", result.data.token);
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

export const getAdminStats = async () => {
    const response = await fetch(`${API}/admin-stats`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch admin statistics");
    }

    return await response.json();
};
export const resetPassword = async (data) => {

    const response = await fetch(`${API}/reset-password`, {
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
        throw new Error("Server error");
    }

    if (!response.ok) {
        throw new Error(result.message || "Reset password failed");
    }

    return result.data;
};

export const getUserById = async (id) => {

    const token = sessionStorage.getItem("token");

    const response = await fetch(
        `https://localhost:7224/api/admin/users/${id}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );

    let result;

    try {
        result = await response.json();
    } catch {
        throw new Error("Failed to fetch user");
    }

    if (!response.ok) {
        throw new Error(result.message || "Failed to fetch user");
    }

    return result;
};


export const CitizenPasswordChange = async (data) => {

    const token = sessionStorage.getItem("token");

    const response = await fetch(`${API}/citizen/change-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    let result;

    try {
        result = await response.json();
    } catch {
        throw new Error("Update failed");
    }

    if (!response.ok) {
        throw new Error(result.message || "Update failed");
    }

    return result;
};


export const getComplaintStatusLogs = async () => {

    const token = sessionStorage.getItem("token");

    const response = await fetch(
        `https://localhost:7224/api/complaint/status-logs`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );

    let result;

    try {
        result = await response.json();
    }
    catch {
        throw new Error("Failed to fetch complaint status logs");
    }

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to fetch complaint status logs"
        );
    }

    return result;
};

export const getRoles = async () => {
    const token = sessionStorage.getItem("token");

    const response = await fetch(
        "https://localhost:7224/api/identity/Account/roles",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch roles");
    }

    return await response.json();
};