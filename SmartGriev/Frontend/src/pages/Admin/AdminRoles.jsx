import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { adminTheme as theme } from '../../services/AdminServices/AdminTheme';
import { Shield } from 'lucide-react';
import { showError } from "../../services/alertservice";
import { getRoles } from "../../services/accountservice";
import usePagination from '../../services/usePagination';
import Pagination from '../../Components/AdminComponents/Pagination';

const AdminRoles = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRolesData = async () => {
        try {
            setLoading(true);
            const data = await getRoles();
            setRoles(data);
        } catch (error) {
            console.error("Error fetching roles:", error);
            showError("Failed to load user roles");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRolesData();
    }, []);

    // Pagination hook setup (5 records per page)
    const {
        currentPage,
        totalPages,
        currentData,
        nextPage,
        prevPage,
        setCurrentPage
    } = usePagination(roles, 5);

    return (
        <AdminLayout pageTitle="User Roles Management">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                {/* HEADER SECTION */}
                <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                    <p style={{
                        color: theme.colors.text.gray,
                        fontSize: '14px',
                        margin: 0,
                        textAlign: 'left' // Explicitly aligns text characters to the left
                    }}>
                        View and manage system permissions and access security tiers
                    </p>
                </div>

                {/* TABLE SECTION */}
                <div style={{ background: 'white', borderRadius: theme.radius.card, boxShadow: theme.shadows.card, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #F4F7FE', background: '#FAFCFF' }}>
                                <th style={thStyle}>ROLE ID</th>
                                <th style={thStyle}>ROLE NAME</th>
                                <th style={thStyle}>DESCRIPTION</th>
                                <th style={thStyle}>CREATED AT</th>
                                <th style={thStyle}>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: theme.colors.text.gray }}>
                                        Loading system configuration roles...
                                    </td>
                                </tr>
                            ) : currentData.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: theme.colors.text.gray }}>
                                        No roles configured in system database.
                                    </td>
                                </tr>
                            ) : (
                                currentData.map((role) => (
                                    <tr key={role.roleId} style={{ borderBottom: '1px solid #F4F7FE' }}>
                                        {/* ROLE ID */}
                                        <td style={{ padding: '20px', color: theme.colors.text.gray, fontSize: '14px' }}>
                                            {role.roleId}
                                        </td>

                                        {/* ROLE NAME */}
                                        <td style={{ padding: '20px', fontWeight: '600', color: '#2B3674' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Shield size={16} color={theme.colors.brand.primary} />
                                                {role.roleName}
                                            </div>
                                        </td>

                                        {/* DESCRIPTION */}
                                        <td style={{ padding: '20px', color: theme.colors.text.gray, maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {role.description || <span style={{ fontStyle: 'italic', color: '#CBD5E1' }}>No description provided</span>}
                                        </td>

                                        {/* CREATED DATE */}
                                        <td style={{ padding: '20px', color: theme.colors.text.gray, fontSize: '14px' }}>
                                            {new Date(role.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>

                                        {/* ACTIVE STATUS BADGE */}
                                        <td style={{ padding: '20px' }}>
                                            <div style={{
                                                padding: '4px 12px',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                background: role.isActive ? '#E2F9EF' : '#FFEBEB',
                                                color: role.isActive ? theme.colors.status.success : '#FF5B5B'
                                            }}>
                                                {role.isActive ? "Active" : "Inactive"}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION CONTROL CONTAINER */}
                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "-12px",
                    width: "100%"
                }}>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        nextPage={nextPage}
                        prevPage={prevPage}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            </div>
        </AdminLayout>
    );
};

// Internal Scoping Style Objects
const thStyle = { padding: '20px', color: '#A3AED0', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' };

export default AdminRoles;