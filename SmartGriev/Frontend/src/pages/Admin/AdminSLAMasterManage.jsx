import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { adminTheme as theme } from '../../services/AdminServices/AdminTheme';
import { Plus, Trash2, Edit, X, Clock, ShieldAlert, Layers } from 'lucide-react';
import {
    getSlas,
    addSla,
    updateSla,
    deleteSla,
    getDepartments,
    getCategories
} from "../../services/AdminServices/AdminService";

const AdminSLAMaster = () => {
    const [slas, setSlas] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState(null);

    // Form States
    const [formData, setFormData] = useState({
        departmentId: '',
        categoryId: '',
        priorityLevel: '',
        resolutionHours: '',
        escalationHours: ''
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [slaData, deptData, catData] = await Promise.all([
                getSlas(),
                getDepartments(),
                getCategories()
            ]);
            setSlas(slaData);
            setDepartments(deptData);
            setCategories(catData);
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
                await updateSla(editId, formData);
                alert("SLA updated successfully");
            } else {
                await addSla(formData);
                alert("SLA added successfully");
            }
            resetForm();
            fetchData();
        } catch (error) {
            console.error("API Error:", error);
            alert("Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this SLA policy?")) return;
        try {
            await deleteSla(id);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const resetForm = () => {
        setFormData({
            departmentId: '',
            categoryId: '',
            priorityLevel: '',
            resolutionHours: '',
            escalationHours: ''
        });
        setEditId(null);
        setIsFormOpen(false);
    };

    const handleEdit = (sla) => {
        setFormData({
            departmentId: sla.departmentId,
            categoryId: sla.categoryId,
            priorityLevel: sla.priorityLevel,
            resolutionHours: sla.resolutionHours,
            escalationHours: sla.escalationHours
        });
        setEditId(sla.slaId);
        setIsFormOpen(true);
    };

    return (
        <AdminLayout pageTitle="SLA Management">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                {/* HEADER SECTION */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ color: theme.colors.text.main, margin: 0 }}>SLA Master</h2>
                        <p style={{ color: theme.colors.text.gray, fontSize: '14px' }}>Define resolution and escalation timelines by priority</p>
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
                        {isFormOpen ? "Cancel" : "Add SLA Policy"}
                    </button>
                </div>

                {/* ADD/EDIT FORM */}
                {isFormOpen && (
                    <div style={{
                        background: 'white', padding: '30px', borderRadius: theme.radius.card,
                        boxShadow: theme.shadows.card, animation: 'slideDown 0.3s ease-out'
                    }}>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                            {/* Department Dropdown */}
                            <div>
                                <label style={labelStyle}>Department</label>
                                <select
                                    required
                                    value={formData.departmentId}
                                    disabled={editId !== null}
                                    onChange={(e) => setFormData({ ...formData, departmentId: parseInt(e.target.value) })}
                                    style={inputStyle}
                                >
                                    <option value="">Select Department</option>
                                    {departments.map((d) => (
                                        <option key={d.departmentId} value={d.departmentId}>{d.departmentName}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Category Dropdown */}
                            <div>
                                <label style={labelStyle}>Category</label>
                                <select
                                    required
                                    value={formData.categoryId}
                                    disabled={editId !== null}
                                    onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                                    style={inputStyle}
                                >
                                    <option value="">Select Category</option>
                                    {categories
                                        .filter(c => !formData.departmentId || c.departmentId === formData.departmentId)
                                        .map((c) => (
                                            <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                                        ))}
                                </select>
                            </div>

                            {/* Priority Dropdown */}
                            <div>
                                <label style={labelStyle}>Priority Level</label>
                                <select
                                    required
                                    value={formData.priorityLevel}
                                    onChange={(e) => setFormData({ ...formData, priorityLevel: e.target.value })}
                                    style={inputStyle}
                                >
                                    <option value="">Select Priority</option>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Urgent">Urgent</option>
                                </select>
                            </div>

                            {/* Resolution Hours */}
                            <div>
                                <label style={labelStyle}>Resolution Time (Hours)</label>
                                <div style={{ position: 'relative' }}>
                                    <Clock size={16} style={iconInputStyle} />
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={formData.resolutionHours}
                                        onChange={(e) => setFormData({ ...formData, resolutionHours: parseInt(e.target.value) })}
                                        style={{ ...inputStyle, paddingLeft: '40px' }}
                                    />
                                </div>
                            </div>

                            {/* Escalation Hours */}
                            <div>
                                <label style={labelStyle}>Escalation Warning (Hours)</label>
                                <div style={{ position: 'relative' }}>
                                    <ShieldAlert size={16} style={iconInputStyle} />
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={formData.escalationHours}
                                        onChange={(e) => setFormData({ ...formData, escalationHours: parseInt(e.target.value) })}
                                        style={{ ...inputStyle, paddingLeft: '40px' }}
                                    />
                                </div>
                            </div>

                            <div style={{ gridColumn: 'span 3', display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                                <button type="submit" style={submitBtnStyle}>
                                    {editId ? "Update SLA Policy" : "Create SLA Policy"}
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
                                <th style={thStyle}>DEPARTMENT & CATEGORY</th>
                                <th style={thStyle}>PRIORITY</th>
                                <th style={thStyle}>RESOLUTION</th>
                                <th style={thStyle}>ESCALATION</th>
                                <th style={thStyle}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center' }}>Loading SLA Rules...</td></tr>
                            ) : slas.length === 0 ? (
                                <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center' }}>No SLA rules defined.</td></tr>
                            ) : slas.map((sla) => (
                                <tr key={sla.slaId} style={{ borderBottom: '1px solid #F4F7FE' }}>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ fontWeight: '600', color: '#2B3674' }}>{sla.category?.categoryName || `ID: ${sla.categoryId}`}</div>
                                        <div style={{ fontSize: '12px', color: '#A3AED0' }}>{sla.department?.departmentName || `Dept ID: ${sla.departmentId}`}</div>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <span style={{
                                            padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                                            background: getPriorityColor(sla.priorityLevel).bg,
                                            color: getPriorityColor(sla.priorityLevel).text
                                        }}>
                                            {sla.priorityLevel}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2B3674', fontWeight: '500' }}>
                                            <Clock size={14} /> {sla.resolutionHours} Hours
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#EE5D50' }}>
                                            <ShieldAlert size={14} /> {sla.escalationHours} Hours
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            <button onClick={() => handleEdit(sla)} style={actionBtnStyle}><Edit size={18} color="#A3AED0" /></button>
                                            <button onClick={() => handleDelete(sla.slaId)} style={actionBtnStyle}><Trash2 size={18} color="#EE5D50" /></button>
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

// Helper for Priority Colors
const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
        case 'urgent': return { bg: '#FFF5F5', text: '#FF5B5B' };
        case 'high': return { bg: '#FFF9E6', text: '#FFB800' };
        case 'medium': return { bg: '#E2F9EF', text: '#05CD99' };
        default: return { bg: '#F4F7FE', text: '#A3AED0' };
    }
};

// Internal Component Styles
const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#2B3674' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E0E5F2', outline: 'none', fontSize: '15px' };
const iconInputStyle = { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A3AED0' };
const thStyle = { padding: '20px', color: '#A3AED0', fontSize: '12px', fontWeight: 'bold' };
const actionBtnStyle = { border: 'none', background: 'none', cursor: 'pointer' };
const submitBtnStyle = { padding: '14px 30px', background: '#4318FF', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' };

export default AdminSLAMaster;