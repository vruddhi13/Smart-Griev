import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, Clock, BarChart3 } from 'lucide-react';
import { adminTheme as theme } from '../../services/AdminServices/AdminTheme';

const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { id: 'dashboard', label: 'Main Dashboard', icon: LayoutDashboard, path: '/admin' },
        { id: 'users', label: 'User & Roles', icon: Users, path: '/admin/users' },
        { id: 'depts', label: 'Departments', icon: Building2, path: '/admin/departments' },
        { id: 'category', label: 'Category', icon: Building2, path: '/admin/category' },
        { id: 'sla', label: 'SLA Config', icon: Clock, path: '/admin/sla' },
        { id: 'complaints', label: 'Complaints', icon: Clock, path: '/admin/complaintdetails' },

    //    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    ];

    return (
        <aside style={{ width: '290px', background: 'white', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', borderRight: '1px solid #F4F7FE' }}>
            <div style={{ padding: '40px 30px', fontSize: '24px', fontWeight: '800', color: theme.colors.text.main }}>
                SMART<span style={{ fontWeight: '300', color: theme.colors.text.gray }}>GRIEV</span>
            </div>

            <nav style={{ flex: 1 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <div
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 30px', cursor: 'pointer',
                                color: isActive ? theme.colors.text.main : theme.colors.text.gray,
                                fontWeight: isActive ? '700' : '500',
                                borderRight: isActive ? `4px solid ${theme.colors.brand.primary}` : '4px solid transparent',
                                transition: '0.3s'
                            }}
                        >
                            <item.icon size={20} color={isActive ? theme.colors.brand.primary : '#A3AED0'} />
                            <span style={{ fontSize: '15px' }}>{item.label}</span>
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
};

export default AdminSidebar;