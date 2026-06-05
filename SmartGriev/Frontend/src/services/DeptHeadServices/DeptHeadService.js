import axios from "axios";

const API = "https://localhost:7224/api/DeptHead";

export const deptHeadAssignComplaint = async (data) => {

    const res = await fetch(`${API}/assign`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
    }

    return await res.json();
};

export const getDepartmentComplaints = async (departmentId) => {

    const token = localStorage.getItem("token");

    const res = await fetch(
        `${API}/department-complaints/${departmentId}`,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch complaints");
    }

    return await res.json();
};

const getToken = () => sessionStorage.getItem("token");

const auth = () => ({
    headers: {
        Authorization: `Bearer ${getToken()}`
    }
});

/* ================= ESCALATED ================= */
export const getEscalatedComplaints = async () => {
    const res = await axios.get(
        `${API}/escalated-complaints`,auth()
    );
    return res.data;
};

/* ================= DETAILS ================= */
export const getDeptHeadComplaintDetails = async (id) => {
    const res = await axios.get(
        `${API}/complaint-details/${id}`,auth()
    );
    return res.data;
};

/* ================= HISTORY ================= */
export const getComplaintHistory = async (id) => {
    const res = await axios.get(
        `${API}/complaint-history/${id}`,auth()
    );
    return res.data;
};

export const getDepartmentOfficers = async () => {
    const token = sessionStorage.getItem("token");

    return axios.get(
        `${API}/my-department-officers`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
};