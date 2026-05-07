const API = "https://localhost:7224/api/DeptHead";

export const deptHeadAssignComplaint = async (data) => {
    const res = await fetch(`${API}/depthead-assign`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "DeptHead Assignment failed");
    }

    return await res.json();
};