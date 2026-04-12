import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { adminTheme as theme } from '../../services/AdminServices/AdminTheme';
import { ListTree, Plus, Trash2, Edit, X, Clock, Info } from 'lucide-react';
import {
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    getDepartments // Needed for the dropdown
} from "../../services/AdminServices/AdminService";
import usePagination from '../../services/usePagination';
import Pagination from '../../Components/AdminComponents/Pagination';


const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState(null);

    // Form States
    const [formData, setFormData] = useState({
        categoryName: '',
        departmentId: '',
        description: ''
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [catData, deptData] = await Promise.all([
                getCategories(),
                getDepartments()
            ]);
            setCategories(catData);
            setDepartments(deptData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await updateCategory(editId, formData);
                alert("Category updated successfully");
            } else {
                await addCategory(formData);
                alert("Category added successfully");
            }
            resetForm();
            fetchData();
        } catch (error) {
            console.error("API Error:", error);
            alert("Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Soft delete this category?")) return;
        try {
            await deleteCategory(id);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const resetForm = () => {
        setFormData({ categoryName: '', departmentId: '', description: ''});
        setEditId(null);
        setIsFormOpen(false);
    };

    const handleEdit = (cat) => {
        setFormData({
            categoryName: cat.categoryName,
            departmentId: cat.departmentId,
            description: cat.description
        });
        setEditId(cat.categoryId);
        setIsFormOpen(true);
    };

    const {
        currentPage,
        totalPages,
        currentData,
        nextPage,
        prevPage,
        setCurrentPage
    } = usePagination(categories, 5);

    return (
        <AdminLayout pageTitle="Complaint Categories">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                {/* HEADER SECTION */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ color: theme.colors.text.main, margin: 0 }}>Complaint Categories</h2>
                        <p style={{ color: theme.colors.text.gray, fontSize: '14px' }}>Map complaint types to specific departments</p>
                    </div>
                    <button
                        onClick={() => (isFormOpen ? resetForm() : setIsFormOpen(true))}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
                            background: isFormOpen ? '#FF5B5B' : theme.colors.brand.primary,
                            color: 'white', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold'
                        }}
                    >
                        {isFormOpen ? <X size={18} /> : <Plus size={18} />}
                        {isFormOpen ? "Cancel" : "Add Category"}
                    </button>
                </div>

                {/* ADD/EDIT FORM */}
                {isFormOpen && (
                    <div style={{
                        background: 'white', padding: '30px', borderRadius: theme.radius.card,
                        boxShadow: theme.shadows.card, animation: 'slideDown 0.3s ease-out'
                    }}>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={labelStyle}>Category Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.categoryName}
                                    onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                                    placeholder="e.g. Water Leakage"
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Assign Department</label>
                                <select
                                    required
                                    value={formData.departmentId}
                                    disabled={editId !== null}
                                    onChange={(e) => setFormData({ ...formData, departmentId: parseInt(e.target.value) })}
                                    style={inputStyle}
                                >
                                    <option value="">Select Department</option>
                                    {departments.map((d) => (
                                        <option key={d.departmentId} value={d.departmentId}>
                                            {d.departmentName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/*<div>*/}
                            {/*    <label style={labelStyle}>SLA Resolution Time (Hours)</label>*/}
                            {/*    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>*/}
                            {/*        <Clock size={16} style={{ position: 'absolute', left: '12px', color: '#A3AED0' }} />*/}
                            {/*        <input*/}
                            {/*            type="number"*/}
                            {/*            value={formData.slaHours}*/}
                            {/*            onChange={(e) => setFormData({ ...formData, slaHours: parseInt(e.target.value) })}*/}
                            {/*            style={{ ...inputStyle, paddingLeft: '40px' }}*/}
                            {/*        />*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                            <div>
                                <label style={labelStyle}>Description</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Short brief of category"
                                    style={inputStyle}
                                />
                            </div>
                            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
                                <button type="submit" style={submitBtnStyle}>
                                    {editId ? "Update Category" : "Save Category"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* TABLE SECTION */}
                <div style={{ background: 'white', borderRadius: theme.radius.card, boxShadow: theme.shadows.card, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #F4F7FE', background: '#FAFCFF' }}>
                                <th style={thStyle}>CATEGORY</th>
                                <th style={thStyle}>DEPARTMENT</th>
                                {/*<th style={thStyle}>SLA</th>*/}
                                <th style={thStyle}>STATUS</th>
                                <th style={thStyle}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center' }}>Loading...</td></tr>
                            ) : currentData.map((cat) => (
                                <tr key={cat.categoryId} style={{ borderBottom: '1px solid #F4F7FE' }}>
                                    <td style={{ padding: '20px', fontWeight: '600' }}>{cat.categoryName}</td>
                                    <td style={{ padding: '20px', color: theme.colors.text.gray }}>{cat.departmentName}</td>
                                    {/*<td style={{ padding: '20px' }}>*/}
                                    {/*    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px' }}>*/}
                                    {/*        <Clock size={14} /> {cat.slaHours}h*/}
                                    {/*    </span>*/}
                                    {/*</td>*/}
                                    <td style={{ padding: '20px' }}>
                                        <div style={{
                                            padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block',
                                            background: '#E2F9EF', color: theme.colors.status.success
                                        }}>
                                            Active
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            <button onClick={() => handleEdit(cat)} style={actionBtnStyle}><Edit size={18} color="#A3AED0" /></button>
                                            <button onClick={() => handleDelete(cat.categoryId)} style={actionBtnStyle}><Trash2 size={18} color="#EE5D50" /></button>
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

// Internal Component Styles
const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#2B3674' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E0E5F2', outline: 'none', fontSize: '15px' };
const thStyle = { padding: '20px', color: '#A3AED0', fontSize: '12px', fontWeight: 'bold' };
const actionBtnStyle = { border: 'none', background: 'none', cursor: 'pointer' };
const submitBtnStyle = { padding: '14px 30px', background: '#4318FF', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' };

export default AdminCategories;