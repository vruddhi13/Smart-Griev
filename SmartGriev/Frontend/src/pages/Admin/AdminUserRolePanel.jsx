import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { adminTheme as theme } from '../../services/AdminServices/AdminTheme';
import { UserCheck, UserX, Users, Mail, Phone, Edit, Trash2, Plus,X } from 'lucide-react';
import { getUsers, toggleUserStatus, deleteUser, updateUser, addUser } from "../../services/AdminServices/AdminService";
import {
    showError,
    showSuccessToast,
    confirmDelete
} from "../../services/alertService";


const AdminUserRolePanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        roleId: 2
    });

    const isEditMode = editId !== null;

    const handleRoleChange = (roleId) => {
        if (roleId === 1) {
            showError("Admin cannot be modified");
            return;
        }

        let updatedEmail = formData.email;

        const namePart = formData.name?.toLowerCase().replace(/\s+/g, '');

        if (roleId === 2) {
            updatedEmail = `${namePart}_dept@smartgriev.com`;
        }
        else if (roleId === 3) {
            updatedEmail = `${namePart}_officer@smartgriev.com`;
        }
        else if (roleId === 4) {
            updatedEmail = `${namePart}_@gmail.com`;
        }

        setFormData({
            ...formData,
            roleId,
            email: updatedEmail
        });
    };

    const handleEmailChange = (value) => {
        let updatedRole = formData.roleId;

        if (value.endsWith("_dept@smartgriev.com")) {
            updatedRole = 2;
        }
        else if (value.endsWith("_officer@smartgriev.com")) {
            updatedRole = 3;
        }
        // ❌ DO NOT force citizen
        // keep role as it is

        setFormData({
            ...formData,
            email: value,
            roleId: updatedRole
        });
    };
    const loadUsers = async () => {
        try {
            setLoading(true);
            const res = await getUsers();
            setUsers(res.data || res);
        } catch (error) {
            console.error(error);
            showError(error?.message || "Error fetching users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleEdit = (user) => {
        setFormData({
            name: user.name,
            email: user.email, 
            phone: user.phone,
            roleId: user.roleId
        });

        setEditId(user.userId);
        setIsFormOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isEditMode) {
                await updateUser(editId, formData);
                showSuccessToast("User updated successfully");
            } else {
                await addUser(formData);
                showSuccessToast("User added successfully");
            }

            setIsFormOpen(false);
            setEditId(null);

            setFormData({
                name: '',
                email: '',
                phone: '',
                roleId: 4
            });

            loadUsers();

        } catch (error) {
            console.error(error);
            showError(error?.message || "Error fetching users");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {

        try {
            const confirmed = await confirmDelete();
            if (!confirmed) return;

            await deleteUser(id);

            showSuccessToast("User deleted successfully");

            loadUsers();

        } catch (error) {
            console.error(error);
            showError(error?.message || "Delete failed");
        }
    };

    const getRoleName = (roleId) => {
        switch (roleId) {
            case 1: return "Admin";
            case 2: return "Department Head";
            case 3: return "Officer";
            case 4: return "Citizen";
            default: return "Unknown";
        }
    };

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

                    <button
                        onClick={() => {
                            if (isFormOpen) {
                                // CANCEL MODE
                                setIsFormOpen(false);
                                setEditId(null);
                                setFormData({
                                    name: '',
                                    email: '',
                                    phone: '',
                                    roleId: 4
                                });
                            } else {
                                // ADD MODE
                                setIsFormOpen(true);
                                setEditId(null);
                            }
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 24px',
                            background: isFormOpen ? '#FF5B5B' : theme.colors.brand.primary,
                            color: 'white',
                            border: 'none',
                            borderRadius: '14px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        {isFormOpen ? <X size={18} /> : <Plus size={18} />}
                        {isFormOpen ? "Cancel" : "Add User"}
                    </button>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px',
                        background: 'white', borderRadius: '14px', boxShadow: theme.shadows.card,
                        color: theme.colors.brand.primary, fontWeight: 'bold'
                    }}>
                        <Users size={20} />
                        Total: {users.length}
                    </div>
                </div>


                {/* EDIT FORM */}
                {isFormOpen && (
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: theme.radius.card,
                        boxShadow: theme.shadows.card
                    }}>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '20px', alignItems: 'flex-end' }}>

                            <input
                                type="text"
                                value={formData.name}
                                placeholder="Name"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                style={{ padding: '14px', borderRadius: '12px', border: '1px solid #E0E5F2' }}
                            />

                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleEmailChange(e.target.value)}
                                disabled={formData.roleId === 2 || formData.roleId === 3}
                                style={{ padding: '14px', borderRadius: '12px', border: '1px solid #E0E5F2' }}
                            />
                            <input
                                type="text"
                                value={formData.phone}
                                placeholder="Phone"
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                                style={{ padding: '14px', borderRadius: '12px', border: '1px solid #E0E5F2' }}
                            />

                            <select
                                value={formData.roleId}
                                onChange={(e) => handleRoleChange(Number(e.target.value))}                                style={{ padding: '10px', borderRadius: '8px' }}>
                                <option value={1}>Admin</option>
                                <option value={2}>Department Head</option>
                                <option value={3}>Officer</option>
                                <option value={4}>Citizen</option>
                            </select>

                            <button type="submit" style={{
                                padding: '14px 24px',
                                background: theme.colors.brand.primary,
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: 'pointer'
                            }}>
                                Update User
                            </button>
                        </form>
                    </div>
                )}
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
                                        {getRoleName(user.roleId)}
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
                                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>

                                            {/* EDIT ICON ONLY */}
                                            <button
                                                onClick={() => handleEdit(user)}
                                                style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                                                title="Edit"
                                            >
                                                <Edit size={20} color="#6C63FF" />
                                            </button>

                                            {/* DELETE ICON */}
                                            <button
                                                onClick={() => handleDelete(user.userId)}
                                                style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                                                title="Delete"
                                            >
                                                <Trash2 size={20} color="#EE5D50" />
                                            </button>

                                            {/* STATUS ICON ONLY */}
                                            <button
                                                onClick={() => handleToggleStatus(user.userId)}
                                                style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                                                title={user.isActive ? "Deactivate" : "Activate"}
                                            >
                                                {user.isActive
                                                    ? <UserX size={20} color="#EE5D50" />
                                                    : <UserCheck size={20} color="#22C55E" />}
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