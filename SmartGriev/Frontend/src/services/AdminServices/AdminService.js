const API = "https://localhost:7224/api/admin";

export const getDepartments = async () => {

    const response = await fetch(`${API}/department`);

    if (!response.ok) {
        throw new Error("Failed to fetch departments");
    }

    return await response.json();
};

export const addDepartment = async (data) => {

    const response = await fetch(`${API}/department`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
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
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Failed to update department");
    }

    return await response.json();
};

export const deleteDepartment = async (id) => {
    const response = await fetch(`${API}/department/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Failed to delete department");
    }

    return await response.json();
};

//Category Services 

export const getCategories = async () => {
    const response = await fetch(`${API}/category`);

    if (!response.ok) {
        throw new Error("Failed to fetch categories");
    }

    return await response.json();
};

export const addCategory = async (data) => {
    const response = await fetch(`${API}/category`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
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
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Failed to update category");
    }

    return await response.json();
};

export const deleteCategory = async (id) => {
    const response = await fetch(`${API}/category/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Failed to delete category");
    }

    return await response.json();
};

export const getUsers = async () => {

    const response = await fetch(`${API}/users`);

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    return await response.json();
};

export const toggleUserStatus = async (userId) => {
    const response = await fetch(`${API}/users/${userId}/toggle-status`, {
        method: "PUT"
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
export const addUser = async (data) => {
    const response = await fetch(`${API}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Failed to add user");
    }

    return await response.json();
};

// ✏️ Update User
export const updateUser = async (id, data) => {
    const response = await fetch(`${API}/users/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Failed to update user");
    }

    return await response.json();
};

// ❌ Delete User
export const deleteUser = async (id) => {
    const response = await fetch(`${API}/users/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Failed to delete user");
    }

    return await response.json();
};

// SLA Services

export const getSlas = async () => {
    const response = await fetch(`${API}/sla`);

    if (!response.ok) {
        throw new Error("Failed to fetch SLA policies");
    }

    return await response.json();
};

export const addSla = async (data) => {
    const response = await fetch(`${API}/sla`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
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
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Failed to update SLA policy");
    }

    return await response.json();
};

export const deleteSla = async (id) => {
    const response = await fetch(`${API}/sla/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Failed to delete SLA policy");
    }

    return await response.json();
};

// Total Complaint Status

export const getDashboardStats = async () => {

    const response = await fetch(`${API}/dashboard`);

    if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
    }

    return await response.json();
};

export const toggleDepartmentStatus = async (departmentId) => {
    const response = await fetch(`${API}/department/${departmentId}/toggle-status`, {
        method: "PUT"
    });

    if (!response.ok) {
        throw new Error("Failed to toggle department status");
    }

    return await response.json();
};

export const getComplaints = async () => {
    const res = await fetch("https://localhost:7224/api/complaint/all");

    if (!res.ok) {
        throw new Error("Failed to fetch complaints");
    }

    return await res.json();
};