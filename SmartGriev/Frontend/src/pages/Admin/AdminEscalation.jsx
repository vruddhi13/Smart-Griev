import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { adminTheme as theme } from '../../services/AdminServices/AdminTheme';

import {
    AlertTriangle,
    RefreshCcw,
    ShieldAlert,
    X,
    User2,
    Building2,
    ChevronRight
} from 'lucide-react';

import {
    showError,
    showSuccessToast,
} from "../../services/alertService";

import {
    getEscalations,
    runAutoEscalation
} from '../../services/AdminServices/AdminService';

import usePagination from '../../services/usePagination';
import Pagination from '../../Components/AdminComponents/Pagination';

const AdminEscalation = () => {

    const [escalations, setEscalations] = useState([]);
    const [loading, setLoading] = useState(false);

    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [historyModal, setHistoryModal] = useState(false);

    // =====================================================
    // FETCH ESCALATIONS
    // =====================================================

    const fetchEscalations = async () => {

        try {

            setLoading(true);

            const response = await getEscalations();

            setEscalations(response?.data || []);

        } catch (error) {

            console.error(error);

            showError("Failed to load escalations");

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        fetchEscalations();

    }, []);

    // =====================================================
    // AUTO ESCALATION
    // =====================================================

    const handleAutoEscalation = async () => {

        try {

            setLoading(true);

            const response = await runAutoEscalation();

            showSuccessToast(
                response?.message ||
                "Auto escalation completed"
            );

            await fetchEscalations();

        } catch (error) {

            console.error(error);

            showError(
                error?.response?.data?.message ||
                error?.message ||
                "No complaints eligible for escalation"
            );

        } finally {

            setLoading(false);
        }
    };

    // =====================================================
    // UNIQUE COMPLAINTS
    // =====================================================

    const uniqueComplaints = useMemo(() => {

        const grouped = {};

        escalations.forEach((item) => {

            if (!grouped[item.complaintId]) {

                grouped[item.complaintId] = {
                    complaintId: item.complaintId,
                    complaintNumber: item.complaintNumber,
                    latestEscalation: item,
                    history: [item]
                };

            } else {

                grouped[item.complaintId].history.push(item);

                if (
                    item.escalationLevel >
                    grouped[item.complaintId]
                        .latestEscalation
                        .escalationLevel
                ) {
                    grouped[item.complaintId]
                        .latestEscalation = item;
                }
            }
        });

        return Object.values(grouped);

    }, [escalations]);

    // =====================================================
    // PAGINATION
    // =====================================================

    const {
        currentPage,
        totalPages,
        currentData,
        nextPage,
        prevPage,
        setCurrentPage
    } = usePagination(uniqueComplaints, 4);

    // =====================================================
    // OPEN HISTORY
    // =====================================================

    const openHistory = (complaint) => {

        setSelectedComplaint(complaint);

        setHistoryModal(true);
    };

    return (

        <AdminLayout pageTitle="Escalation Logs">

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                width: '100%',
                minWidth: 0,
                overflow: 'hidden'
            }}>

                {/* ===================================================== */}
                {/* HEADER */}
                {/* ===================================================== */}

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '14px'
                }}>

                    <div>

                        <h2 style={{
                            margin: 0,
                            color: theme.colors.text.main,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontSize: '26px',
                            fontWeight: '700'
                        }}>
                            <ShieldAlert size={28} />
                            Escalation Management
                        </h2>

                        <p style={{
                            marginTop: '6px',
                            color: theme.colors.text.gray,
                            fontSize: '14px'
                        }}>
                            Monitor complaint escalation history
                        </p>

                    </div>

                    <button
                        onClick={handleAutoEscalation}
                        disabled={loading}
                        style={{
                            background: loading
                                ? '#94A3B8'
                                : theme.colors.brand.primary,

                            color: 'white',

                            border: 'none',

                            padding: '12px 20px',

                            borderRadius: '14px',

                            display: 'flex',

                            alignItems: 'center',

                            gap: '8px',

                            fontWeight: '700',

                            cursor: loading
                                ? 'not-allowed'
                                : 'pointer'
                        }}
                    >
                        <RefreshCcw size={16} />

                        {
                            loading
                                ? "Processing..."
                                : "Run Auto Escalation"
                        }
                    </button>

                </div>

                {/* ===================================================== */}
                {/* SUMMARY */}
                {/* ===================================================== */}

                <div style={{
                    display: 'grid',
                    gridTemplateColumns:
                        'repeat(auto-fit,minmax(220px,1fr))',
                    gap: '16px'
                }}>

                    <div style={{
                        background: 'white',
                        borderRadius: '18px',
                        padding: '22px',
                        boxShadow: theme.shadows.card
                    }}>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>

                            <div>

                                <p style={{
                                    margin: 0,
                                    color: '#64748B',
                                    fontSize: '13px'
                                }}>
                                    Total Unique Complaints
                                </p>

                                <h2 style={{
                                    marginTop: '10px',
                                    fontSize: '30px',
                                    color: '#0F172A'
                                }}>
                                    {uniqueComplaints.length}
                                </h2>

                            </div>

                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '16px',
                                background: '#FEF2F2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <AlertTriangle
                                    size={26}
                                    color="#DC2626"
                                />
                            </div>

                        </div>

                    </div>

                </div>

                {/* ===================================================== */}
                {/* TABLE */}
                {/* ===================================================== */}

                <div style={{
                    background: 'white',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    boxShadow: theme.shadows.card,
                    width: '100%'
                }}>

                    <div style={{
                        overflowX: 'auto',
                        width: '100%'
                    }}>

                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            minWidth: '850px'
                        }}>

                            <thead>

                                <tr style={{
                                    background: '#F8FAFC',
                                    borderBottom:
                                        '1px solid #E2E8F0'
                                }}>

                                    <th style={headerStyle}>
                                        Complaint
                                    </th>

                                    <th style={headerStyle}>
                                        Escalated From
                                    </th>

                                    <th style={headerStyle}>
                                        Escalated To
                                    </th>

                                    <th style={headerStyle}>
                                        Level
                                    </th>

                                    <th style={headerStyle}>
                                        Reason
                                    </th>

                                    <th style={headerStyle}>
                                        History
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {
                                    currentData.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="6"
                                                style={emptyStyle}
                                            >
                                                No escalation records found
                                            </td>

                                        </tr>

                                    ) : (

                                        currentData.map((item) => {

                                            const latest =
                                                item.latestEscalation;

                                            return (

                                                <tr
                                                    key={item.complaintId}
                                                    onClick={() =>
                                                        openHistory(item)
                                                    }
                                                    style={{
                                                        borderBottom:
                                                            '1px solid #F1F5F9',
                                                        cursor: 'pointer',
                                                        transition: '0.2s'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background =
                                                            '#F8FAFC';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background =
                                                            'white';
                                                    }}
                                                >

                                                    {/* COMPLAINT */}

                                                    <td style={bodyStyle}>

                                                        <div style={{
                                                            fontWeight: '700',
                                                            color: '#0F172A'
                                                        }}>
                                                            #
                                                            {item.complaintId}
                                                        </div>

                                                        <div style={{
                                                            color: '#64748B',
                                                            marginTop: '4px',
                                                            fontSize: '13px'
                                                        }}>
                                                            {
                                                                item.complaintNumber
                                                            }
                                                        </div>

                                                    </td>

                                                    {/* FROM */}

                                                    <td style={bodyStyle}>

                                                        <div style={{
                                                            fontWeight: '700'
                                                        }}>
                                                            {
                                                                latest.escalatedFrom
                                                            }
                                                        </div>

                                                        <div style={subText}>
                                                            ID:
                                                            {" "}
                                                            {
                                                                latest.escalatedFromId
                                                            }
                                                        </div>

                                                        <div style={subText}>
                                                            {
                                                                latest.escalatedFromDepartment
                                                            }
                                                        </div>

                                                        <span style={badgeBlue}>
                                                            {
                                                                latest.escalatedFromRole
                                                            }
                                                        </span>

                                                    </td>

                                                    {/* TO */}

                                                    <td style={bodyStyle}>

                                                        <div style={{
                                                            fontWeight: '700'
                                                        }}>
                                                            {
                                                                latest.escalatedTo
                                                            }
                                                        </div>

                                                        <div style={subText}>
                                                            ID:
                                                            {" "}
                                                            {
                                                                latest.escalatedToId
                                                            }
                                                        </div>

                                                        <div style={subText}>
                                                            {
                                                                latest.escalatedToDepartment
                                                            }
                                                        </div>

                                                        <span style={badgeGreen}>
                                                            {
                                                                latest.escalatedToRole
                                                            }
                                                        </span>

                                                    </td>

                                                    {/* LEVEL */}

                                                    <td style={bodyStyle}>

                                                        <span style={levelBadge}>
                                                            Level
                                                            {" "}
                                                            {
                                                                latest.escalationLevel
                                                            }
                                                        </span>

                                                    </td>

                                                    {/* REASON */}

                                                    <td style={bodyStyle}>

                                                        <div style={{
                                                            maxWidth: '200px',
                                                            lineHeight: '1.5'
                                                        }}>
                                                            {latest.reason}
                                                        </div>

                                                    </td>

                                                    {/* HISTORY */}

                                                    <td style={bodyStyle}>

                                                        <div style={{
                                                            width: '38px',
                                                            height: '38px',
                                                            borderRadius: '50%',
                                                            background:
                                                                '#EEF2FF',
                                                            color: '#4338CA',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent:
                                                                'center',
                                                            fontWeight: '700'
                                                        }}>
                                                            {
                                                                item.history.length
                                                            }
                                                        </div>

                                                    </td>

                                                </tr>
                                            );
                                        })
                                    )
                                }

                            </tbody>

                        </table>

                    </div>

                </div>

                {/* ===================================================== */}
                {/* PAGINATION */}
                {/* ===================================================== */}

                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end'
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

            {/* ===================================================== */}
            {/* HISTORY MODAL */}
            {/* ===================================================== */}

            {
                historyModal && selectedComplaint && (

                    <div style={modalOverlay}>

                        <div style={modalBox}>

                            {/* HEADER */}

                            <div style={modalHeader}>

                                <div>

                                    <h2 style={{
                                        margin: 0,
                                        fontSize: '22px',
                                        color: '#0F172A'
                                    }}>
                                        Escalation History
                                    </h2>

                                    <p style={{
                                        marginTop: '4px',
                                        fontSize: '13px',
                                        color: '#64748B'
                                    }}>
                                        Complaint:
                                        {" "}
                                        {
                                            selectedComplaint
                                                .complaintNumber
                                        }
                                    </p>

                                </div>

                                <button
                                    onClick={() =>
                                        setHistoryModal(false)
                                    }
                                    style={closeBtn}
                                >
                                    <X size={18} />
                                </button>

                            </div>

                            {/* BODY */}

                            <div style={{
                                padding: '16px',
                                maxHeight: '70vh',
                                overflowY: 'auto',
                                background: '#F8FAFC'
                            }}>

                                {
                                    selectedComplaint.history
                                        .sort((a, b) =>
                                            a.escalationLevel -
                                            b.escalationLevel
                                        )
                                        .map((history, index) => (

                                            <div
                                                key={index}
                                                style={historyCard}
                                            >

                                                {/* TOP */}

                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent:
                                                        'space-between',
                                                    alignItems: 'center',
                                                    flexWrap: 'wrap',
                                                    gap: '10px'
                                                }}>

                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems:
                                                            'center',
                                                        gap: '10px'
                                                    }}>

                                                        <div style={{
                                                            width: '42px',
                                                            height: '42px',
                                                            borderRadius: '12px',
                                                            background:
                                                                '#EEF2FF',
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            justifyContent:
                                                                'center'
                                                        }}>
                                                            <ShieldAlert
                                                                size={18}
                                                                color="#4338CA"
                                                            />
                                                        </div>

                                                        <div>

                                                            <div style={{
                                                                fontWeight:
                                                                    '700'
                                                            }}>
                                                                Level
                                                                {" "}
                                                                {
                                                                    history.escalationLevel
                                                                }
                                                            </div>

                                                            <div style={{
                                                                fontSize:
                                                                    '12px',
                                                                color:
                                                                    '#64748B',
                                                                marginTop:
                                                                    '2px'
                                                            }}>
                                                                {
                                                                    new Date(
                                                                        history.escalatedAt
                                                                    ).toLocaleString()
                                                                }
                                                            </div>

                                                        </div>

                                                    </div>

                                                    <span style={levelBadge}>
                                                        Escalated
                                                    </span>

                                                </div>

                                                {/* FLOW */}

                                                <div style={{
                                                    marginTop: '18px',
                                                    display: 'grid',
                                                    gridTemplateColumns:
                                                        '1fr 40px 1fr',
                                                    gap: '10px',
                                                    alignItems: 'center'
                                                }}>

                                                    {/* FROM */}

                                                    <div style={userCard}>

                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            gap: '8px'
                                                        }}>

                                                            <User2 size={16} />

                                                            <span style={{
                                                                fontWeight:
                                                                    '700'
                                                            }}>
                                                                {
                                                                    history.escalatedFrom
                                                                }
                                                            </span>

                                                        </div>

                                                        <div style={modalSub}>
                                                            ID:
                                                            {" "}
                                                            {
                                                                history.escalatedFromId
                                                            }
                                                        </div>

                                                        <div style={modalSub}>
                                                            <Building2
                                                                size={12}
                                                            />
                                                            {
                                                                history.escalatedFromDepartment
                                                            }
                                                        </div>

                                                        <span style={badgeBlue}>
                                                            {
                                                                history.escalatedFromRole
                                                            }
                                                        </span>

                                                    </div>

                                                    {/* ARROW */}

                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent:
                                                            'center'
                                                    }}>
                                                        <ChevronRight
                                                            color="#94A3B8"
                                                        />
                                                    </div>

                                                    {/* TO */}

                                                    <div style={userCard}>

                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            gap: '8px'
                                                        }}>

                                                            <User2 size={16} />

                                                            <span style={{
                                                                fontWeight:
                                                                    '700'
                                                            }}>
                                                                {
                                                                    history.escalatedTo
                                                                }
                                                            </span>

                                                        </div>

                                                        <div style={modalSub}>
                                                            ID:
                                                            {" "}
                                                            {
                                                                history.escalatedToId
                                                            }
                                                        </div>

                                                        <div style={modalSub}>
                                                            <Building2
                                                                size={12}
                                                            />
                                                            {
                                                                history.escalatedToDepartment
                                                            }
                                                        </div>

                                                        <span style={badgeGreen}>
                                                            {
                                                                history.escalatedToRole
                                                            }
                                                        </span>

                                                    </div>

                                                </div>

                                                {/* REASON */}

                                                <div style={{
                                                    marginTop: '16px',
                                                    background: '#FFF7ED',
                                                    border:
                                                        '1px solid #FED7AA',
                                                    borderRadius: '12px',
                                                    padding: '12px'
                                                }}>

                                                    <div style={{
                                                        fontWeight: '700',
                                                        color: '#C2410C',
                                                        fontSize: '13px'
                                                    }}>
                                                        Reason
                                                    </div>

                                                    <div style={{
                                                        marginTop: '6px',
                                                        fontSize: '14px',
                                                        color: '#7C2D12',
                                                        lineHeight: '1.5'
                                                    }}>
                                                        {history.reason}
                                                    </div>

                                                </div>

                                            </div>
                                        ))
                                }

                            </div>

                        </div>

                    </div>
                )
            }

        </AdminLayout>
    );
};

// =====================================================
// STYLES
// =====================================================

const headerStyle = {
    padding: '16px',
    textAlign: 'left',
    fontSize: '12px',
    color: '#64748B',
    fontWeight: '700'
};

const bodyStyle = {
    padding: '16px',
    fontSize: '14px',
    verticalAlign: 'top',
    color: '#0F172A'
};

const subText = {
    fontSize: '12px',
    color: '#64748B',
    marginTop: '3px'
};

const badgeBlue = {
    display: 'inline-block',
    marginTop: '6px',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    background: '#EEF2FF',
    color: '#4338CA',
    fontWeight: '700'
};

const badgeGreen = {
    display: 'inline-block',
    marginTop: '6px',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    background: '#ECFDF5',
    color: '#047857',
    fontWeight: '700'
};

const levelBadge = {
    background: '#FEF3C7',
    color: '#D97706',
    padding: '6px 12px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: '700'
};

const emptyStyle = {
    padding: '40px',
    textAlign: 'center',
    color: '#64748B',
    fontWeight: '600'
};

const modalOverlay = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15,23,42,0.55)',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px'
};

const modalBox = {
    width: '100%',
    maxWidth: '850px',
    background: 'white',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
};

const modalHeader = {
    padding: '18px 20px',
    borderBottom: '1px solid #E2E8F0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const closeBtn = {
    border: 'none',
    background: '#F1F5F9',
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const historyCard = {
    background: 'white',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '14px',
    border: '1px solid #E2E8F0'
};

const userCard = {
    background: '#F8FAFC',
    borderRadius: '14px',
    padding: '14px',
    border: '1px solid #E2E8F0'
};

const modalSub = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    marginTop: '5px',
    color: '#64748B',
    fontSize: '12px'
};

export default AdminEscalation;