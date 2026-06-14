import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Building2,
    Tags,
    AlertTriangle,
    TimerReset,
    // New differentiated icons that match the context actions perfectly
    Sliders,
    MessageSquareWarning,
    FileSearch,
    UserCheck,
    Activity,
    ShieldCheck
} from 'lucide-react';
import { adminTheme as theme } from '../../services/AdminServices/AdminTheme';

const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { id: 'dashboard', label: 'Main Dashboard', icon: LayoutDashboard, path: '/admin' },
        { id: 'users', label: 'User & Roles', icon: Users, path: '/admin/users' },
        { id: 'depts', label: 'Departments', icon: Building2, path: '/admin/departments' },
        { id: 'category', label: 'Category', icon: Tags, path: '/admin/category' },
        { id: 'sla', label: 'SLA Config', icon: Sliders, path: '/admin/sla' },
        { id: 'complaints', label: 'Complaints', icon: MessageSquareWarning, path: '/admin/complaintdetails' },
        { id: 'audit', label: 'Audit Logs', icon: FileSearch, path: '/admin/audit' },
        { id: 'escalations', label: 'Escalations', icon: AlertTriangle, path: '/admin/escalations' },
        { id: 'escalationComplaints', label: 'Escalation Complaints', icon: TimerReset, path: '/admin/escalation-complaints' },
        { id: 'assignments', label: 'Complaint Assignments', icon: UserCheck, path: '/admin/complaint-assignments' },
        { id: 'status-logs', label: 'Complaint Status Logs', icon: Activity, path: '/admin/status-logs' },
        { id: 'roles', label: 'Roles', icon: ShieldCheck, path: '/admin/roles' },
    ];

    return (
        <>
            {/* Smooth 2-Second Auto-Fading White Scrollbar Styles */}
            <style>
                {`
                    /* Target the nav scrolling area */
                    .smooth-sidebar-nav {
                        overflow-y: auto;
                        scroll-behavior: smooth;
                        
                        /* Define a CSS variable for the scrollbar color state */
                        --scrollbar-color: rgba(255, 255, 255, 0);
                        --scrollbar-shadow: inset 0 0 0px rgba(0, 0, 0, 0);
                    }

                    /* 1. Scrollbar dimensional configuration */
                    .smooth-sidebar-nav::-webkit-scrollbar {
                        width: 7px;
                    }
                    .smooth-sidebar-nav::-webkit-scrollbar-track {
                        background: transparent;
                    }

                    /* 2. Default state: Invisible white, with a 2-second fade-out transition */
                    .smooth-sidebar-nav::-webkit-scrollbar-thumb {
                        background-color: var(--scrollbar-color);
                        border-radius: 10px;
                        box-shadow: var(--scrollbar-shadow);
                        transition: background-color 2s ease-in-out, box-shadow 2s ease-in-out;
                    }

                    /* 3. When mouse enters the sidebar, immediately show the premium white scrollbar */
                    aside:hover .smooth-sidebar-nav {
                        --scrollbar-color: #ffffff;
                        /* Gives the white scrollbar subtle depth against the white sidebar background */
                        --scrollbar-shadow: inset 0 0 1px rgba(0, 0, 0, 0.2), 0 0 4px rgba(0, 0, 0, 0.1);
                    }
                    
                    /* Ensures fast reaction transition time when your mouse pointer enters */
                    aside:hover .smooth-sidebar-nav::-webkit-scrollbar-thumb {
                        transition: background-color 0.15s ease-out, box-shadow 0.15s ease-out;
                    }

                    /* 4. Slight interactive color bump when hover-dragging the scrollbar directly */
                    .smooth-sidebar-nav::-webkit-scrollbar-thumb:hover {
                        background-color: #fcfcfc !important;
                    }
                `}
            </style>

            <aside style={{
                width: '290px',
                background: 'white',
                display: 'flex',
                flexDirection: 'column',
                position: 'sticky',
                top: 0,
                height: '100vh',
                borderRight: '1px solid #F4F7FE',
                overflow: 'hidden' /* Keeps the header logo strictly stationary */
            }}>
                {/* Brand Header */}
                <div style={{ padding: '40px 30px 25px 30px', fontSize: '24px', fontWeight: '800', color: theme.colors.text.main }}>
                    SMART<span style={{ fontWeight: '300', color: theme.colors.text.gray }}>GRIEV</span>
                </div>

                {/* Independently Scrolled Nav Container */}
                <nav className="smooth-sidebar-nav" style={{ flex: 1, paddingBottom: '40px' }}>
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
        </>
    );
};

export default AdminSidebar;