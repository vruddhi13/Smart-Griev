import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { adminTheme as theme } from '../../services/AdminServices/AdminTheme';
import { UserCheck, UserX, Users, Mail, Phone, Edit, Trash2, Plus, X } from 'lucide-react';
import { getUsers, toggleUserStatus, deleteUser, updateUser, addUser } from "../../services/AdminServices/AdminService";
import {
    showError,
    showSuccessToast,
    confirmDelete
} from "../../services/alertService";
import usePagination from '../../services/usePagination';
import Pagination from '../../Components/AdminComponents/Pagination';

const AdminUserRolePanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        roleId: 4,
        departmentId: ""
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

    const loadDepartments = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const res = await fetch("https://localhost:7224/api/admin/Department/dropdown", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            setDepartments(Array.isArray(data) ? data : data.data || []);
        } catch (err) {
            console.error("Department fetch error:", err);
        }
    };

    useEffect(() => {
        loadUsers();
        loadDepartments();
    }, []);

    const handleEdit = (user) => {
        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone,
            roleId: user.roleId,
            departmentId: user.departmentId || ""
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
                roleId: 4,
                departmentId: ""
            });
            loadUsers();
        } catch (error) {
            console.error(error);
            showError(error?.message || "Error processing user request");
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
            loadUsers();
        } catch (error) {
            console.error("Failed to toggle user status:", error);
            showError("Failed to update user status");
        }
    };

    const {
        currentPage,
        totalPages,
        currentData,
        nextPage,
        prevPage,
        setCurrentPage
    } = usePagination(users, 4);

    return (
        <AdminLayout pageTitle="Users">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                {/* HEADER SECTION */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    marginBottom: '5px'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        {/*<h2 style={{ color: theme.colors.text.main, margin: 0, fontSize: '24px', fontWeight: '700' }}>*/}
                        {/*    System Users*/}
                        {/*</h2>*/}
                        <p style={{
                            color: theme.colors.text.gray,
                            fontSize: '14px',
                            margin: '4px 0 0 0',
                            textAlign: 'left'
                        }}>
                            Manage user permissions and account status
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                            onClick={() => {
                                if (isFormOpen) {
                                    setIsFormOpen(false);
                                    setEditId(null);
                                    setFormData({
                                        name: '',
                                        email: '',
                                        phone: '',
                                        roleId: 4,
                                        departmentId: ""
                                    });
                                } else {
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
                                fontWeight: 'bold',
                                boxShadow: '0 4px 12px rgba(108, 99, 255, 0.15)',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {isFormOpen ? <X size={18} /> : <Plus size={18} />}
                            {isFormOpen ? "Cancel" : "Add User"}
                        </button>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 20px',
                            background: 'white',
                            borderRadius: '14px',
                            boxShadow: theme.shadows.card,
                            color: theme.colors.brand.primary,
                            fontWeight: 'bold',
                            height: '42px',
                            boxSizing: 'border-box'
                        }}>
                            <Users size={20} />
                            Total: {users.length}
                        </div>
                    </div>
                </div>

                {/* EDIT / ADD FORM */}
                {isFormOpen && (
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: theme.radius.card,
                        boxShadow: theme.shadows.card
                    }}>
                        <form
                            onSubmit={handleSubmit}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                                gap: '18px',
                                alignItems: 'end',
                                maxHeight: '400px',
                                overflowY: 'auto',
                                paddingRight: '8px'
                            }}
                        >
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
                                placeholder="Email Address"
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
                                onChange={(e) => handleRoleChange(Number(e.target.value))}
                                style={{ padding: '14px', borderRadius: '12px', border: '1px solid #E0E5F2', background: '#fff' }}
                            >
                                <option value={1}>Admin</option>
                                <option value={2}>Department Head</option>
                                <option value={3}>Officer</option>
                                <option value={4}>Citizen</option>
                            </select>

                            {/* Department Dropdown */}
                            {(formData.roleId === 2 || formData.roleId === 3) && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#7B809A' }}>
                                        Department
                                    </label>
                                    <select
                                        value={formData.departmentId}
                                        onChange={(e) => setFormData({ ...formData, departmentId: Number(e.target.value) })}
                                        required
                                        style={{
                                            width: '100%',
                                            height: '50px',
                                            padding: '0 14px',
                                            borderRadius: '14px',
                                            border: '1px solid #E2E8F0',
                                            background: '#fff',
                                            fontSize: '14px',
                                            color: '#2D3748',
                                            outline: 'none',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                                        }}
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map((dept) => (
                                            <option key={dept.departmentId} value={dept.departmentId}>
                                                {dept.departmentName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <button type="submit" style={{
                                padding: '14px 24px',
                                background: theme.colors.brand.primary,
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}>
                                {isEditMode ? "Update Role" : "Save Role"}
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
                                <th style={{ padding: '20px', color: '#A3AED0', fontSize: '12px', fontWeight: 'bold' }}>DEPARTMENT</th>
                                <th style={{ padding: '20px', color: '#A3AED0', fontSize: '12px', fontWeight: 'bold' }}>STATUS</th>
                                <th style={{ padding: '20px', color: '#A3AED0', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: theme.colors.text.gray }}>
                                        Loading users...
                                    </td>
                                </tr>
                            ) : currentData.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: theme.colors.text.gray }}>
                                        No users found.
                                    </td>
                                </tr>
                            ) : currentData.map((user) => (
                                <tr key={user.userId} style={{ borderBottom: '1px solid #F4F7FE', transition: '0.2s' }}>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ fontWeight: '700', color: theme.colors.text.main }}>{user.name}</div>
                                        <div style={{ fontSize: '12px', color: theme.colors.text.gray }}>ID: #{user.userId}</div>
                                    </td>

                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: theme.colors.text.main, fontSize: '14px' }}>
                                            <Mail size={14} color={theme.colors.text.gray} /> {user.email}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: theme.colors.text.gray, fontSize: '13px' }}>
                                            <Phone size={14} /> {user.phone}
                                        </div>
                                    </td>

                                    <td style={{ padding: '20px', color: theme.colors.text.main, fontWeight: '500' }}>
                                        {getRoleName(user.roleId)}
                                    </td>

                                    <td style={{ padding: '20px', color: theme.colors.text.main }}>
                                        {(user.roleId === 2 || user.roleId === 3)
                                            ? (user.departmentName || "No Department")
                                            : "-"
                                        }
                                    </td>

                                    <td style={{ padding: '20px' }}>
                                        <div style={{
                                            padding: '6px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block',
                                            background: user.isActive ? '#E2F9EF' : '#FFE9E9',
                                            color: user.isActive ? theme.colors.status.success : theme.colors.status.error
                                        }}>
                                            {user.isActive ? "Active" : "Block"}
                                        </div>
                                    </td>

                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                                            <button
                                                onClick={() => handleEdit(user)}
                                                style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                                                title="Edit"
                                            >
                                                <Edit size={20} color="#6C63FF" />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(user.userId)}
                                                style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                                                title="Delete"
                                            >
                                                <Trash2 size={20} color="#EE5D50" />
                                            </button>

                                            <button
                                                onClick={() => handleToggleStatus(user.userId)}
                                                style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                                                title={user.isActive ? "Deactivate" : "Activate"}
                                            >
                                                {user.isActive
                                                    ? <UserCheck size={20} color="#22C55E" />
                                                    : <UserX size={20} color="#EE5D50" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION SECTION */}
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

export default AdminUserRolePanel;