import React, { useState, useEffect, useRef } from 'react';
import { theme } from '../../services/theme';

const AIChatPage = () => {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: "👋 Welcome to SmartGriev Support. I can help you file a complaint, check status, or answer city-service queries. How can I assist you today?", time: "Just now" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMsg = { sender: 'user', text: input, time: currentTime };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("https://localhost:7224/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input })
            });
            const data = await res.json();
            setMessages(prev => [...prev, { sender: 'bot', text: data.reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'bot', text: "I'm experiencing connectivity issues. Please try again later.", time: "System" }], error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            background: `linear-gradient(135deg, ${theme.colors.background.secondary} 0%, ${theme.colors.primary[50]} 100%)`,
            minHeight: '100vh',
            fontFamily: theme.fonts.primary,
            display: 'flex',
            padding: theme.spacing.xl,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            {/* Main Application Shell */}
            <div style={{
                width: '100%',
                maxWidth: '1200px',
                height: '85vh',
                display: 'flex',
                backgroundColor: theme.colors.glass.light,
                backdropFilter: theme.colors.glass.blur,
                borderRadius: theme.borderRadius.xl,
                boxShadow: theme.shadows.xl,
                border: `1px solid ${theme.colors.white.pure}`,
                overflow: 'hidden'
            }}>

                {/* Left Sidebar - Chat History/Shortcuts */}
                <div style={{
                    width: '300px',
                    borderRight: `1px solid ${theme.colors.primary[100]}`,
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    display: theme.mediaQueries.mobile ? 'none' : 'flex',
                    flexDirection: 'column',
                    padding: theme.spacing.lg
                }}>
                    <h3 style={{ color: theme.colors.primary[800], marginBottom: theme.spacing.lg }}>Recent Consultations</h3>
                    <div style={{
                        padding: theme.spacing.md,
                        backgroundColor: theme.colors.white.pure,
                        borderRadius: theme.borderRadius.md,
                        borderLeft: `4px solid ${theme.colors.primary[500]}`,
                        boxShadow: theme.shadows.sm,
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}>
                        <div style={{ fontWeight: '600', color: theme.colors.text.primary }}>Current Session</div>
                        <div style={{ color: theme.colors.text.tertiary, fontSize: '12px' }}>Active now</div>
                    </div>
                </div>

                {/* Main Chat Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: theme.colors.white.pure }}>

                    {/* Professional Header */}
                    <div style={{
                        padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                        borderBottom: `1px solid ${theme.colors.primary[100]}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: `linear-gradient(135deg, ${theme.colors.primary[500]}, ${theme.colors.futuristic.purple})`,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'white',
                                fontWeight: 'bold'
                            }}>SG</div>
                            <div>
                                <div style={{ fontWeight: '700', color: theme.colors.text.primary }}>SmartGriev AI Agent</div>
                                <div style={{ fontSize: '12px', color: theme.colors.status.success, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: theme.colors.status.success }}></span>
                                    System Operational
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Message List */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: theme.spacing.xl,
                        background: theme.colors.background.secondary,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: theme.spacing.lg
                    }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{
                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '70%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                            }}>
                                <div style={{
                                    padding: '14px 20px',
                                    borderRadius: '18px',
                                    lineHeight: '1.5',
                                    fontSize: '15px',
                                    boxShadow: theme.shadows.md,
                                    backgroundColor: msg.sender === 'user' ? theme.colors.primary[600] : theme.colors.white.pure,
                                    color: msg.sender === 'user' ? theme.colors.white.pure : theme.colors.text.primary,
                                    borderBottomRightRadius: msg.sender === 'user' ? '4px' : '18px',
                                    borderBottomLeftRadius: msg.sender === 'bot' ? '4px' : '18px',
                                }}>
                                    {msg.text}
                                </div>
                                <span style={{ fontSize: '10px', color: theme.colors.text.tertiary, marginTop: '5px', padding: '0 5px' }}>
                                    {msg.time}
                                </span>
                            </div>
                        ))}
                        {isLoading && (
                            <div style={{ display: 'flex', gap: '5px', padding: '10px' }}>
                                <div className="dot" style={{ width: '8px', height: '8px', background: theme.colors.primary[300], borderRadius: '50%' }}></div>
                                <div className="dot" style={{ width: '8px', height: '8px', background: theme.colors.primary[400], borderRadius: '50%' }}></div>
                                <div className="dot" style={{ width: '8px', height: '8px', background: theme.colors.primary[500], borderRadius: '50%' }}></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Console */}
                    <div style={{
                        padding: theme.spacing.lg,
                        backgroundColor: theme.colors.white.pure,
                        borderTop: `1px solid ${theme.colors.primary[50]}`
                    }}>
                        <div style={{
                            display: 'flex',
                            gap: theme.spacing.md,
                            padding: '8px',
                            backgroundColor: theme.colors.background.secondary,
                            borderRadius: theme.borderRadius.full,
                            border: `1px solid ${theme.colors.primary[100]}`,
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                        }}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type your grievance details here..."
                                style={{
                                    flex: 1,
                                    padding: '10px 20px',
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '15px',
                                    color: theme.colors.text.primary
                                }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading}
                                style={{
                                    backgroundColor: theme.colors.primary[600],
                                    color: 'white',
                                    border: 'none',
                                    width: '45px',
                                    height: '45px',
                                    borderRadius: '50%',
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    transition: 'transform 0.2s',
                                    boxShadow: theme.shadows.glow
                                }}
                                onMouseOver={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(1.05)')}
                                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                            >
                                ➔
                            </button>
                        </div>
                        <p style={{ fontSize: '11px', textAlign: 'center', color: theme.colors.text.tertiary, marginTop: theme.spacing.sm }}>
                            AI can make mistakes. Please verify important information with official departments.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIChatPage;