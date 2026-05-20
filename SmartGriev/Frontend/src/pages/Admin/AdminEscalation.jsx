import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { adminTheme as theme } from '../../services/AdminServices/AdminTheme';

import {
    AlertTriangle,
    RefreshCcw,
    ShieldAlert
} from 'lucide-react';

import {
    getEscalations,
    runAutoEscalation
} from '../../services/AdminServices/AdminService';

import usePagination from '../../services/usePagination';
import Pagination from '../../Components/AdminComponents/Pagination';

const AdminEscalation = () => {

    const [escalations, setEscalations] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchEscalations = async () => {

        try {

            setLoading(true);

            const data = await getEscalations();

            setEscalations(data);

        } catch (error) {

            console.error("Fetch escalation error:", error);

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        fetchEscalations();

    }, []);

    const handleAutoEscalation = async () => {

        try {

            setLoading(true);

            const response = await runAutoEscalation();

            alert(response.message || "Auto escalation completed");

            await fetchEscalations();

        } catch (error) {

            console.error("Auto escalation error:", error);

            alert("Auto escalation failed");

        } finally {

            setLoading(false);
        }
    };

    const {
        currentPage,
        totalPages,
        currentData,
        nextPage,
        prevPage,
        setCurrentPage
    } = usePagination(escalations, 5);

    return (

        <AdminLayout pageTitle="Escalation Logs">

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '25px'
            }}>

                {/* HEADER */}

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>

                    <div>

                        <h2 style={{
                            margin: 0,
                            color: theme.colors.text.main,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <ShieldAlert size={28} />
                            Escalation Management
                        </h2>

                        <p style={{
                            color: theme.colors.text.gray,
                            fontSize: '14px',
                            marginTop: '6px'
                        }}>
                            Monitor SLA breach escalation records
                        </p>

                    </div>

                    <button
                        onClick={handleAutoEscalation}
                        disabled={loading}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '12px 22px',
                            background: theme.colors.brand.primary,
                            color: 'white',
                            border: 'none',
                            borderRadius: '14px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        <RefreshCcw size={18} />
                        {loading ? "Processing..." : "Run Auto Escalation"}
                    </button>

                </div>

                {/* SUMMARY CARDS */}

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))',
                    gap: '20px'
                }}>

                    <div style={{
                        background: 'white',
                        borderRadius: theme.radius.card,
                        padding: '24px',
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
                                    color: theme.colors.text.gray,
                                    fontSize: '14px'
                                }}>
                                    Total Escalations
                                </p>

                                <h2 style={{
                                    margin: '10px 0 0 0',
                                    color: theme.colors.text.main
                                }}>
                                    {escalations.length}
                                </h2>

                            </div>

                            <div style={{
                                background: '#FFEAEA',
                                padding: '14px',
                                borderRadius: '14px'
                            }}>
                                <AlertTriangle color="#EE5D50" />
                            </div>

                        </div>

                    </div>

                </div>

                {/* TABLE */}

                <div style={{
                    background: 'white',
                    borderRadius: theme.radius.card,
                    boxShadow: theme.shadows.card,
                    overflow: 'hidden'
                }}>

                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        textAlign: 'left'
                    }}>

                        <thead>

                            <tr style={{
                                background: '#FAFCFF',
                                borderBottom: '1px solid #E9EDF7'
                            }}>

                                <th style={headerStyle}>Complaint</th>
                                <th style={headerStyle}>From Officer</th>
                                <th style={headerStyle}>To Officer</th>
                                <th style={headerStyle}>Level</th>
                                <th style={headerStyle}>Reason</th>
                                <th style={headerStyle}>Escalated Date</th>

                            </tr>

                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        style={{
                                            padding: '40px',
                                            textAlign: 'center',
                                            color: theme.colors.text.gray
                                        }}
                                    >
                                        Loading escalation records...
                                    </td>

                                </tr>

                            ) : currentData.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        style={{
                                            padding: '40px',
                                            textAlign: 'center',
                                            color: theme.colors.text.gray
                                        }}
                                    >
                                        No escalation records found
                                    </td>

                                </tr>

                            ) : (

                                currentData.map((item) => (

                                    <tr
                                        key={item.escalationId}
                                        style={{
                                            borderBottom: '1px solid #F4F7FE'
                                        }}
                                    >

                                        <td style={bodyStyle}>
                                            #{item.complaintId}
                                        </td>

                                        <td style={bodyStyle}>
                                            Officer {item.escalatedFrom}
                                        </td>

                                        <td style={bodyStyle}>
                                            Officer {item.escalatedTo}
                                        </td>

                                        <td style={bodyStyle}>

                                            <div style={{
                                                display: 'inline-block',
                                                padding: '6px 14px',
                                                borderRadius: '10px',
                                                background: '#FFF4DE',
                                                color: '#FF9800',
                                                fontWeight: '700',
                                                fontSize: '12px'
                                            }}>
                                                Level {item.escalationLevel}
                                            </div>

                                        </td>

                                        <td style={bodyStyle}>
                                            {item.reason}
                                        </td>

                                        <td style={bodyStyle}>
                                            {
                                                item.escalatedAt
                                                    ? new Date(item.escalatedAt)
                                                        .toLocaleString()
                                                    : "-"
                                            }
                                        </td>

                                    </tr>

                                ))
                            )}

                        </tbody>

                    </table>

                </div>

                {/* PAGINATION */}

                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    width: '100%'
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

const headerStyle = {
    padding: '18px',
    color: '#A3AED0',
    fontSize: '12px',
    fontWeight: 'bold'
};

const bodyStyle = {
    padding: '18px',
    color: '#2B3674',
    fontSize: '14px',
    fontWeight: '500'
};

export default AdminEscalation;