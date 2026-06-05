import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardCheck, Users, BarChart3, Settings, AlertTriangle } from 'lucide-react';
import { deptHeadTheme as theme } from '../../services/DeptHeadServices/DeptHeadTheme';
const DeptHeadSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { id: 'dashboard', label: 'Dept Dashboard', icon: LayoutDashboard, path: '/depthead' },
        { id: 'complaints', label: 'Assigned Complaints', icon: ClipboardCheck, path: '/depthead/dept-assign' },
        { id: 'escalation', label: 'Escalation Inbox', icon: AlertTriangle, path: '/depthead/escalations' },
    ];

    return (
        <aside style={{ width: '290px', background: 'white', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', borderRight: '1px solid #F4F7FE' }}>
            <div style={{ padding: '40px 30px', fontSize: '24px', fontWeight: '800', color: theme.colors.text.main }}>
                DEPT<span style={{ fontWeight: '300', color: theme.colors.text.gray }}>HEAD</span>
            </div>
            <nav style={{ flex: 1 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <div key={item.id} onClick={() => navigate(item.path)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 30px', cursor: 'pointer',
                                color: isActive ? theme.colors.text.main : theme.colors.text.gray,
                                fontWeight: isActive ? '700' : '500',
                                borderRight: isActive ? `4px solid ${theme.colors.brand.primary}` : '4px solid transparent',
                                transition: '0.3s'
                            }}>
                            <item.icon size={20} color={isActive ? theme.colors.brand.primary : '#A3AED0'} />
                            <span style={{ fontSize: '15px' }}>{item.label}</span>
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
};

export default DeptHeadSidebar;