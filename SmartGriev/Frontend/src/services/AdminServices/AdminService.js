import axios from "axios";

const API = "https://localhost:7224/api/admin";

const getAuthHeaders = () => {
    const token = sessionStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
};

export const getDepartments = async () => {

    const response = await fetch(`${API}/department`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error("Failed to fetch departments");
    }

    return await response.json();
};

export const addDepartment = async (data) => {

    const response = await fetch(`${API}/department`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Failed to add department");
    }

    return await response.json();
};

export const updateDepartment = async (id, data) => {
    const response = await fetch(`${API}/department/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Failed to update department");
    }

    return await response.json();
};

export const deleteDepartment = async (id) => {
    const response = await fetch(`${API}/department/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
};

//Category Services 

export const getCategories = async () => {
    const response = await fetch(`${API}/category`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error("Failed to fetch categories");
    }

    return await response.json();
};

export const addCategory = async (data) => {
    const response = await fetch(`${API}/category`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Failed to add category");
    }

    return await response.json();
};

export const updateCategory = async (id, data) => {
    const response = await fetch(`${API}/category/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Failed to update category");
    }

    return await response.json();
};

export const deleteCategory = async (id) => {
    const response = await fetch(`${API}/category/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to delete category");
    }

    return await response.json();
};

// Example validation for your AdminService.js file
export const getUsers = async () => {
    const token = sessionStorage.getItem("token");
    const response = await fetch("https://localhost:7224/api/admin/users", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    
    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }
    return await response.json();
};

export const toggleUserStatus = async (userId) => {
    const response = await fetch(`${API}/users/${userId}/toggle-status`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to toggle user status");
    }

    return await response.json();
};

export const submitComplaint = async (data) => {

    const res = await fetch("https://localhost:7224/api/complaints", {
        method: "POST",
        body: data
    });

    return await res.json();
}

// ➕ Add User
export const addUser = async (formData) => {
    // Map properties explicitly so .NET accepts them seamlessly
    const payload = {
        Name: formData.name,
        Email: formData.email,
        Phone: formData.phone,
        RoleId: Number(formData.roleId),
        DepartmentId: formData.departmentId ? Number(formData.departmentId) : null
    };

    const response = await fetch(`${API}/users`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error("Failed to add user");
    }

    return await response.json();
};

// ✏️ Update User
export const updateUser = async (id, formData) => {
    const payload = {
        Name: formData.name,
        Email: formData.email,
        Phone: formData.phone,
        RoleId: Number(formData.roleId),
        DepartmentId: formData.departmentId ? Number(formData.departmentId) : null
    };

    const response = await fetch(`${API}/users/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error("Failed to update user");
    }

    return await response.json();
};

// ❌ Delete User
export const deleteUser = async (id) => {
    const response = await fetch(`${API}/users/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to delete user");
    }

    return await response.json();
};

// SLA Services

export const getSlas = async () => {
    const response = await fetch(`${API}/sla`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error("Failed to fetch SLA policies");
    }

    return await response.json();
};

export const addSla = async (data) => {
    const response = await fetch(`${API}/sla`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Failed to add SLA policy");
    }

    return await response.json();
};

export const updateSla = async (id, data) => {
    const response = await fetch(`${API}/sla/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Failed to update SLA policy");
    }

    return await response.json();
};

export const deleteSla = async (id) => {
    const response = await fetch(`${API}/sla/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to delete SLA policy");
    }

    return await response.json();
};

// Total Complaint Status

export const getDashboardStats = async () => {

    const response = await fetch(`${API}/dashboard`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
    }

    return await response.json();
};

export const toggleDepartmentStatus = async (departmentId) => {
    const response = await fetch(`${API}/department/${departmentId}/toggle-status`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to toggle department status");
    }

    return await response.json();
};

export const getComplaints = async () => {
    const res = await fetch("https://localhost:7224/api/complaint/all",
        {
            headers: getAuthHeaders()
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch complaints");
    }

    return await res.json();
};

export const assignComplaint = async (data) => {
    const res = await fetch("https://localhost:7224/api/Complaint/assign-complaint", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    const text = await res.text();

    if (!res.ok) {
        console.error("API ERROR:", text);
        throw new Error(text || "Assignment failed");
    }

    return text ? JSON.parse(text) : {};
};

export const updateStatus = async (complaintId, status) => {
    const res = await fetch("https://localhost:7224/api/officer/update-status", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
            complaintId,
            status,
            remarks: "Updated by officer"
        })
    });

    return await res.json();
};

export const getOfficers = async () => {
    try {
        const res = await fetch("https://localhost:7224/api/Complaint/get-officers",
            {
                headers: getAuthHeaders()
            }
        );

        if (!res.ok) {
            throw new Error("Failed to fetch officers");
        }

        const data = await res.json();
        return data;

    } catch (error) {
        console.error("API ERROR:", error);
        throw error;
    }
};

export const getAuditLogs = async () => {
    const response = await fetch(`${API}/audit`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error("Failed to fetch audit logs");
    }

    return await response.json();
};
const handleResponse = async (response) => {
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || "API request failed");
    }

    return data;
};

// GET ALL ESCALATIONS
export const getEscalations = async () => {
    const response = await fetch(`${API}/escalation`);
    return await handleResponse(response);
};

// GET ESCALATION COMPLAINTS
export const getEscalationComplaints = async () => {
    const response = await fetch(`${API}/escalation/complaints`);
    return await handleResponse(response);
};

// GET ESCALATION HISTORY BY COMPLAINT ID
export const getEscalationHistory = async (complaintId) => {
    const response = await fetch(
        `${API}/escalation/complaint/${complaintId}`
    );
    return await handleResponse(response);
};

// MANUAL ESCALATION
export const manualEscalation = async (data, token) => {
    const response = await fetch(`${API}/escalation/manual`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    return await handleResponse(response);
};

// AUTO ESCALATION TRIGGER
export const runAutoEscalation = async (token) => {
    const response = await fetch(
        `${API}/escalation/run-auto-escalation`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );

    return await handleResponse(response);
};

export const getComplaintAssignments = async () => {
    const token = sessionStorage.getItem("token");

    return await axios.get(
        `https://localhost:7224/api/Complaint/complaint-assignments`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
};
export const getNotifications = async (userId) => {
    const response = await fetch(
        `https://localhost:7224/api/Complaint/notifications/${userId}`,
        {
            headers: getAuthHeaders()
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch notifications");
    }

    return await response.json();
};

export const markNotificationRead = async (notificationId) => {
    const token = sessionStorage.getItem("token");

    const res = await axios.put(
        `https://localhost:7224/api/Notification/mark-read/${notificationId}`,
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
        `https://localhost:7224/api/Notification/${notificationId}`,
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
        `https://localhost:7224/api/Notification/clear-all/${userId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res.data;

export const updateAccount = async (data) => {

    const token = sessionStorage.getItem("token");

    const response = await fetch(
        `https://localhost:7224/api/admin/users/update-account`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }
    );

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

export const getNotifications = async (userId) => {
    const response = await fetch(
        `https://localhost:7224/api/Notification/${userId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch notifications");
    }

    return await response.json();
};

export const markNotificationAsRead = async (notificationId) => {
    const response = await fetch(
        `https://localhost:7224/api/Notification/mark-read/${notificationId}`,
        {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Failed to mark notification as read");
    }

    return true;
};