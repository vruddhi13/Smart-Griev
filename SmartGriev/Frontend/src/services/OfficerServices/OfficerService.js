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

export const getMyProfile = async () => {
    const token = sessionStorage.getItem("token");

    const res = await axios.get(
        `${BASE_URL}/Officer/my-profile`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res.data;
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

export const getEscalatedComplaints = async () => {
    const res = await axios.get(
        `${BASE_URL}/Officer/escalated-complaints`,
        getAuthConfig()
    );

    return res.data;
};

export const getComplaintHistory = async (complaintId) => {
    try {
        const res = await axios.get(
            `${BASE_URL}/Officer/complaint-history/${complaintId}`,
            getAuthConfig()
        );

        return res.data;
    } catch (error) {
        console.error("Error fetching complaint history:", error);
        throw error;
    }
};

export const getComplaintDetails = async (complaintId) => {
    const res = await axios.get(
        `${BASE_URL}/Officer/complaint-details/${complaintId}`,
        getAuthConfig()
    );

    return res.data;
};

export const getNotifications = async (userId) => {
    const res = await axios.get(
        `https://localhost:7224/api/Notification/${userId}`
    );

    return res.data;
};

export const markNotificationRead = async (notificationId) => {
    const token = sessionStorage.getItem("token");

    const res = await axios.put(
        `${BASE_URL}/Notification/mark-read/${notificationId}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res.data;
};

export const deleteNotification = async (notificationId) => {
    const token = sessionStorage.getItem("token");

    const res = await axios.delete(
        `${BASE_URL}/Notification/${notificationId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res.data;
};

export const clearAllNotifications = async (userId) => {
    const token = sessionStorage.getItem("token");

    const res = await axios.delete(
        `${BASE_URL}/Notification/clear-all/${userId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res.data;
};

export const checkSlaReminders = async () => {
    const token = sessionStorage.getItem("token");

    const res = await axios.post(
        `${BASE_URL}/Complaint/check-sla-reminders`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res.data;
};