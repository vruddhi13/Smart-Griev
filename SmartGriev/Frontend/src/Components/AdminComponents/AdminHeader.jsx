import React from 'react';
import { Search, Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminTheme as theme } from '../../services/AdminServices/AdminTheme';

const AdminHeader = ({ title = "Admin Panel" }) => {
    const navigate = useNavigate();
    const storedUser = sessionStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : { name: "Admin" };

    const getInitials = (name) => {
        return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
    };

    const handleLogout = () => {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("roleId");
        navigate("/login");
    };

    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
            <div>
                <h2 style={{ color: theme.colors.text.main, fontSize: '28px', fontWeight: '700', margin: 0 }}>{title}</h2>
                <p style={{ color: theme.colors.text.gray, margin: 0, fontSize: '14px' }}>Welcome, {user.name}</p>
            </div>

            <div style={{ background: 'white', padding: '10px 20px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: theme.shadows.card }}>
                <div style={{ display: 'flex', alignItems: 'center', background: theme.colors.brand.bg, padding: '8px 15px', borderRadius: '20px' }}>
                    <Search size={16} color={theme.colors.text.gray} />
                    <input type="text" placeholder="Search..." style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '8px' }} />
                </div>

                <Bell size={20} color={theme.colors.text.gray} style={{ cursor: 'pointer' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '1px solid #eee', paddingLeft: '15px' }}>
                    <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: theme.colors.brand.primary, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px' }}>
                        {getInitials(user.name)}
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{ background: 'none', border: 'none', color: theme.colors.status.error, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;