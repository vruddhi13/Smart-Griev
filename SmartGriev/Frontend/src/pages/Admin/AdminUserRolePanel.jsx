import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { adminTheme as theme } from '../../services/AdminServices/AdminTheme';
import { UserCheck, UserX, Users, Mail, Phone } from 'lucide-react';
import { getUsers, toggleUserStatus} from "../../services/AdminServices/AdminService";

const AdminUserRolePanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const res = await getUsers();
            // Checking if res.data exists based on your original snippet
            setUsers(res.data || res);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleToggleStatus = async (userId) => {
        try {
            await toggleUserStatus(userId);
            loadUsers(); // reload table after toggle
        } catch (error) {
            console.error("Failed to toggle user status:", error);
            alert("Failed to update user status");
        }
    };

    return (
        <AdminLayout pageTitle="Users">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                {/* HEADER SECTION */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ color: theme.colors.text.main, margin: 0 }}>System Users</h2>
                        <p style={{ color: theme.colors.text.gray, fontSize: '14px' }}>
                            Manage user permissions and account status
                        </p>
                    </div>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px',
                        background: 'white', borderRadius: '14px', boxShadow: theme.shadows.card,
                        color: theme.colors.brand.primary, fontWeight: 'bold'
                    }}>
                        <Users size={20} />
                        Total: {users.length}
                    </div>
                </div>

                {/* USERS TABLE */}
                <div style={{
                    background: 'white',
                    borderRadius: theme.radius.card,
                    boxShadow: theme.shadows.card,
                    overflow: 'hidden'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #F4F7FE', background: '#FAFCFF' }}>
                                <th style={{ padding: '20px', color: '#A3AED0', fontSize: '12px', fontWeight: 'bold' }}>USER</th>
                                <th style={{ padding: '20px', color: '#A3AED0', fontSize: '12px', fontWeight: 'bold' }}>CONTACT</th>
                                <th style={{ padding: '20px', color: '#A3AED0', fontSize: '12px', fontWeight: 'bold' }}>ROLE</th>
                                <th style={{ padding: '20px', color: '#A3AED0', fontSize: '12px', fontWeight: 'bold' }}>STATUS</th>
                                <th style={{ padding: '20px', color: '#A3AED0', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: theme.colors.text.gray }}>
                                        Loading users...
                                    </td>
                                </tr>
                            ) : users.map((user) => (
                                <tr key={user.userId} style={{ borderBottom: '1px solid #F4F7FE', transition: '0.2s' }}>
                                    {/* Name Column */}
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ fontWeight: '700', color: theme.colors.text.main }}>{user.name}</div>
                                        <div style={{ fontSize: '12px', color: theme.colors.text.gray }}>ID: #{user.userId}</div>
                                    </td>

                                    {/* Email & Phone Column */}
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: theme.colors.text.main, fontSize: '14px' }}>
                                            <Mail size={14} color={theme.colors.text.gray} /> {user.email}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: theme.colors.text.gray, fontSize: '13px' }}>
                                            <Phone size={14} /> {user.phone}
                                        </div>
                                    </td>

                                    {/* Role Column */}
                                    <td style={{ padding: '20px', color: theme.colors.text.main, fontWeight: '500' }}>
                                        {user.roleId === 1 ? 'Admin' : 'Citizens'}
                                    </td>

                                    {/* Status Column */}
                                    <td style={{ padding: '20px' }}>
                                        <div style={{
                                            padding: '6px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block',
                                            background: user.isActive ? '#E2F9EF' : '#FFE9E9',
                                            color: user.isActive ? theme.colors.status.success : theme.colors.status.error
                                        }}>
                                            {user.isActive ? "Active" : "Inactive"}
                                        </div>
                                    </td>

                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <button
                                                onClick={() => handleToggleStatus(user.userId)}
                                                style={{
                                                    border: 'none',
                                                    background: user.isActive ? '#FFF5F5' : '#F0F7FF',
                                                    padding: '8px 12px',
                                                    borderRadius: '10px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    color: user.isActive ? theme.colors.status.error : theme.colors.brand.primary,
                                                    fontWeight: '600',
                                                    fontSize: '13px',
                                                    transition: '0.2s'
                                                }}
                                                title={user.isActive ? "Deactivate User" : "Activate User"}
                                            >
                                                {user.isActive ? <UserX size={18} /> : <UserCheck size={18} />}
                                                {user.isActive ? "Deactivate" : "Activate"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminUserRolePanel;