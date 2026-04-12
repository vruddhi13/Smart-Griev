import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { adminTheme as theme } from '../../services/AdminServices/AdminTheme';
import { Building2, Plus, Trash2, Edit, X, UserX, UserCheck } from 'lucide-react';
import { getDepartments, addDepartment, updateDepartment, deleteDepartment, toggleDepartmentStatus } from "../../services/AdminServices/AdminService"; 
import usePagination from '../../services/usePagination';
import Pagination from '../../Components/AdminComponents/Pagination';

const AdminDepartments = () => {
    const [departments, setDepartments] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [deptName, setDeptName] = useState('');
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState(null);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const data = await getDepartments();
            setDepartments(data);

        } catch (error) {
            console.error("Error fetching departments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleToggleStatus = async (deptId) => {
        try {
            await toggleDepartmentStatus(deptId);
            fetchDepartments(); // Refresh the table
        } catch (error) {
            console.error("Failed to toggle department status:", error);
            alert("Failed to update status");
        }
    };

    // 2. Handle adding a new department
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                // UPDATE
                await updateDepartment(editId, {
                    departmentName: deptName,
                    isActive: true
                });
            } else {
                // CREATE
                await addDepartment({
                    departmentName: deptName,
                    isActive: true
                });
            }
            setDeptName('');
            setEditId(null);
            setIsFormOpen(false);

            fetchDepartments();

        } catch (error) {
            alert("Something went wrong.");
            console.log(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this department?"))
            return;
        try {
            await deleteDepartment(id);
            fetchDepartments();
        } catch (error) {
            console.error(error);
            alert("Delete failed");

        }
    };

    const {
        currentPage,
        totalPages,
        currentData,
        nextPage,
        prevPage,
        setCurrentPage
    } = usePagination(departments, 4);

    return (
        <AdminLayout pageTitle="Departments">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                {/* HEADER SECTION */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ color: theme.colors.text.main, margin: 0 }}>City Departments</h2>
                        <p style={{ color: theme.colors.text.gray, fontSize: '14px' }}>Manage and monitor municipal sectors</p>
                    </div>
                    <button
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
                            background: isFormOpen ? '#FF5B5B' : theme.colors.brand.primary,
                            color: 'white', border: 'none', borderRadius: '14px',
                            cursor: 'pointer', fontWeight: 'bold', transition: '0.3s',
                            boxShadow: '0px 4px 12px rgba(67, 24, 255, 0.2)'
                        }}
                    >
                        {isFormOpen ? <X size={18} /> : <Plus size={18} />}
                        {isFormOpen ? "Cancel" : "Add Department"}
                    </button>
                </div>

                {/* ADD DEPARTMENT FORM */}
                {isFormOpen && (
                    <div style={{
                        background: 'white', padding: '30px', borderRadius: theme.radius.card,
                        boxShadow: theme.shadows.card, animation: 'slideDown 0.3s ease-out'
                    }}>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', fontWeight: '600', color: theme.colors.text.main }}>
                                    Department Name
                                </label>
                                <input
                                    type="text"
                                    value={deptName}
                                    onChange={(e) => setDeptName(e.target.value)}
                                    placeholder="Enter department (e.g., Waste Management)"
                                    required
                                    style={{
                                        width: '100%', padding: '14px', borderRadius: '12px',
                                        border: '1px solid #E0E5F2', outline: 'none', fontSize: '15px'
                                    }}
                                />
                            </div>
                            <button type="submit" style={{
                                padding: '14px 30px', background: theme.colors.brand.primary,
                                color: 'white', border: 'none', borderRadius: '12px',
                                cursor: 'pointer', fontWeight: '600'
                            }}>
                                {editId ? "Update Department" : "Save Department"}
                            </button>
                        </form>
                    </div>
                )}

                {/* DEPARTMENTS TABLE */}
                <div style={{ background: 'white', borderRadius: theme.radius.card, boxShadow: theme.shadows.card, overflow: 'hidden', marginTop:'28px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #F4F7FE', background: '#FAFCFF' }}>
                                {/*<th style={{ padding: '20px', color: '#A3AED0', fontSize: '12px', fontWeight: 'bold' }}>ID</th>*/}
                                <th style={{ padding: '20px', color: '#A3AED0', fontSize: '12px', fontWeight: 'bold' }}>DEPARTMENT</th>
                                <th style={{ padding: '20px', color: '#A3AED0', fontSize: '12px', fontWeight: 'bold' }}>STATUS</th>
                                <th style={{ padding: '20px', color: '#A3AED0', fontSize: '12px', fontWeight: 'bold' }}>DATE CREATED</th>
                                <th style={{ padding: '20px', color: '#A3AED0', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: theme.colors.text.gray }}>Loading departments...</td></tr>
                            ) : currentData.map((dept) => (
                                <tr key={dept.departmentId} style={{ borderBottom: '1px solid #F4F7FE', transition: '0.2s' }}>
                                    {/*<td style={{ padding: '20px', fontWeight: '700', color: theme.colors.text.main }}>{dept.departmentId}</td>*/}
                                    <td style={{ padding: '20px', color: theme.colors.text.main, fontWeight: '500' }}>{dept.departmentName}</td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{
                                            padding: '6px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block',
                                            background: dept.isActive ? '#E2F9EF' : '#FFE9E9',
                                            color: dept.isActive ? theme.colors.status.success : theme.colors.status.error
                                        }}>
                                            {dept.isActive ? "Active" : "Block"}
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px', color: theme.colors.text.gray, fontSize: '14px' }}>
                                        {new Date(dept.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                                            <button onClick={() => { setDeptName(dept.departmentName); setEditId(dept.departmentId); setIsFormOpen(true); }} style={{ border: 'none', background: 'none', cursor: 'pointer' }} title="Edit">
                                                <Edit size={19} color="#A3AED0" />
                                            </button>
                                            <button onClick={() => handleDelete(dept.departmentId)} style={{ border: 'none', background: 'none', cursor: 'pointer' }} title="Delete">
                                                <Trash2 size={19} color="#EE5D50" />
                                            </button>
                                            {/* TOGGLE STATUS BUTTON */}
                                            <button
                                                onClick={() => handleToggleStatus(dept.departmentId)}
                                                style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                                                title={dept.isActive ? "Deactivate" : "Activate"}
                                            >
                                                {dept.isActive
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

export default AdminDepartments;