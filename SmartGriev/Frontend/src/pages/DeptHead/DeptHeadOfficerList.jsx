import React, { useEffect, useState } from "react";
import DeptLayout from "../../layout/DeptHeadLayout";
import { deptHeadTheme as theme } from "../../services/DeptHeadServices/DeptHeadTheme";
import { Users, Mail, Phone } from "lucide-react";
import { getDepartmentOfficers } from "../../services/DeptHeadServices/DeptHeadService";
import { showError } from "../../services/alertService";
import usePagination from "../../services/usePagination";
import Pagination from "../../Components/AdminComponents/Pagination";

const DeptHeadOfficerList = () => {
    const [officers, setOfficers] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadOfficers = async () => {
        try {
            setLoading(true);

            const res = await getDepartmentOfficers();

            setOfficers(res.data || []);
        } catch (error) {
            console.error(error);
            showError("Failed to load officers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOfficers();
    }, []);

    const {
        currentPage,
        totalPages,
        currentData,
        nextPage,
        prevPage,
        setCurrentPage
    } = usePagination(officers, 5);

    return (
        <DeptLayout pageTitle="Officer List">
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "25px"
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <div>
                        <h2
                            style={{
                                margin: 0,
                                color: theme.colors.text.main
                            }}
                        >
                            Department Officers
                        </h2>

                        <p
                            style={{
                                marginTop: "6px",
                                color: theme.colors.text.gray,
                                fontSize: "14px"
                            }}
                        >
                            View officers assigned to your department
                        </p>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "12px 20px",
                            background: "white",
                            borderRadius: "14px",
                            boxShadow: theme.shadows.card,
                            color: theme.colors.brand.primary,
                            fontWeight: "700"
                        }}
                    >
                        <Users size={20} />
                        Total Officers: {officers.length}
                    </div>
                </div>

                {/* Table Card */}
                <div
                    style={{
                        background: "white",
                        borderRadius: theme.radius.card,
                        boxShadow: theme.shadows.card,
                        overflow: "hidden"
                    }}
                >
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse"
                        }}
                    >
                        <thead>
                            <tr
                                style={{
                                    background: "#FAFCFF",
                                    borderBottom: "1px solid #F4F7FE"
                                }}
                            >
                                <th style={thStyle}>OFFICER</th>
                                <th style={thStyle}>CONTACT DETAILS</th>
                                <th style={thStyle}>DEPARTMENT</th>
                                <th style={thStyle}>STATUS</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        style={{
                                            padding: "40px",
                                            textAlign: "center",
                                            color: theme.colors.text.gray
                                        }}
                                    >
                                        Loading officers...
                                    </td>
                                </tr>
                            ) : currentData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        style={{
                                            padding: "40px",
                                            textAlign: "center",
                                            color: theme.colors.text.gray
                                        }}
                                    >
                                        No officers found
                                    </td>
                                </tr>
                            ) : (
                                currentData.map((officer) => (
                                    <tr
                                        key={officer.userId}
                                        style={{
                                            borderBottom: "1px solid #F4F7FE"
                                        }}
                                    >
                                        {/* Officer */}
                                        <td style={tdStyle}>
                                            <div
                                                style={{
                                                    fontWeight: "700",
                                                    color:
                                                        theme.colors.text.main
                                                }}
                                            >
                                                {officer.name}
                                            </div>

                                            <div
                                                style={{
                                                    fontSize: "12px",
                                                    color:
                                                        theme.colors.text.gray,
                                                    marginTop: "4px"
                                                }}
                                            >
                                                ID #{officer.userId}
                                            </div>
                                        </td>

                                        {/* Contact */}
                                        <td style={tdStyle}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                    marginBottom: "8px",
                                                    color:
                                                        theme.colors.text.main
                                                }}
                                            >
                                                <Mail size={14} />
                                                {officer.email}
                                            </div>

                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                    color:
                                                        theme.colors.text.gray
                                                }}
                                            >
                                                <Phone size={14} />
                                                {officer.phone}
                                            </div>
                                        </td>

                                        {/* Department */}
                                        <td style={tdStyle}>
                                            {officer.departmentName}
                                        </td>

                                        {/* Status */}
                                        <td style={tdStyle}>
                                            <span
                                                style={{
                                                    padding: "7px 14px",
                                                    borderRadius: "10px",
                                                    fontSize: "12px",
                                                    fontWeight: "700",
                                                    background:
                                                        officer.isActive
                                                            ? "#E2F9EF"
                                                            : "#FFE9E9",
                                                    color: officer.isActive
                                                        ? "#05CD99"
                                                        : "#EE5D50"
                                                }}
                                            >
                                                {officer.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && officers.length > 0 && (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end"
                        }}
                    >
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            nextPage={nextPage}
                            prevPage={prevPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                )}
            </div>
        </DeptLayout>
    );
};

const thStyle = {
    padding: "20px",
    color: "#A3AED0",
    fontSize: "12px",
    fontWeight: "700",
    textAlign: "left"
};

const tdStyle = {
    padding: "20px",
    color: "#2B3674"
};

export default DeptHeadOfficerList;