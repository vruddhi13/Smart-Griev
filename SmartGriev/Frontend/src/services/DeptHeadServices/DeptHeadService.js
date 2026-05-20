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

    const res = await fetch(
        `${API}/department-complaints/${departmentId}`
    );

    if (!res.ok) {
        throw new Error("Failed to fetch complaints");
    }

    return await res.json();
};