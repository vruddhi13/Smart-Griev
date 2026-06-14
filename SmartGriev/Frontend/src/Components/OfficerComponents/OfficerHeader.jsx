import React, { useState, useEffect } from "react";
import {
    Search,
    Bell,
    LogOut,
    Inbox,
    X,
    CheckCircle,
    Trash2,
    History,
    AlertTriangle,
    Clock
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { officerTheme as theme } from "../../services/OfficerServices/OfficerTheme";

import {
    getNotifications,
    markNotificationRead,
    deleteNotification,
    checkSlaReminders
} from "../../services/OfficerServices/OfficerService";


const OfficerHeader = ({ title = "Officer Panel" }) => {
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
    const storedUser = sessionStorage.getItem("user");
    const user = storedUser
        ? JSON.parse(storedUser)
        : { name: "Officer" };
    const userId = user?.userId;
    const getInitials = (name) => {
        return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/login");
    };


    useEffect(() => {
        if (!userId) return;

        const fetchNotifications = async () => {
            try {

                await checkSlaReminders(); // generate SLA alerts

                const data = await getNotifications(userId);

                setNotifications(data || []);

            } catch (err) {
                console.error(err);
            }
        };
        fetchNotifications();

        const interval =
            setInterval(fetchNotifications, 5000);

        return () => clearInterval(interval);

    }, [userId, selectedHistoryItem]);

    const handleDeleteNotification =
        async (id) => {

            try {

                await deleteNotification(id);

                setNotifications(prev =>
                    prev.filter(
                        n =>
                            n.notificationId !== id
                    )
                );

            }
            catch (err) {
                console.error(err);
            }
        };
    const markAsRead = async (notificationId) => {
        try {

            await markNotificationRead(
                notificationId
            );

            setNotifications(prev =>
                prev.map(n =>
                    n.notificationId === notificationId
                        ? { ...n, isRead: true }
                        : n
                )
            );

        }
        catch (err) {
            console.error(err);
        }
    };

    const readNotifications =
        notifications.filter(
            n => n.isRead
        );

    const unreadCount =
        notifications.filter(
            n => !n.isRead
        ).length;
    return (
        <>
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
                marginBottom: '35px',
                position: "relative",
                zIndex: 1000
        }}>
            <div>
                <h2 style={{
                    color: theme.colors.text.main,
                    fontSize: '28px',
                    fontWeight: '700',
                    margin: 0
                }}>
                    {title}
                </h2>
                <p style={{ color: theme.colors.text.gray, margin: 0 }}>
                    Welcome, {user.name}
                </p>
            </div>

            <div style={{
                background: 'white',
                padding: '10px 20px',
                borderRadius: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                boxShadow: theme.shadows.card
            }}>

                {/* Search */}
                {/*<div style={{*/}
                {/*    display: 'flex',*/}
                {/*    alignItems: 'center',*/}
                {/*    background: theme.colors.brand.bg,*/}
                {/*    padding: '8px 15px',*/}
                {/*    borderRadius: '20px'*/}
                {/*}}>*/}
                {/*    <Search size={16} color={theme.colors.text.gray} />*/}
                {/*    <input*/}
                {/*        placeholder="Search..."*/}
                {/*        style={{*/}
                {/*            border: 'none',*/}
                {/*            outline: 'none',*/}
                {/*            background: 'transparent',*/}
                {/*            marginLeft: '8px'*/}
                {/*        }}*/}
                {/*    />*/}
                {/*</div>*/}

                {/* Notifications */}
                <div style={{ position: 'relative' }}>
                    <div
                        onClick={() => setShowNotifications(!showNotifications)}
                        style={{ cursor: 'pointer', position: 'relative' }}
                    >
                        <Bell size={20} color={theme.colors.text.gray} />
                            {unreadCount > 0 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        top: "-8px",
                                        right: "-10px",
                                        minWidth: "20px",
                                        height: "20px",
                                        borderRadius: "50%",
                                        background: "#ef4444",
                                        color: "#fff",
                                        fontSize: "11px",
                                        fontWeight: "600",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border: "2px solid white",
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
                                    }}
                                >
                                    {unreadCount > 99 ? "99+" : unreadCount}
                                </span>
                            )}
                    </div>

                    {showNotifications && (
                            <div style={{
                                position: 'absolute',
                                top: '45px',
                                right: '-40px',
                                width: '420px',
                                background: 'white',
                                borderRadius: '10px',
                                boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                                zIndex: 1000,
                                border: '1px solid #e2e8f0',
                                overflow: 'hidden'
                            }}>
                                <div
                                    style={{
                                        padding: "15px 18px",
                                        background: "#f8fafc",
                                        borderBottom: "1px solid #e2e8f0",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}
                                >
                                    <div>
                                        <div
                                            style={{
                                                fontWeight: "700",
                                                fontSize: "15px",
                                                color: "#1e293b"
                                            }}
                                        >
                                            Recent Activity
                                        </div>

                                        <div
                                            style={{
                                                fontSize: "12px",
                                                color: "#64748b"
                                            }}
                                        >
                                            {notifications.length} Notifications
                                        </div>
                                    </div>

                                    <Bell size={18} color="#2563eb" />
                                </div>

                                {notifications.map((n) => (
                                    <div
                                        key={n.notificationId}
                                        onClick={() => markAsRead(n.notificationId)}
                                        style={{
                                            display: 'flex',
                                            gap: '12px',
                                            padding: '14px 15px',
                                            borderBottom: '1px solid #f1f5f9',
                                            cursor: 'pointer',
                                            background: !n.isRead
                                                ? '#f0fff4'
                                                : '#fff'
                                        }}
                                    >
                                        {/* ADD HERE */}
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                marginBottom: "5px"
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px"
                                                }}
                                            >
                                                {n.notificationType === "SLA" ? (
                                                    <Clock size={15} color="#f59e0b" />
                                                ) : n.notificationType === "Escalation" ? (
                                                    <AlertTriangle size={15} color="#ef4444" />
                                                ) : (
                                                    <Bell size={15} color="#2563eb" />
                                                )}

                                                <strong>{n.title}</strong>
                                            </div>

                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px"
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={n.isRead}
                                                    disabled={n.isRead}
                                                />
                                                <Trash2
                                                    size={15}
                                                    color="#ef4444"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteNotification(
                                                            n.notificationId
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div style={{ fontSize: "13px" }}>
                                            {n.message}
                                        </div>

                                        {n.notificationType === "SLA" && (
                                            <div
                                                style={{
                                                    marginTop: "5px",
                                                    display: "inline-block",
                                                    background: "#f59e0b",
                                                    color: "#fff",
                                                    padding: "2px 8px",
                                                    borderRadius: "10px",
                                                    fontSize: "10px"
                                                }}
                                            >
                                                SLA REMINDER
                                            </div>
                                        )}

                                        {n.notificationType === "Escalation" && (
                                            <div
                                                style={{
                                                    marginTop: "5px",
                                                    display: "inline-block",
                                                    background: "#dc2626",
                                                    color: "#fff",
                                                    padding: "2px 8px",
                                                    borderRadius: "10px",
                                                    fontSize: "10px"
                                                }}
                                            >
                                                ESCALATION
                                            </div>
                                        )}

                                        <div
                                            style={{
                                                fontSize: "11px",
                                                color: "#94a3b8",
                                                marginTop: "4px"
                                            }}
                                        >
                                            {new Date(n.sentAt).toLocaleString()}
                                        </div>
                                    </div>
                                ))}

                            <div
                                onClick={() => {
                                    setShowNotifications(false);
                                    setShowHistoryModal(true);

                                    if (readNotifications.length > 0) {
                                        setSelectedHistoryItem(readNotifications[0]);
                                    }
                                }}
                                style={{
                                    padding: "12px",
                                    textAlign: "center",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    borderTop: "1px solid #eee",
                                    color: theme.colors.brand.primary
                                }}
                            >
                                Notification History
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile + Logout */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderLeft: '1px solid #eee',
                    paddingLeft: '15px'
                }}>
                    <div style={{
                        width: '35px',
                        height: '35px',
                        borderRadius: '50%',
                        background: theme.colors.brand.primary,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                    }}>
                        {getInitials(user.name)}
                    </div>

                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: theme.colors.status.error,
                            cursor: 'pointer'
                        }}
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </header>
            {showHistoryModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2000
                }}>
                    <div style={{
                        background: "white",
                        width: "92%",
                        maxWidth: "900px",
                        height: "80vh",
                        borderRadius: "16px",
                        overflow: "hidden",
                        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                        display: 'flex',
                        flexDirection: 'column'
                    }}>

                        {/* Header */}
                        <div style={{
                            background: "linear-gradient(135deg, #1e293b, #0f172a)",
                            color: "white",
                            padding: "18px 24px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <Inbox
                                    size={22}
                                    style={{ color: '#38bdf8' }}
                                />
                                <div>
                                    <h3 style={{
                                        margin: 0,
                                        fontSize: '18px',
                                        fontWeight: '600'
                                    }}>
                                        Notification Archive
                                    </h3>

                                    <p style={{
                                        margin: 0,
                                        fontSize: '12px',
                                        color: '#94a3b8'
                                    }}>
                                        Review all officer notifications
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowHistoryModal(false)}
                                style={{
                                    background: "rgba(255,255,255,0.1)",
                                    border: "none",
                                    color: "white",
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            overflow: 'hidden',
                            background: '#f8fafc'
                        }}>

                            {/* Left Side */}
                            <div style={{
                                width: '40%',
                                borderRight: '1px solid #e2e8f0',
                                background: '#fff',
                                overflowY: 'auto'
                            }}>
                                {readNotifications.length === 0 ? (
                                    <div style={{
                                        padding: "40px 20px",
                                        textAlign: "center",
                                        color: "#94a3b8"
                                    }}>
                                        No notification history found
                                    </div>
                                ) : (
                                    readNotifications.map((n) => {
                                        const isSelected =
                                            selectedHistoryItem?.notificationId ===
                                            n.notificationId;

                                        return (
                                            <div
                                                key={n.notificationId}
                                                onClick={() =>
                                                    setSelectedHistoryItem(n)
                                                }
                                                style={{
                                                    padding: "16px",
                                                    borderBottom:
                                                        "1px solid #f1f5f9",
                                                    cursor: "pointer",
                                                    background: isSelected
                                                        ? "#eff6ff"
                                                        : "transparent",
                                                    borderLeft: isSelected
                                                        ? "4px solid #2563eb"
                                                        : "4px solid transparent"
                                                }}
                                            >
                                                <div style={{
                                                    fontWeight: "600",
                                                    fontSize: "13px",
                                                    color: "#334155"
                                                }}>
                                                    {n.title}
                                                </div>

                                                <div style={{
                                                    fontSize: "12px",
                                                    color: "#64748b",
                                                    marginTop: "4px"
                                                }}>
                                                    {n.message}
                                                </div>

                                                <div style={{
                                                    fontSize: "11px",
                                                    color: "#94a3b8",
                                                    marginTop: "6px"
                                                }}>
                                                    {new Date(
                                                        n.sentAt
                                                    ).toLocaleDateString()}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Right Side */}
                            <div style={{
                                width: '60%',
                                padding: '24px',
                                overflowY: 'auto'
                            }}>
                                {selectedHistoryItem ? (
                                    <div style={{
                                        background: '#fff',
                                        borderRadius: '12px',
                                        padding: '24px',
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '20px'
                                        }}>
                                            <div style={{
                                                background: '#eff6ff',
                                                color: '#2563eb',
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: '600'
                                            }}>
                                                {selectedHistoryItem.notificationType}
                                            </div>

                                            <div style={{
                                                color: '#10b981',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                fontSize: '12px',
                                                fontWeight: '600'
                                            }}>
                                                <CheckCircle size={14} />
                                                Read
                                            </div>
                                        </div>

                                        <h4 style={{
                                            margin: '0 0 10px 0',
                                            color: '#0f172a'
                                        }}>
                                            {selectedHistoryItem.title}
                                        </h4>

                                        <div style={{
                                            color: '#64748b',
                                            fontSize: '12px',
                                            marginBottom: '20px'
                                        }}>
                                            {new Date(
                                                selectedHistoryItem.sentAt
                                            ).toLocaleString()}
                                        </div>

                                        <div style={{
                                            background: '#f8fafc',
                                            padding: '16px',
                                            borderRadius: '8px',
                                            color: '#334155',
                                            lineHeight: '1.6'
                                        }}>
                                            {selectedHistoryItem.message}
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#94a3b8'
                                    }}>
                                        Select a notification from the left panel
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OfficerHeader;