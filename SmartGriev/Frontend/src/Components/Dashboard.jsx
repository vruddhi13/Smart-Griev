import React from 'react';
import { theme } from '../Styles/theme';

const Dashboard = () => {
    const headerStyle = {
        backgroundColor: theme.colors.primary[600],
        color: theme.colors.white.pure,
        padding: '1.2rem 5%',
        boxShadow: theme.shadows.md,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxSizing: 'border-box',
        position: 'sticky',
        top: 0,
        zIndex: 1000
    };

    const heroSectionStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '80px 10%',
        gap: '40px',
        width: '100%',
        boxSizing: 'border-box',
        maxWidth: '1400px',
        margin: '0 auto'
    };

    const heroTextStyle = {
        color: theme.colors.text.primary,
        fontFamily: theme.fonts.heading,
        fontWeight: 'bold',
        fontSize: '3.5rem',
        lineHeight: '1.2',
        marginBottom: theme.spacing.md,
        textAlign: 'left'
    };

    const chatBoxStyle = {
        flex: '0 0 400px',
        backgroundColor: 'white',
        borderRadius: theme.borderRadius.lg,
        boxShadow: theme.shadows.xl,
        border: `1px solid ${theme.colors.primary[100]}`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '500px'
    };

    return (
        <div style={{
            backgroundColor: theme.colors.background.primary,
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            margin: 0,
            padding: 0
        }}>

            <nav style={headerStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        backgroundColor: theme.colors.white.pure,
                        color: theme.colors.primary[600],
                        padding: '8px 14px', 
                        borderRadius: '10px', 
                        fontWeight: '900',
                        fontSize: '1.5rem', 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }}>SG</div>

                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                        <h2 style={{
                            margin: 0,
                            fontSize: '1.8rem', 
                            fontWeight: '700',
                            letterSpacing: '-0.5px'
                        }}>
                            SmartGriev
                        </h2>
                        <small style={{
                            opacity: 0.9,
                            fontSize: '11px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            display: 'block'
                        }}>
                            Citizen Complaint System
                        </small>
                    </div>
                </div>

                {/* Right Side: Links and Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <a href="#" style={{ color: 'white', textDecoration: 'none', fontWeight: '500', fontSize: '1.1rem' }}>Home</a>
                    <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.1rem', fontWeight: '500' }}>Login</button>
                    <button style={{
                        backgroundColor: theme.colors.white.pure,
                        color: theme.colors.primary[600],
                        padding: '10px 25px',
                        borderRadius: '8px',
                        fontWeight: '700',
                        fontSize: '1rem',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                    }}>Sign Up</button>
                </div>
            </nav>

            <main style={{ width: '100%', flex: 1 }}>
                <div style={heroSectionStyle}>
                    <div style={{ flex: 1 }}>
                        <h1 style={heroTextStyle}>
                            Smart Grievance <br /> Management System
                        </h1>
                        <p style={{
                            color: theme.colors.text.secondary,
                            fontSize: '1.2rem',
                            lineHeight: '1.6',
                            marginBottom: '40px',
                            maxWidth: '550px'
                        }}>
                            Submit and track your complaints effortlessly with AI-powered assistance.
                            Get instant responses and real-time updates.
                        </p>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <button style={{
                                backgroundColor: theme.colors.primary[500],
                                color: 'white',
                                padding: '15px 35px',
                                borderRadius: theme.borderRadius.md,
                                border: 'none',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                🤖 Try AI Chatbot
                            </button>
                            <button style={{
                                backgroundColor: 'transparent',
                                border: `2px solid ${theme.colors.primary[500]}`,
                                color: theme.colors.primary[500],
                                padding: '15px 35px',
                                borderRadius: theme.borderRadius.md,
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}>
                                📝 Submit Complaint
                            </button>
                        </div>
                    </div>

                    <div style={chatBoxStyle}>
                        <div style={{ backgroundColor: theme.colors.primary[500], color: 'white', padding: '15px' }}>
                            <div style={{ fontWeight: 'bold' }}>🤖 SmartGriev AI Assistant</div>
                            <small style={{ opacity: 0.8 }}>Powered by Advanced AI</small>
                        </div>
                        <div style={{ padding: '20px', flex: 1, backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ alignSelf: 'flex-start', background: 'white', padding: '10px', borderRadius: '10px', maxWidth: '80%', fontSize: '0.9rem', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                                Hello! I'm your SmartGriev AI assistant. How can I help you today?
                            </div>
                            <div style={{ alignSelf: 'flex-end', background: theme.colors.primary[500], color: 'white', padding: '10px', borderRadius: '10px', maxWidth: '80%', fontSize: '0.9rem' }}>
                                I need to report a road damage issue.
                            </div>
                            <div style={{ alignSelf: 'flex-start', background: 'white', padding: '10px', borderRadius: '10px', maxWidth: '80%', fontSize: '0.9rem', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                                I can help with that! Let me guide you through the process...
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <section style={{
                background: `linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.primary[700]} 100%)`,
                color: theme.colors.white.pure,
                padding: '100px 20px',
                textAlign: 'center',
                width: '100%'
            }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Ready to Get Started?</h2>
                <p style={{ opacity: 0.9, maxWidth: '650px', margin: '0 auto 40px auto', fontSize: '1.1rem' }}>
                    Join thousands of citizens using SmartGriev to make their voices heard.
                </p>
                <button style={{
                    backgroundColor: theme.colors.white.pure,
                    color: theme.colors.primary[600],
                    padding: '15px 40px',
                    borderRadius: theme.borderRadius.full,
                    fontWeight: '800',
                    border: 'none',
                    fontSize: '1.1rem',
                    cursor: 'pointer'
                }}>
                    Create Free Account →
                </button>
            </section>
        </div>
    );
};

export default Dashboard;