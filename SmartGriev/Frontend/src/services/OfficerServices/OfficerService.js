import axios from "axios";

const BASE_URL = "https://localhost:7224/api";

// 🔐 Common config (auto attach token)
const getAuthConfig = () => {
    const token = sessionStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

// ✅ 4. Update Account
export const updateAccount = async (data) => {
    try {
        const token = sessionStorage.getItem("token");

        const res = await axios.post(
            `${BASE_URL}/Officer/update-account`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return res.data;
    } catch (error) {
        console.error("Update account error:", error);
        throw error;
    }
};

// ✅ 1. Get Complaints
export const getMyComplaints = async () => {
    try {
        const res = await axios.get(
            `${BASE_URL}/Officer/my-complaints`,
            getAuthConfig()
        );

        return res.data;
    } catch (error) {
        console.error("Error fetching complaints:", error);
        throw error;
    }
};

// ✅ 2. Update Status (FIXED)
export const updateStatus = async (complaintId, status) => {
    try {
        const res = await axios.post(
            `${BASE_URL}/Officer/update-status`,
            {
                complaintId,
                status
            },
            getAuthConfig()
        );

        return res.data;
    } catch (error) {
        console.error("Error updating status:", error);
        throw error;
    }
};

// ✅ 3. Get Notifications
export const getNotifications = async () => {
    return [];
};