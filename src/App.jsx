import React, { useState, useEffect, useRef } from 'react';
import { Search, Moon, Sun, ChevronRight, Copy, Check, Lightbulb } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const EndpointBox = ({ method, url, theme }) => {
    const [copied, setCopied] = React.useState(false);
    const isDark = theme === 'dark';

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{
            background: isDark ? '#111' : '#f8fafc',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            marginTop: '1.5rem',
            border: `1px solid ${isDark ? 'var(--border-color)' : '#e2e8f0'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            position: 'relative',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.9rem'
        }}>
            <span style={{
                background: method === 'GET' ? '#008A45' : '#3b82f6',
                color: '#fff',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 700,
                fontFamily: "'Neo Sans Std', sans-serif"
            }}>
                {method}
            </span>
            <span style={{ color: isDark ? '#e2e8f0' : '#334155', wordBreak: 'break-all', flex: 1 }}>
                {url}
            </span>
            <button
                onClick={copyToClipboard}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: copied ? '#008A45' : (isDark ? 'var(--text-secondary)' : '#64748b'),
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'color 0.2s',
                    flexShrink: 0
                }}
                title="Copy to clipboard"
            >
                {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
        </div>
    );
};

const ResponseTable = ({ data, showType = true }) => {
    return (
        <div style={{ marginTop: '3rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '1rem 0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', width: showType ? '30%' : '40%' }}>
                            {showType ? 'Field' : 'Event'}
                        </th>
                        {showType && (
                            <th style={{ padding: '1rem 0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', width: '20%' }}>Type</th>
                        )}
                        <th style={{ padding: '1rem 0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '1rem 0.5rem', verticalAlign: 'top' }}>
                                <code style={{ color: '#e67e22', fontWeight: 600, fontSize: '0.9rem' }}>{row.field}</code>
                            </td>
                            {showType && (
                                <td style={{ padding: '1rem 0.5rem', verticalAlign: 'top' }}>
                                    <code style={{ color: '#8e44ad', fontSize: '0.85rem' }}>{row.type}</code>
                                </td>
                            )}
                            <td style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                {row.description}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const ResponseAccordion = ({ code, status, children, type = 'success' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isError = type === 'error';
    const accentColor = isError ? 'var(--brand-red)' : 'var(--brand-green)';
    const bgColor = isError ? 'var(--brand-red-light)' : 'rgba(0, 138, 69, 0.05)';

    return (
        <div style={{ marginTop: '1rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: bgColor,
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    cursor: 'pointer',
                    userSelect: 'none'
                }}
            >
                <ChevronRight
                    size={16}
                    style={{
                        transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                        color: accentColor
                    }}
                />
                <div style={{
                    background: '#fff',
                    color: '#111',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700
                }}>
                    {code}
                </div>
                <span style={{ color: accentColor, fontWeight: 600, fontSize: '0.875rem' }}>{status}</span>
            </div>
            {isOpen && (
                <div style={{ padding: '0 1rem 1rem 1rem', borderTop: '1px solid var(--border-color)', background: 'transparent' }}>
                    {children}
                </div>
            )}
        </div>
    );
};

const CodeExample = ({ title, samples, theme }) => {
    const [activeLang, setActiveLang] = useState(samples[0].lang);
    const [copied, setCopied] = useState(false);

    const isDark = theme === 'dark';
    const activeSample = samples.find(s => s.lang === activeLang);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(activeSample.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{
            background: isDark ? '#000' : '#ffffff',
            borderRadius: '16px',
            marginTop: '2rem',
            border: `1px solid ${isDark ? 'var(--border-color)' : '#e2e8f0'}`,
            overflow: 'hidden'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1.5rem',
                borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0'}`,
                background: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc'
            }}>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    {samples.map((s) => (
                        <div
                            key={s.lang}
                            onClick={() => setActiveLang(s.lang)}
                            style={{
                                color: activeLang === s.lang
                                    ? (/^\d+$/.test(s.lang) && parseInt(s.lang) >= 400 ? 'var(--brand-red)' : 'var(--brand-green)')
                                    : (isDark ? 'var(--text-secondary)' : '#64748b'),
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                position: 'relative',
                                paddingBottom: '4px',
                                transition: 'color 0.2s',
                                fontFamily: "'Neo Sans Std', sans-serif"
                            }}
                        >
                            {s.lang}
                            {activeLang === s.lang && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: '-8px',
                                    left: 0,
                                    right: 0,
                                    height: '2px',
                                    background: /^\d+$/.test(s.lang) && parseInt(s.lang) >= 400 ? 'var(--brand-red)' : 'var(--brand-green)'
                                }} />
                            )}
                        </div>
                    ))}
                </div>
                <button
                    onClick={copyToClipboard}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: copied ? 'var(--brand-green)' : (isDark ? 'var(--text-secondary)' : '#64748b'),
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        borderRadius: '4px'
                    }}
                    title="Copy code"
                >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
            </div>
            <div style={{ position: 'relative' }}>
                <SyntaxHighlighter
                    language={
                        activeLang.toLowerCase() === 'javascript' ? 'javascript' :
                            activeLang.toLowerCase() === 'curl' ? 'bash' :
                                /^\d+$/.test(activeLang) ? 'json' :
                                    activeLang.toLowerCase()
                    }
                    style={isDark ? vscDarkPlus : undefined}
                    customStyle={{
                        margin: 0,
                        padding: '1.5rem',
                        background: isDark ? '#0a0a0a' : '#ffffff',
                        fontSize: '0.8rem',
                        lineHeight: 1.6,
                        border: 'none'
                    }}
                >
                    {activeSample.code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

const TipBox = ({ children, theme }) => {
    const isDark = theme === 'dark';
    return (
        <div style={{
            background: isDark ? 'rgba(5, 150, 105, 0.08)' : 'rgba(5, 150, 105, 0.05)',
            border: '1px solid #10b981',
            borderRadius: '16px',
            padding: '1.25rem 1.75rem',
            marginTop: '2.5rem',
            display: 'flex',
            gap: '1.25rem',
            alignItems: 'center'
        }}>
            <Lightbulb size={24} style={{ color: '#10b981', flexShrink: 0 }} />
            <div style={{ color: isDark ? '#a7f3d0' : '#065f46', fontSize: '1rem', fontWeight: 400, lineHeight: 1.6 }}>
                {children}
            </div>
        </div>
    );
};

function App() {
    const [activeTab, setActiveTab] = useState('Introduction');
    const [activeSidebarItem, setActiveSidebarItem] = useState('Starting with frog');
    const [theme, setTheme] = useState('dark');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef(null);

    const topTabs = ['Introduction', 'Account Balance', 'Bulk Messaging', 'Smart USSD'];

    const sidebarGroups = {
        'Introduction': [
            {
                title: 'Get started',
                items: ['Starting with frog', 'Request API details']
            }
        ],
        'Account Balance': [
            {
                title: 'Balance',
                items: ['Get account balance']
            }
        ],
        'Bulk Messaging': [
            {
                title: 'Messaging',
                items: ['Introduction', 'History', 'Callback URL']
            },
            {
                title: 'SMS',
                items: ['Send General', 'Send Personalized', 'SMS Generate OTP', 'SMS Verify OTP']
            },
            {
                title: 'Voice',
                items: ['Send Voice', 'Send voice interactive', 'Voice Generate OTP', 'Voice Verify OTP']
            }
        ],
        'Smart USSD': [
            {
                title: 'USSD Flows',
                items: ['Build Flow', 'Simulator', 'Live View']
            }
        ]
    };

    const sidebarContent = sidebarGroups[activeTab] || [];

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
                const input = document.getElementById('docs-search');
                if (input) input.focus();
            }
            if (e.key === 'Escape') {
                setIsSearchOpen(false);
                setSearchQuery('');
            }
        };
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setIsSearchOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const allPages = Object.entries(sidebarGroups).flatMap(([tab, groups]) =>
        groups.flatMap(group =>
            group.items.map(item => ({
                tab,
                name: typeof item === 'object' ? item.name : item,
                group: group.title
            }))
        )
    );

    const filteredResults = searchQuery.trim() === '' ? [] :
        allPages.filter(page =>
            page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            page.group.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const handleSearchResultClick = (result) => {
        setActiveTab(result.tab);
        setActiveSidebarItem(result.name);
        setSearchQuery('');
        setIsSearchOpen(false);
    };

    const contentMap = {
        'Starting with frog': {
            title: 'Starting with frog',
            body: (
                <>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                        Welcome to the Frog API documentation! Frog's RESTful APIs offer the simplest way to build high-quality communication applications. By integrating Frog's services into your software, you can enhance your messaging and engagement capabilities. Send alerts, reminders, and notifications via SMS and Voice, verify users with one-time passwords, and track SMS delivery statuses. This documentation provides detailed guides and sample code in Java, PHP, and Node.js to help you get started quickly.
                    </p>

                    <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '3rem', fontWeight: 700 }}>Create an Account</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                        Register for a new account on Frog by visiting our <a href="https://frog.wigal.com.gh/register/validate-email" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-green)', textDecoration: 'none', fontWeight: 600 }}>Registration Page</a>. After signing up, you will receive your API key and access to other essential resources.
                    </p>

                    <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '3rem', fontWeight: 700 }}>Review the Documentation</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                        Take time to review our comprehensive API documentation to understand how to make requests and utilize the resources available. Whether you're working with HTTP APIs or client SDKs, we provide the tools you need to integrate seamlessly.
                    </p>

                    <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '3rem', fontWeight: 700 }}>Test Your Integration</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                        Start integrating Frog's features into your applications and thoroughly test your implementation. Ensure that everything functions as expected and aligns with your requirements.
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '2rem', marginTop: '4rem' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, margin: 0 }}>
                            If you already have an account, click <a href="https://frog.wigal.com.gh/login" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-green)', textDecoration: 'none', fontWeight: 600 }}>login</a> to continue using Frog.
                        </p>
                        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                            <a href="https://www.facebook.com/Wigalgh?_rdc=1&_rdr#" target="_blank" rel="noopener noreferrer">
                                <img src="/icons/facebook.svg" alt="Facebook" style={{ width: '20px', height: '20px', opacity: 0.7, transition: 'opacity 0.2s', filter: theme === 'dark' ? 'invert(1)' : 'none' }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.7} />
                            </a>
                            <a href="https://www.instagram.com/wigalgh" target="_blank" rel="noopener noreferrer">
                                <img src="/icons/instagram.svg" alt="Instagram" style={{ width: '20px', height: '20px', opacity: 0.7, transition: 'opacity 0.2s', filter: theme === 'dark' ? 'invert(1)' : 'none' }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.7} />
                            </a>
                            <a href="https://www.linkedin.com/company/wigalgh" target="_blank" rel="noopener noreferrer">
                                <img src="/icons/linkedin.svg" alt="LinkedIn" style={{ width: '20px', height: '20px', opacity: 0.7, transition: 'opacity 0.2s', filter: theme === 'dark' ? 'invert(1)' : 'none' }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.7} />
                            </a>
                            <a href="https://github.com/wigalgh" target="_blank" rel="noopener noreferrer">
                                <img src="/icons/github.svg" alt="GitHub" style={{ width: '20px', height: '20px', opacity: 0.7, transition: 'opacity 0.2s', filter: theme === 'dark' ? 'invert(1)' : 'none' }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.7} />
                            </a>
                        </div>
                    </div>
                </>
            ),
        },
        'Introduction': {
            title: activeTab === 'Bulk Messaging' ? 'Introduction to Frog Messaging API' : 'Introduction',
            main: (
                <>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                        Welcome to the Frog Messaging API, your gateway to seamless, reliable, and scalable bulk communication through SMS and Voice. Whether you're sending transactional alerts, promotional messages, customer notifications, or interactive voice calls, our API provides a robust and easy-to-integrate solution for all your messaging needs.
                    </p>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', marginTop: '3rem', fontWeight: 700 }}>Why Choose Frog Messaging API?</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '1rem',
                        marginTop: '1.5rem',
                        marginBottom: '3rem'
                    }}>
                        {[
                            { title: 'Fast & Reliable', desc: 'Deliver messages instantly with high deliverability rates for both SMS and Voice.' },
                            { title: 'Scalable', desc: 'Supports high-volume SMS and Voice campaigns with ease.' },
                            { title: 'Secure', desc: 'Built with industry-standard security measures to protect your data.' },
                            { title: 'Easy Integration', desc: 'Developer-friendly with RESTful architecture and detailed documentation.' },
                            { title: 'Multi-Channel', desc: 'Reach your customers through SMS text messages or Voice calls, all from one unified API.' }
                        ].map((feature, idx) => (
                            <div key={idx} style={{
                                background: theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
                                border: `1px solid ${theme === 'dark' ? 'var(--border-color)' : '#e2e8f0'}`,
                                borderRadius: '12px',
                                padding: '1.5rem',
                                transition: 'all 0.2s'
                            }}>
                                <h4 style={{
                                    margin: '0 0 0.75rem 0',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    color: 'var(--text-primary)',
                                    fontFamily: "'Neo Sans Std', sans-serif"
                                }}>{feature.title}</h4>
                                <p style={{
                                    margin: 0,
                                    fontSize: '0.9rem',
                                    color: 'var(--text-secondary)',
                                    lineHeight: 1.5
                                }}>{feature.desc}</p>
                            </div>
                        ))}
                    </div>

                    <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', marginTop: '4rem', fontWeight: 700 }}>What You Can Do with the API</h2>

                    <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', marginTop: '2.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>SMS Messaging</h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '1rem',
                        marginBottom: '3rem'
                    }}>
                        {[
                            { title: 'Send SMS', desc: 'Send single or bulk SMS messages instantly to your customers.' },
                            { title: 'Personalization', desc: 'Send personalized SMS messages with dynamic content fields.' },
                            { title: 'OTP Verification', desc: 'Generate and verify secure OTP codes via SMS for user auth.' },
                            { title: 'Delivery Tracking', desc: 'Real-time status checks for all your sent SMS messages.' },
                            { title: 'Scheduling', desc: 'Plan and schedule messages for future delivery with ease.' },
                            { title: 'Branding', desc: 'Customize sender IDs to match your company branding.' }
                        ].map((item, idx) => (
                            <div key={idx} style={{
                                background: theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
                                border: `1px solid ${theme === 'dark' ? 'var(--border-color)' : '#e2e8f0'}`,
                                borderRadius: '12px',
                                padding: '1.25rem',
                                transition: 'all 0.2s'
                            }}>
                                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', marginTop: '2.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>Voice Messaging</h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '0.75rem',
                        marginBottom: '3rem'
                    }}>
                        {[
                            { title: 'Voice Calls', desc: 'Send voice calls with pre-recorded audio messages.' },
                            { title: 'Interactive IVR', desc: 'Create interactive calls with user input collection.' },
                            { title: 'OTP over Voice', desc: 'Secure OTP codes via automated voice calls.' },
                            { title: 'Track Completion', desc: 'Monitor delivery, duration, and completion status.' },
                            { title: 'Event Callbacks', desc: 'Real-time updates for call events and user responses.' },
                            { title: 'Custom Prompts', desc: 'Professional caller IDs and customized voice prompts.' }
                        ].map((item, idx) => (
                            <div key={idx} style={{
                                background: theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
                                border: `1px solid ${theme === 'dark' ? 'var(--border-color)' : '#e2e8f0'}`,
                                borderRadius: '10px',
                                padding: '1rem',
                                transition: 'all 0.2s'
                            }}>
                                <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</h4>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', marginTop: '4rem', fontWeight: 700 }}>Getting Started</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                        To begin using the Frog Messaging API, follow these simple steps:
                    </p>
                    <ol style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 2, paddingLeft: '1.5rem', listStyleType: 'decimal', marginBottom: '4rem' }}>
                        <li><strong>Sign Up & Get API Keys:</strong> Register on our platform to receive your unique API credentials.</li>
                        <li><strong>Read the Documentation:</strong> Explore our detailed API reference to understand endpoints and request formats for both SMS and Voice messaging.</li>
                        <li><strong>Integrate & Test:</strong> Use our sandbox environment to test your integration before going live.</li>
                        <li><strong>Deploy & Scale:</strong> Start sending SMS and Voice messages to your customers and scale as needed.</li>
                    </ol>

                    <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', marginTop: '4rem', fontWeight: 700 }}>How It Works</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                        Our API supports two primary communication channels:
                    </p>

                    <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', marginTop: '2rem', fontWeight: 600, color: 'var(--text-primary)' }}>SMS Messaging</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                        Send text messages instantly to single or multiple recipients. Perfect for transactional alerts, promotional campaigns, and OTP verification. Our SMS API supports both general broadcasts and personalized messages with dynamic content.
                    </p>

                    <div style={{ marginTop: '2rem', marginBottom: '4rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                        <img
                            src="/images/SMS_Illustration_fz7fxp.png"
                            alt="SMS Messaging Illustration"
                            style={{ width: '100%', display: 'block' }}
                        />
                    </div>

                    <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', marginTop: '2rem', fontWeight: 600, color: 'var(--text-primary)' }}>Voice Messaging</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                        Reach your customers through automated voice calls. Ideal for important notifications, interactive surveys, and OTP delivery. Our Voice API supports both one-way voice messages and interactive calls where users can respond via keypad input or voice commands.
                    </p>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '1rem', fontWeight: 600 }}>Voice messaging is particularly effective for:</p>
                    <ul style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 2, paddingLeft: '1.5rem', listStyleType: 'disc', marginBottom: '4rem' }}>
                        <li>Delivering critical information to users who may not check their SMS</li>
                        <li>Interactive customer engagement through voice prompts</li>
                        <li>OTP delivery with automatic verification</li>
                        <li>Multi-language support with customizable voice prompts</li>
                    </ul>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
                        For technical support or assistance, reach us via email at <a href="mailto:support@wigal.com.gh" style={{ color: 'var(--brand-green)', textDecoration: 'none', fontWeight: 600 }}>support@wigal.com.gh</a> or by phone call at <a href="tel:+233552825758" style={{ color: 'var(--brand-green)', textDecoration: 'none', fontWeight: 600 }}>+233 55 282 5758</a>, <a href="tel:+233553019529" style={{ color: 'var(--brand-green)', textDecoration: 'none', fontWeight: 600 }}>+233 55 301 9529</a>. Happy messaging with Frog Messaging API!
                    </p>
                </>
            )
        },
        'Request API details': {
            title: 'Request API details',
            body: (
                <>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                        Here is a simple guide on how to request for Your API Details.
                    </p>

                    <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '3rem', fontWeight: 700 }}>Follow these simple steps:</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                        To request for your API Details, follow these steps:
                    </p>

                    <ul style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 2, paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                        <li>Sign in to your Frog account</li>
                        <li>Click the profile icon in the upper right corner and select "Account Settings"</li>
                        <li>Click on "Request API Details"</li>
                        <li>You should receive an email with your request</li>
                    </ul>

                    <div style={{ marginTop: '3rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                        <img
                            src="/videos/request.gif"
                            alt="Request API Details Guide"
                            style={{ width: '100%', display: 'block' }}
                        />
                    </div>
                </>
            )
        },
        'Get account balance': {
            title: 'Get account balance',
            body: (() => {
                const balanceData = [
                    { field: 'status', type: 'string', description: 'The status of the request' },
                    { field: 'message', type: 'string', description: 'Provides important information after request' },
                    { field: 'paidvoiceBalance', type: 'number', description: 'Your Paid Cash Balance' },
                    { field: 'cashBalance', type: 'number', description: 'Your Cash Balance' },
                    { field: 'bundles', type: 'object', description: 'Balance of bundles on your account' },
                    { field: 'invoiceSummary', type: 'object', description: 'Summary of invoices on your account' },
                    { field: 'activeBundleInvoices', type: 'object', description: 'Active bundle invoices on your account' }
                ];
                const samples = [
                    {
                        lang: 'cURL',
                        code: `curl -X GET 'https://frogapi.wigal.com.gh/api/v3/balance' \\
-H "API-KEY: $apikey" \\
-H "USERNAME: $username"`
                    },
                    {
                        lang: 'Javascript',
                        code: `const apiKey = 'your_api_key_here'; // replace with your api key
const username = 'your_username_here'; // replace with your username

fetch('https://frogapi.wigal.com.gh/api/v3/balance', {
  method: 'GET',
  headers: {
    'API-KEY': apiKey,
    'USERNAME': username
  }
})
.then(response => response.json())
.then(data => {
  console.log(data);
})
.catch(error => {
  console.error('Error:', error);
});`
                    },
                    {
                        lang: 'Python',
                        code: `import requests

api_key = 'your_api_key_here' # replace with your api key
username = 'your_username_here' # replace with your username

url = 'https://frogapi.wigal.com.gh/api/v3/balance'
headers = {
  'API-KEY': api_key,
  'USERNAME': username
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
  data = response.json()
  print(data)
else:
  print('Error:', response.status_code, response.text)`
                    },
                    {
                        lang: 'PHP',
                        code: `<?php
$api_key = 'your_api_key_here'; // replace with your api key
$username = 'your_username_here'; // replace with your username

$url = 'https://frogapi.wigal.com.gh/api/v3/balance';

$headers = [
  "API-KEY: $api_key",
  "USERNAME: $username"
];

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$response = curl_exec($ch);

if (curl_errno($ch)) {
  echo 'Error:' . curl_error($ch);
} else {
  $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  if ($httpcode == 200) {
    $data = json_decode($response, true);
    print_r($data);
  } else {
    echo 'Error: ' . $httpcode . ' - ' . $response;
  }
}

curl_close($ch);
?>`
                    }
                ];
                const responseSample = [
                    {
                        lang: 'JSON',
                        code: `{
    "status": "SUCCESS",
    "message": "SUCCESS",
    "data": {
        "paidcashbalance": 0,
        "cashbalance": 677.56,
        "bundles": {
            "VOICE": 15,
            "KYCVERIFY": 12,
            "SIMACTIVE": 123,
            "SMS": 82,
            "USSD": 100
        },
        "invoicesummary": [
            {
                "invoicetype": "TOPUP",
                "count": 2,
                "totalamount": 2
            },
            {
                "invoicetype": "BUNDLE",
                "count": 2,
                "totalamount": 11
            },
            {
                "invoicetype": "CREDIT_NOTE",
                "count": 6,
                "totalamount": 126
            },
            {
                "invoicetype": "IOU",
                "count": 1,
                "totalamount": 1000
            }
        ],
        "activebundleinvoices": [
            {
                "id": 387,
                "description": "Mashup Bundle dash",
                "enddate": "2024-08-30",
                "invoicetype": "BUNDLE",
                "details": [
                    {
                        "service": "KYCVERIFY",
                        "quantity": 12,
                        "used": 0
                    },
                    {
                        "service": "VOICE",
                        "quantity": 15,
                        "used": 0
                    },
                    {
                        "service": "SIMACTIVE",
                        "quantity": 123,
                        "used": 0
                    },
                    {
                        "service": "USSD",
                        "quantity": 100,
                        "used": 0
                    },
                    {
                        "service": "SMS",
                        "quantity": 100,
                        "used": 18
                    }
                ]
            }
        ]
    }
}`
                    }
                ];
                return {
                    main: (
                        <>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                                This is an object representing your Frog balance. You can retrieve it to see the balance currently on your Frog account.
                            </p>
                            <EndpointBox method="GET" url="https://frogapi.wigal.com.gh/api/v3/balance" theme={theme} />

                            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>Balance Object</h2>
                            <ResponseTable data={balanceData} />

                            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>Responses</h2>
                            <ResponseAccordion code="200" status="OK">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Returns "SUCCESS" when request is successful' },
                                    { field: 'message', type: 'string', description: 'Returns "SUCCESS" on successful request' },
                                    { field: 'data', type: 'object', description: 'Contains balance information including cash balance and bundles' }
                                ]} />
                            </ResponseAccordion>
                        </>
                    ),
                    right: (
                        <>
                            <h2 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>Request samples</h2>
                            <CodeExample samples={samples} theme={theme} />

                            <h2 style={{ fontSize: '1rem', marginBottom: '1rem', marginTop: '3rem', color: 'var(--text-primary)', fontWeight: 700 }}>Response samples</h2>
                            <CodeExample samples={responseSample} theme={theme} />
                        </>
                    )
                };
            })()
        },
        'History': {
            title: 'Sent Message History',
            body: (() => {
                const samples = [
                    {
                        lang: 'cURL',
                        code: `curl -X POST 'https://frogapi.wigal.com.gh/api/v3/sms/history' \\
-H "API-KEY: your_api_key_here" \\
-H "USERNAME: your_username_here" \\
-H "Content-Type: application/json" \\
-d '{
    "service": "SMS",
    "servicetype": "TEXT",
    "datefrom": "2024-04-01",
    "dateto": "2024-06-26",
    "senderid": "OGK1243",
    "status": "DELIVRD",
    "msgid": "MGS1010101"
}'`
                    },
                    {
                        lang: 'Javascript',
                        code: `const url = 'https://frogapi.wigal.com.gh/api/v3/sms/history';

const headers = {
    'Content-Type': 'application/json',
    'API-KEY': 'your_api_key_here', // Replace with your API key
    'USERNAME': 'your_username_here' // Replace with your username
};

const payload = {
    "service": "SMS",
    "servicetype": "TEXT",
    "datefrom": "2024-04-01",
    "dateto": "2024-06-26",
    "senderid": "OGK1243",
    "status": "DELIVRD",
    "msgid": "MGS1010101"
};

fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload)
})
.then(response => response.json())
.then(data => {
    console.log('Success:', data);
})
.catch(error => {
    console.error('Error:', error);
});`
                    },
                    {
                        lang: 'Python',
                        code: `import requests
import json

url = "https://frogapi.wigal.com.gh/api/v3/sms/history"

headers = {
    'Content-Type': 'application/json',
    'API-KEY': 'your_api_key_here',  # Replace with your API key
    'USERNAME': 'your_username_here'  # Replace with your username
}

payload = {
    "service": "SMS",
    "servicetype": "TEXT",
    "datefrom": "2024-04-01",
    "dateto": "2024-06-26",
    "senderid": "OGK1423",
    "status": "DELIVRD",
    "msgid": "MGS1010101"
}

# Sending the POST request
response = requests.post(url, headers=headers, data=json.dumps(payload))

if response.status_code == 200:
    print("Request was successful.")
    print("Response:", response.json())
else:
    print(f"Failed to send request. Status code: {response.status_code}")
    print("Response:", response.text)`
                    },
                    {
                        lang: 'PHP',
                        code: `<?php
$url = 'https://frogapi.wigal.com.gh/api/v3/sms/history';

$headers = [
    'Content-Type: application/json',
    'API-KEY: your_api_key_here', // Replace with your API key
    'USERNAME: your_username_here' // Replace with your username
];

$payload = [
    "service" => "SMS",
    "servicetype" => "TEXT",
    "datefrom" => "2024-04-01",
    "dateto" => "2024-06-26",
    "senderid" => "OGK1423",
    "status" => "DELIVRD",
    "msgid" => "MGS1010101"
];

$ch = curl_init($url);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

$response = curl_exec($ch);

if(curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
} else {
    echo $response;
}

curl_close($ch);
?>`
                    }
                ];

                return {
                    main: (
                        <>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                                Retrieve all sent message history using the REST API.
                            </p>
                            <EndpointBox method="POST" url="https://frogapi.wigal.com.gh/api/v3/sms/history" theme={theme} />

                            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>Request Object</h2>
                            <ResponseTable data={[
                                { field: 'service', type: 'string', description: 'The service. SMS | USSD | VOICE | SIMACTIVE | KYCVERIFY' },
                                { field: 'servicetype', type: 'string', description: 'The service type. TEXT | FLASH | CALL | RECORD | IVR | TEXT2SPEECH | OTP | SIMACTIVE | KYCVALIDATE' },
                                { field: 'datefrom', type: 'string', description: 'The begin date to filter the history range. (Date difference must not be more than 3 months)' },
                                { field: 'dateto', type: 'string', description: 'The end date to filter the history range. (Date difference must not be more than 3 months)' },
                                { field: 'senderid', type: 'string', description: 'The senderID used for sending message. Approved SenderIDs only' },
                                { field: 'status', type: 'string', description: 'The status to filter message history by. DELETED | UNKNOWN | EXPIRED | WAITING | FAILED | REJECTD | UNDELIV | ACCEPTD | DELIVRD | BUSY | ANSWERED' },
                                { field: 'msgid', type: 'string', description: 'Message ID' }
                            ]} />

                            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>Response Object</h2>
                            <ResponseTable data={[
                                { field: 'status', type: 'string', description: 'The status of the request.' },
                                { field: 'message', type: 'string', description: 'The message response.' },
                                { field: 'data', type: 'object', description: 'Content Data.' },
                                { field: 'content', type: 'array', description: 'An array of items' }
                            ]} />

                            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>Responses</h2>
                            <ResponseAccordion code="200" status="OK">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Returns "ACCEPTD" when message is successfully queued' },
                                    { field: 'message', type: 'string', description: 'Returns "success"' },
                                    { field: 'data', type: 'object', description: 'Provides content data' },
                                    { field: 'content', type: 'array', description: 'Provides an array of data' }
                                ]} />
                            </ResponseAccordion>

                            <ResponseAccordion code="401" status="UNAUTHORIZED" type="error">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Returns "UNAUTHORIZED"' },
                                    { field: 'message', type: 'string', description: '"Invalid API credentials"' },
                                    { field: 'data', type: 'null', description: 'No data returned' }
                                ]} />
                            </ResponseAccordion>

                            <ResponseAccordion code="404" status="NOT FOUND" type="error">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Error status code (e.g., "SENDER_ID_NOT_FOUND")' },
                                    { field: 'message', type: 'string', description: 'Detailed error message explaining the issue' },
                                    { field: 'data', type: 'null', description: 'No data returned for error responses' }
                                ]} />
                            </ResponseAccordion>

                            <ResponseAccordion code="500" status="SERVER ERROR" type="error">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Returns "ERROR" for server errors' },
                                    { field: 'message', type: 'string', description: 'Generic error message "Internal server error"' }
                                ]} />
                            </ResponseAccordion>
                        </>
                    ),
                    right: (
                        <>
                            <h2 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>Endpoint</h2>
                            <CodeExample samples={samples} theme={theme} />

                            <h2 style={{ fontSize: '1rem', marginBottom: '1rem', marginTop: '3rem', color: 'var(--text-primary)', fontWeight: 700 }}>Request Object</h2>
                            <CodeExample samples={[{
                                lang: 'JSON',
                                code: `{
    "service": "SMS",
    "servicetype": "Text",
    "datefrom": "2024-04-01",
    "dateto": "2024-06-18",
    "senderid": "OGK1234",
    "status": "DELIVRD",
    "msgid": "MGS1010101"
}`
                            }]} theme={theme} />

                            <h2 style={{ fontSize: '1rem', marginBottom: '1rem', marginTop: '3rem', color: 'var(--text-primary)', fontWeight: 700 }}>Response Object</h2>
                            <CodeExample samples={[
                                {
                                    lang: '200',
                                    code: `{
    "status": "SUCCESS",
    "message": "Success",
    "data": {
        "content": [
            {
                "apimessageid": "MGS1010101",
                "status": "DELIVRD",
                "statusreason": "DELIVRD",
                "recipient": "233542709210",
                "statusdate": "2024-06-26T13:06:14.087856",
                "bundlecredits": 0,
                "charge": 0.03,
                "service": "SMS",
                "servicetype": "TEXT",
                "messagecount": 1,
                "charactercount": 53
            },
            {
                "apimessageid": "MGS1010101",
                "status": "DELIVRD",
                "statusreason": "DELIVRD",
                "recipient": "233542409410",
                "statusdate": "2024-06-26T13:12:55.771246",
                "bundlecredits": 0,
                "charge": 0.03,
                "service": "SMS",
                "servicetype": "TEXT",
                "messagecount": 1,
                "charactercount": 55
            },
            {
                "apimessageid": "MGS1010101",
                "status": "DELIVRD",
                "statusreason": "DELIVRD",
                "recipient": "233542909410",
                "statusdate": "2024-06-26T13:14:23.801293",
                "bundlecredits": 0,
                "charge": 0.03,
                "service": "SMS",
                "servicetype": "TEXT",
                "messagecount": 1,
                "charactercount": 46
            }
        ],
        "pageable": {
            "pageNumber": 0,
            "pageSize": 50,
            "sort": {
                "sorted": false,
                "empty": true,
                "unsorted": true
            },
            "offset": 0,
            "unpaged": false,
            "paged": true
        },
        "last": true,
        "totalElements": 3,
        "totalPages": 1,
        "size": 50,
        "number": 0,
        "sort": {
            "sorted": false,
            "empty": true,
            "unsorted": true
        },
        "first": true,
        "numberOfElements": 3,
        "empty": false
    }
}`
                                },
                                {
                                    lang: '401',
                                    code: `{
    "status": "UNAUTHORIZED",
    "message": "Invalid API key or username",
    "data": null
}`
                                },
                                {
                                    lang: '404',
                                    code: `{
    "status": "FAILED",
    "message": "No history records found",
    "data": null
}`
                                },
                                {
                                    lang: '500',
                                    code: `{
    "status": "ERROR",
    "message": "Internal server error",
    "data": null
}`
                                }
                            ]} theme={theme} />
                        </>
                    )
                };
            })()
        },
        'Callback URL': {
            title: 'Callback URL',
            body: (
                <>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                        Your Callback URL will allow Frog to notify your application about the status of the message you have sent.
                    </p>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', marginTop: '3rem', fontWeight: 700 }}>How It Works</h2>
                    <ol style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 2, paddingLeft: '1.5rem', listStyleType: 'decimal' }}>
                        <li>Provide Your Callback URL To Frog By Configuring It In Your Account Settings.</li>
                    </ol>

                    <div style={{ marginTop: '3rem', marginBottom: '2rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                        <img
                            src="/videos/Add_qvyr5r.gif"
                            alt="Add Callback URL Guide"
                            style={{ width: '100%', display: 'block' }}
                        />
                    </div>

                    <ol start="2" style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 2, paddingLeft: '1.5rem', listStyleType: 'decimal' }}>
                        <li>When the status of the message changes (e.g., UNDELIV | ACCEPTD | DELIVRD ), FROG platform sends an HTTP POST request to your callback URL with relevant data (e.g., message ID, status, statusdate, handlecharge etc.).</li>
                    </ol>

                    <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>Response Object</h2>
                    <ResponseTable data={[
                        { field: 'msgid', type: 'string', description: 'Message ID' },
                        { field: 'status', type: 'string', description: 'The status of the message by. DELETED | UNKNOWN | EXPIRED | WAITING | FAILED | REJECTD | UNDELIV | ACCEPTD | DELIVRD | BUSY | ANSWERED' },
                        { field: 'reason', type: 'string', description: 'description explaining the status of the message. ("DELIVRD" is the reason for the "DELIVERED" status.)' },
                        { field: 'destination', type: 'string', description: 'Recipient Phone Number.' },
                        { field: 'statusdate', type: 'string', description: 'when the status of the request was last updated.' },
                        { field: 'handlecharge', type: 'Integer', description: 'A fee or charge for handling the message transaction.' },
                        { field: 'topupcharge', type: 'Integer', description: 'The charge for topping up the account or balance.' }
                    ]} />

                    <CodeExample samples={[{
                        lang: 'JSON',
                        code: `{
    "msgid": "MGS1010101",
    "status": "DELIVRD",
    "reason": "DELIVRD",
    "destination": "233276128036",
    "statusdate": "2024-04-23T14:59:14.143+00:00",
    "handlecharge": 4,
    "topupcharge": 0
}`
                    }]} theme={theme} />

                    <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>What Are The Benefits?</h2>
                    <ul style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 2, paddingLeft: '1.5rem', listStyleType: 'disc', marginBottom: '2rem' }}>
                        <li><strong>Efficiency:</strong> Reduces the need for manual status checks.</li>
                        <li><strong>Automation:</strong> Enables automated workflows based on message status.</li>
                        <li><strong>Reliability:</strong> Ensures you're informed about message delivery in real-time.</li>
                    </ul>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                        In summary, a callback URL is a critical feature for integrating FROG into your application, providing real-time updates and enabling better message tracking and management.
                    </p>
                </>
            )
        },
        'Send General': {
            title: 'Send Generalized Messages',
            body: (() => {
                const samples = [
                    {
                        lang: 'cURL',
                        code: `curl -X POST 'https://frogapi.wigal.com.gh/api/v3/sms/send' \\
-H "API-KEY: your_api_key_here" \\
-H "USERNAME: your_username_here" \\
-d '{
    "senderid": "Lomo Inc",
    "destinations": [
        {
            "destination": "0222222222",
            "msgid": "MGS1010101"
        }
    ],
    "message": "This is a sample message for SMS sending via FrogAPI.",
    "smstype": "text"
}'`
                    },
                    {
                        lang: 'JavaScript',
                        code: `const apiKey = 'your_api_key_here'; // Replace with your API Key
const username = 'your_username_here'; // Replace with your Username
const postData = {
    "senderid": "Lomo Inc",
    "destinations": [{
        "destination": "0222222222",
        "msgid": "MGS1010101"
    }],
    "message": "This is a sample message for SMS sending via FrogAPI.",
    "smstype": "text"
};

fetch('https://frogapi.wigal.com.gh/api/v3/sms/send', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'API-KEY': apiKey,
        'USERNAME': username
    },
    body: JSON.stringify(postData)
})
.then(response => response.json())
.then(data => {
    console.log(data);
})
.catch(error => {
    console.error('Error:', error);
});`
                    },
                    {
                        lang: 'Python',
                        code: `import requests
import json

api_key = 'your_api_key_here' # Replace with your API Key
username = 'your_username_here' # Replace with your Username
post_data = {
    'senderid': 'Lomo Inc',
    'destinations': [{
        'destination': '0222222222',
        'msgid': 'MGS1010101'
    }],
    'message': 'This is a sample message for SMS sending via FrogAPI.',
    'smstype': 'text'
}

headers = {
    'Content-Type': 'application/json',
    'API-KEY': api_key,
    'USERNAME': username
}

response = requests.post('https://frogapi.wigal.com.gh/api/v3/sms/send', headers=headers, data=json.dumps(post_data))

print(response.json())`
                    },
                    {
                        lang: 'PHP',
                        code: `<?php
$apiKey = 'your_api_key_here'; // Replace with your API Key
$username = 'your_username_here'; // Replace with your Username
$postData = [
    'senderid' => 'Lomo Inc',
    'destinations' => [[
        'destination' => '0222222222',
        'msgid' => 'MGS1010101'
    ]],
    'message' => 'This is a sample message for SMS sending via FrogAPI.',
    'smstype' => 'text'
];

$ch = curl_init('https://frogapi.wigal.com.gh/api/v3/sms/send');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'API-KEY: ' . $apiKey,
    'USERNAME: ' . $username
));
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));

$response = curl_exec($ch);
if(curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
} else {
    echo $response;
}
curl_close($ch);
?>`
                    }
                ];

                const requestObjectSample = [
                    {
                        lang: 'JSON',
                        code: `{
    "senderid": "Lomo Inc",
    "destinations": [
        {
            "destination": "0222222222",
            "msgid": "MGS1010101"
        }
    ],
    "message": "This is a sample message for SMS sending via FrogAPI.",
    "smstype": "text"
}`
                    }
                ];

                const responseSample = [
                    {
                        lang: '200',
                        code: `{
    "status": "ACCEPTD",
    "message": "Message Accepted For Processing"
}`
                    },
                    {
                        lang: '400',
                        code: `{
    "status": "INVALID_REQUEST",
    "message": "Invalid request parameters",
    "errors": [
        "Sender ID is required",
        "Message length exceeds maximum limit",
        "Invalid destination number format"
    ]
}`
                    },
                    {
                        lang: '401',
                        code: `{
    "status": "UNAUTHORIZED",
    "message": "Authentication failed"
}`
                    },
                    {
                        lang: '403',
                        code: `{
    "status": "FORBIDDEN",
    "message": "Insufficient permissions"
}`
                    },
                    {
                        lang: '404',
                        code: `{
    "status": "SENDER_ID_NOT_FOUND",
    "message": "Sender ID not found or not approved"
}`
                    },
                    {
                        lang: '500',
                        code: `{
    "status": "ERROR",
    "message": "Internal server error"
}`
                    }
                ];

                return {
                    main: (
                        <>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                                Send Generalized Messages.
                            </p>
                            <EndpointBox method="POST" url="https://frogapi.wigal.com.gh/api/v3/sms/send" theme={theme} />

                            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>Request Object</h2>
                            <ResponseTable data={[
                                { field: 'senderid', type: 'string', description: 'The senderID used for sending message. Approved SenderIDs only' },
                                { field: 'destination', type: 'string', description: 'Recipient Phone Number.' },
                                { field: 'msgid', type: 'string', description: 'Your message ID.' },
                                { field: 'message', type: 'string', description: 'The message to be sent.' },
                                { field: 'smstype', type: 'string', description: 'The type of message to be sent. Default is text.' }
                            ]} />

                            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>Response Object</h2>
                            <ResponseTable data={[
                                { field: 'status', type: 'string', description: 'The status of the request.' },
                                { field: 'message', type: 'string', description: 'The message response.' }
                            ]} />

                            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>Responses</h2>

                            <ResponseAccordion code="200" status="ACCEPTED">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Returns "ACCEPTD" when message is successfully queued' },
                                    { field: 'message', type: 'string', description: 'Returns "Message Accepted For Processing" on success' }
                                ]} />
                            </ResponseAccordion>

                            <ResponseAccordion code="400" status="BAD REQUEST" type="error">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Error status code ("INVALID_REQUEST")' },
                                    { field: 'message', type: 'string', description: 'Detailed error message explaining the issue' }
                                ]} />
                            </ResponseAccordion>

                            <ResponseAccordion code="401" status="UNAUTHORIZED" type="error">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Error status code ("UNAUTHORIZED")' },
                                    { field: 'message', type: 'string', description: 'Message Response' }
                                ]} />
                            </ResponseAccordion>

                            <ResponseAccordion code="403" status="FORBIDDEN" type="error">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Error status code ("FORBIDDEN")' },
                                    { field: 'message', type: 'string', description: 'Message Response' }
                                ]} />
                            </ResponseAccordion>

                            <ResponseAccordion code="404" status="NOT FOUND" type="error">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Error status code (e.g., "SENDER_ID_NOT_FOUND")' },
                                    { field: 'message', type: 'string', description: 'Detailed error message explaining the issue' },
                                    { field: 'data', type: 'null', description: 'No data returned for error responses' }
                                ]} />
                            </ResponseAccordion>

                            <ResponseAccordion code="500" status="SERVER ERROR" type="error">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Returns "ERROR" for server errors' },
                                    { field: 'message', type: 'string', description: 'Generic error message "Internal server error"' }
                                ]} />
                            </ResponseAccordion>
                        </>
                    ),
                    right: (
                        <>
                            <h2 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>Endpoint</h2>
                            <CodeExample samples={samples} theme={theme} />

                            <h2 style={{ fontSize: '1rem', marginBottom: '1rem', marginTop: '3rem', color: 'var(--text-primary)', fontWeight: 700 }}>Request Object</h2>
                            <CodeExample samples={requestObjectSample} theme={theme} />

                            <h2 style={{ fontSize: '1rem', marginBottom: '1rem', marginTop: '3rem', color: 'var(--text-primary)', fontWeight: 700 }}>Response Object</h2>
                            <CodeExample samples={responseSample} theme={theme} />
                        </>
                    )
                };
            })()
        },
        'Send Personalized': {
            title: 'Send Personalized Messages',
            body: (() => {
                const samples = [
                    {
                        lang: 'cURL',
                        code: `curl -X POST 'https://frogapi.wigal.com.gh/api/v3/sms/send' \\
-H "API-KEY: your_api_key_here" \\
-H "USERNAME: your_username_here" \\
-d '{
    "senderid": "OGK123",
    "destinations": [{
        "destination": "0542709440",
        "message": "Hello Joe your order is ready",
        "msgid": "MGS1010101",
        "smstype": "text"
    }]
}'`
                    },
                    {
                        lang: 'JavaScript',
                        code: `const apiKey = 'your_api_key_here'; // Replace with your API Key
const username = 'your_username_here'; // Replace with your Username
const postData = {
    "senderid": "OGK123",
    "destinations": [{
        "destination": "0542709440",
        "message": "Hello Joe your order is ready",
        "msgid": "MGS1010101",
        "smstype": "text"
    }]
};

fetch('https://frogapi.wigal.com.gh/api/v3/sms/send', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'API-KEY': apiKey,
        'USERNAME': username
    },
    body: JSON.stringify(postData)
})
.then(response => response.json())
.then(data => {
    console.log(data);
})
.catch(error => {
    console.error('Error:', error);
});`
                    },
                    {
                        lang: 'Python',
                        code: `import requests
import json

api_key = 'your_api_key_here' # Replace with your API Key
username = 'your_username_here' # Replace with your Username
post_data = {
    'senderid': 'OGK123',
    'destinations': [{
        'destination': '0542709440',
        'message': 'Hello Joe your order is ready',
        'msgid': 'MGS1010101',
        'smstype': 'text'
    }]
}

headers = {
    'Content-Type': 'application/json',
    'API-KEY': api_key,
    'USERNAME': username
}

response = requests.post('https://frogapi.wigal.com.gh/api/v3/sms/send', headers=headers, data=json.dumps(post_data))

print(response.json())`
                    },
                    {
                        lang: 'PHP',
                        code: `<?php
$apiKey = 'your_api_key_here'; // Replace with your API Key
$username = 'your_username_here'; // Replace with your Username
$postData = array(
    'senderid' => 'OGK123',
    'destinations' => array(
        array(
            'destination' => '0542709440',
            'message' => 'Hello Joe your order is ready',
            'msgid' => 'MGS1010101',
            'smstype' => 'text'
        )
    )
);

$ch = curl_init('https://frogapi.wigal.com.gh/api/v3/sms/send');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'API-KEY: ' . $apiKey,
    'USERNAME: ' . $username
));
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));

$response = curl_exec($ch);
if(curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
} else {
    echo $response;
}
curl_close($ch);
?>`
                    }
                ];

                const responseSample = [
                    {
                        lang: '200',
                        code: `{
    "status": "ACCEPTD",
    "message": "Message Accepted For Processing"
}`
                    },
                    {
                        lang: '401',
                        code: `{
    "status": "UNAUTHORIZED",
    "message": "Invalid API credentials"
}`
                    },
                    {
                        lang: '404',
                        code: `{
    "status": "SENDER_ID_NOT_FOUND",
    "message": "Sender ID: 4865 is not valid",
    "data": null
}`
                    },
                    {
                        lang: '500',
                        code: `{
    "status": "ERROR",
    "message": "Internal server error"
}`
                    }
                ];

                const requestObjectSample = [
                    {
                        lang: 'JSON',
                        code: `{
    "senderid": "OGK123",
    "destinations": [
        {
            "destination": "0542709440",
            "message": "Hello Joe your order is ready",
            "msgid": "MGS1010101",
            "smstype": "text"
        }
    ]
}`
                    }
                ];

                return {
                    main: (
                        <>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                                Send Personalized Messages.
                            </p>
                            <EndpointBox method="POST" url="https://frogapi.wigal.com.gh/api/v3/sms/send" theme={theme} />

                            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>Request Object</h2>
                            <ResponseTable data={[
                                { field: 'senderid', type: 'string', description: 'The senderID used for sending message. Approved SenderIDs only' },
                                { field: 'destination', type: 'string', description: 'Recipient Phone Number.' },
                                { field: 'msgid', type: 'string', description: 'Your message ID.' },
                                { field: 'message', type: 'string', description: 'The message to be sent.' },
                                { field: 'smstype', type: 'string', description: 'The type of message to be sent. Default is text.' }
                            ]} />

                            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>Response Object</h2>
                            <ResponseTable data={[
                                { field: 'status', type: 'string', description: 'The status of the request.' },
                                { field: 'message', type: 'string', description: 'The message response.' }
                            ]} />

                            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>Responses</h2>

                            <ResponseAccordion code="200" status="ACCEPTED">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Returns "ACCEPTD" when message is successfully queued' },
                                    { field: 'message', type: 'string', description: 'Returns "Message Accepted For Processing" on success' }
                                ]} />
                            </ResponseAccordion>

                            <ResponseAccordion code="401" status="UNAUTHORIZED" type="error">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Error status code ("UNAUTHORIZED")' },
                                    { field: 'message', type: 'string', description: 'Detailed error message explaining the issue' }
                                ]} />
                            </ResponseAccordion>

                            <ResponseAccordion code="404" status="NOT FOUND" type="error">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Error status code (e.g., "SENDER_ID_NOT_FOUND")' },
                                    { field: 'message', type: 'string', description: 'Detailed error message explaining the issue' },
                                    { field: 'data', type: 'null', description: 'No data returned for error responses' }
                                ]} />
                            </ResponseAccordion>

                            <ResponseAccordion code="500" status="SERVER ERROR" type="error">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Returns "ERROR" for server errors' },
                                    { field: 'message', type: 'string', description: 'Generic error message "Internal server error"' }
                                ]} />
                            </ResponseAccordion>
                        </>
                    ),
                    right: (
                        <>
                            <h2 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>Endpoint</h2>
                            <CodeExample samples={samples} theme={theme} />

                            <h2 style={{ fontSize: '1rem', marginBottom: '1rem', marginTop: '3rem', color: 'var(--text-primary)', fontWeight: 700 }}>Request Object</h2>
                            <CodeExample samples={requestObjectSample} theme={theme} />

                            <h2 style={{ fontSize: '1rem', marginBottom: '1rem', marginTop: '3rem', color: 'var(--text-primary)', fontWeight: 700 }}>Response Object</h2>
                            <CodeExample samples={responseSample} theme={theme} />
                        </>
                    )
                };
            })()
        },
        'SMS Generate OTP': {
            title: 'SMS OTP Generation',
            body: (() => {
                const samples = [
                    {
                        lang: 'cURL',
                        code: `curl -X POST 'https://frogapi.wigal.com.gh/api/v3/sms/otp/generate' \\
-H "API-KEY: your_api_key_here" \\
-H "USERNAME: your_username_here" \\
-d '{
    "number": "0276128036",
    "expiry": 1,
    "length": 5,
    "messagetemplate": "Hello, your OTP is : %OTPCODE%. It will expire after %EXPIRY% mins",
    "type": "ALPHANUMERIC",
    "senderid": "FROGy"
}'`
                    },
                    {
                        lang: 'JavaScript',
                        code: `const apiKey = 'your_api_key_here'; // Replace with your API Key
const username = 'your_username_here'; // Replace with your Username

const postData = {
    number: "0276128036",
    expiry: 1,
    length: 5,
    messagetemplate: "Hello, your OTP is : %OTPCODE%. It will expire after %EXPIRY% mins",
    type: "ALPHANUMERIC",
    senderid: "FROGy"
};

fetch('https://frogapi.wigal.com.gh/api/v3/sms/otp/generate', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'API-KEY': apiKey,
        'USERNAME': username
    },
    body: JSON.stringify(postData)
})
.then(response => response.json())
.then(data => {
    console.log(data);
})
.catch(error => {
    console.error('Error:', error);
});`
                    },
                    {
                        lang: 'Python',
                        code: `import requests
import json

api_key = 'your_api_key_here' # Replace with your API Key
username = 'your_username_here' # Replace with your Username

post_data = {
    "number": "0276128036",
    "expiry": 1,
    "length": 5,
    "messagetemplate": "Hello, your OTP is : %OTPCODE%. It will expire after %EXPIRY% mins",
    "type": "ALPHANUMERIC",
    "senderid": "FROGy"
}

headers = {
    'Content-Type': 'application/json',
    'API-KEY': api_key,
    'USERNAME': username
}

response = requests.post('https://frogapi.wigal.com.gh/api/v3/sms/otp/generate', headers=headers, data=json.dumps(post_data))

print(response.json())`
                    },
                    {
                        lang: 'PHP',
                        code: `<?php
$apiKey = 'your_api_key_here'; // Replace with your API Key
$username = 'your_username_here'; // Replace with your Username

$postData = array(
    'number' => '0276128036',
    'expiry' => 1,
    'length' => 5,
    'messagetemplate' => 'Hello, your OTP is : %OTPCODE%. It will expire after %EXPIRY% mins',
    'type' => 'ALPHANUMERIC',
    'senderid' => 'FROGy'
);

$ch = curl_init('https://frogapi.wigal.com.gh/api/v3/sms/otp/generate');

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'API-KEY: ' . $apiKey,
    'USERNAME: ' . $username
));

curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));

$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
} else {
    echo $response;
}

curl_close($ch);
?>`
                    }
                ];

                const requestObjectSample = [
                    {
                        lang: 'JSON',
                        code: `{
  "number": "0276128936",
  "expiry": 1,
  "length": 5,
  "messagetemplate": "Hello, your OTP is : %OTPCODE%. It will expire after %EXPIRY% mins",
  "type": "ALPHANUMERIC",
  "senderid": "FROGy"
}`
                    }
                ];

                const responseSample = [
                    {
                        lang: '200',
                        code: `{
    "status": "SUCCESS",
    "message": "OTP processed for delivery"
}`
                    },
                    {
                        lang: '402',
                        code: `{
    "status": "ERROR",
    "message": "Insufficient balance to process request"
}`
                    },
                    {
                        lang: '404',
                        code: `{
    "status": "ERROR",
    "message": "Invalid phone number format"
}`
                    },
                    {
                        lang: '422',
                        code: `{
    "status": "ERROR",
    "message": "Message template must contain %OTPCODE% placeholder"
}`
                    },
                    {
                        lang: '500',
                        code: `{
    "status": "ERROR",
    "message": "Internal server error"
}`
                    }
                ];

                return {
                    main: (
                        <>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                                Generate SMS OTP.
                            </p>
                            <EndpointBox method="POST" url="https://frogapi.wigal.com.gh/api/v3/sms/otp/generate" theme={theme} />

                            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>Request Object</h2>
                            <ResponseTable data={[
                                { field: 'number', type: 'string', description: "The recipient's phone number." },
                                { field: 'expiry', type: 'integer', description: 'The time duration before the OTP expires.' },
                                { field: 'length', type: 'integer', description: 'The length of the OTP code.' },
                                { field: 'messagetemplate', type: 'string', description: 'The message template with placeholders.' },
                                { field: 'type', type: 'string', description: 'Type of OTP (NUMERIC/ALPHA/ALPHANUMERIC).' },
                                { field: 'senderid', type: 'string', description: 'Approved Sender ID.' }
                            ]} />

                            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>Placeholders</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                                Available placeholders: <code style={{ color: 'var(--brand-green)' }}>%EXPIRY%</code>, <code style={{ color: 'var(--brand-green)' }}>%OTPCODE%</code>, <code style={{ color: 'var(--brand-green)' }}>%SERVICE%</code>, <code style={{ color: 'var(--brand-green)' }}>%LENGTH%</code>, <code style={{ color: 'var(--brand-green)' }}>%TYPE%</code>.
                            </p>
                            <ResponseTable data={[
                                { field: '%EXPIRY%', type: 'string', description: 'Expiry time in minutes' },
                                { field: '%OTPCODE%', type: 'string', description: 'Generated OTP code' },
                                { field: '%SERVICE%', type: 'string', description: 'Service/Application name' },
                                { field: '%LENGTH%', type: 'string', description: 'OTP code length' },
                                { field: '%TYPE%', type: 'string', description: 'OTP code type' }
                            ]} />

                            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>Responses</h2>

                            <ResponseAccordion code="200" status="OK">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Returns "SUCCESS" when OTP is generated' },
                                    { field: 'message', type: 'string', description: 'Confirmation message' }
                                ]} />
                            </ResponseAccordion>

                            <ResponseAccordion code="402" status="PAYMENT REQUIRED" type="error">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Error status ("ERROR")' },
                                    { field: 'message', type: 'string', description: 'Error description ("Insufficient Balance")' }
                                ]} />
                            </ResponseAccordion>

                            <ResponseAccordion code="404" status="NOT FOUND" type="error">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Error status code' },
                                    { field: 'message', type: 'string', description: 'Error description' }
                                ]} />
                            </ResponseAccordion>

                            <ResponseAccordion code="422" status="UNPROCESSABLE ENTITY" type="error">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Error status code ("ERROR")' },
                                    { field: 'message', type: 'string', description: 'Error description ("Message template must contain %OTPCODE% placeholder")' }
                                ]} />
                            </ResponseAccordion>

                            <ResponseAccordion code="500" status="SERVER ERROR" type="error">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Server error status' },
                                    { field: 'message', type: 'string', description: 'Internal server error message' }
                                ]} />
                            </ResponseAccordion>
                        </>
                    ),
                    right: (
                        <>
                            <h2 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>Endpoint</h2>
                            <CodeExample samples={samples} theme={theme} />

                            <h2 style={{ fontSize: '1rem', marginBottom: '1rem', marginTop: '3rem', color: 'var(--text-primary)', fontWeight: 700 }}>Request Object</h2>
                            <CodeExample samples={requestObjectSample} theme={theme} />

                            <h2 style={{ fontSize: '1rem', marginBottom: '1rem', marginTop: '3rem', color: 'var(--text-primary)', fontWeight: 700 }}>Response Object</h2>
                            <CodeExample samples={responseSample} theme={theme} />
                        </>
                    )
                };
            })()
        },
        'SMS Verify OTP': {
            title: 'SMS OTP Verification',
            body: (() => {
                const samples = [
                    {
                        lang: 'cURL',
                        code: `curl -X POST 'https://frogapi.wigal.com.gh/api/v3/sms/otp/verify' \\
-H "API-KEY: your_api_key_here" \\
-H "USERNAME: your_username_here" \\
-d '{
    "otpcode": "otp_code_here",
    "number": "recipient_phone_number"
}'`
                    },
                    {
                        lang: 'JavaScript',
                        code: `const apiKey = 'your_api_key_here'; // Replace with your API Key
const username = 'your_username_here'; // Replace with your Username

const postData = {
    otpcode: 'otp_code_here',
    number: 'recipient_phone_number'
};

fetch('https://frogapi.wigal.com.gh/api/v3/sms/otp/verify', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'API-KEY': apiKey,
        'USERNAME': username
    },
    body: JSON.stringify(postData)
})
.then(response => response.json())
.then(data => {
    console.log(data);
})
.catch(error => {
    console.error('Error:', error);
});`
                    },
                    {
                        lang: 'Python',
                        code: `import requests
import json

api_key = 'your_api_key_here' # Replace with your API Key
username = 'your_username_here' # Replace with your Username

post_data = {
    'otpcode': 'otp_code_here',
    'number': 'recipient_phone_number'
}

headers = {
    'Content-Type': 'application/json',
    'API-KEY': api_key,
    'USERNAME': username
}

response = requests.post('https://frogapi.wigal.com.gh/api/v3/sms/otp/verify', headers=headers, data=json.dumps(post_data))

print(response.json())`
                    },
                    {
                        lang: 'PHP',
                        code: `<?php
$apiKey = 'your_api_key_here'; // Replace with your API Key
$username = 'your_username_here'; // Replace with your Username

$postData = array(
    'otpcode' => 'otp_code_here',
    'number' => 'recipient_phone_number'
);

$ch = curl_init('https://frogapi.wigal.com.gh/api/v3/sms/otp/verify');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'API-KEY: ' . $apiKey,
    'USERNAME: ' . $username
));
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));

$response = curl_exec($ch);
if(curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
} else {
    echo $response;
}
curl_close($ch);
?>`
                    }
                ];

                const requestObjectSample = [
                    {
                        lang: 'JSON',
                        code: `{
  "otpcode": "8a2b3",
  "number": "0276128936"
}`
                    }
                ];

                const responseSample = [
                    {
                        lang: '200',
                        code: `{
    "status": "SUCCESS",
    "message": "OTP verified successfully"
}`
                    },
                    {
                        lang: '400',
                        code: `{
    "status": "ERROR",
    "message": "Missing required fields"
}`
                    },
                    {
                        lang: '404',
                        code: `{
    "status": "ERROR",
    "message": "Invalid OTP code"
}`
                    },
                    {
                        lang: '408',
                        code: `{
    "status": "ERROR",
    "message": "OTP code has expired"
}`
                    },
                    {
                        lang: '500',
                        code: `{
    "status": "ERROR",
    "message": "Internal server error"
}`
                    }
                ];

                return {
                    main: (
                        <>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                                Verify SMS OTP code.
                            </p>
                            <EndpointBox method="POST" url="https://frogapi.wigal.com.gh/api/v3/sms/otp/verify" theme={theme} />

                            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>Request Object</h2>
                            <ResponseTable data={[
                                { field: 'otpcode', type: 'string', description: 'The OTP code to be verified.' },
                                { field: 'number', type: 'string', description: "The recipient's phone number." }
                            ]} />

                            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>Response Object</h2>
                            <ResponseTable data={[
                                { field: 'status', type: 'string', description: 'The status of the request.' },
                                { field: 'message', type: 'string', description: 'The message response.' }
                            ]} />

                            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>Responses</h2>

                            <ResponseAccordion code="200" status="OK">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Verification success status' },
                                    { field: 'message', type: 'string', description: 'Confirmation message' }
                                ]} />
                            </ResponseAccordion>

                            <ResponseAccordion code="400" status="BAD REQUEST" type="error">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Status Message ("ERROR")' },
                                    { field: 'message', type: 'string', description: 'Error description ("Missing required fields")' }
                                ]} />
                            </ResponseAccordion>

                            <ResponseAccordion code="404" status="NOT FOUND" type="error">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Verification error status' },
                                    { field: 'message', type: 'string', description: 'Error description' }
                                ]} />
                            </ResponseAccordion>

                            <ResponseAccordion code="408" status="REQUEST TIMEOUT" type="error">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Status Message ("ERROR")' },
                                    { field: 'message', type: 'string', description: 'Error description ("OTP code has expired")' }
                                ]} />
                            </ResponseAccordion>

                            <ResponseAccordion code="500" status="SERVER ERROR" type="error">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Server error status' },
                                    { field: 'message', type: 'string', description: 'Internal server error message' }
                                ]} />
                            </ResponseAccordion>
                        </>
                    ),
                    right: (
                        <>
                            <h2 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>Endpoint</h2>
                            <CodeExample samples={samples} theme={theme} />

                            <h2 style={{ fontSize: '1rem', marginBottom: '1rem', marginTop: '3rem', color: 'var(--text-primary)', fontWeight: 700 }}>Request Object</h2>
                            <CodeExample samples={requestObjectSample} theme={theme} />

                            <h2 style={{ fontSize: '1rem', marginBottom: '1rem', marginTop: '3rem', color: 'var(--text-primary)', fontWeight: 700 }}>Response Object</h2>
                            <CodeExample samples={responseSample} theme={theme} />
                        </>
                    )
                };
            })()
        },
        'Send Voice': {
            title: 'Send Voice',
            body: (() => {
                const samples = [
                    {
                        lang: 'cURL',
                        code: `curl -X POST 'https://frogapi.wigal.com.gh/api/v3/voice/send' \\
-H "API-KEY: your_api_key_here" \\
-H "USERNAME: your_username_here" \\
-d '{
    "callerid": "your_caller_id",
    "soundurl": "https://example.com/sound.wav",
    "servicetype": "CALL",
    "destinations": [{
        "destination": "0276128936",
        "msgid": "MSG123456789"
    }]
}'`
                    },
                    {
                        lang: 'JavaScript',
                        code: `const apiKey = 'your_api_key_here'; // Replace with your API Key
const username = 'your_username_here'; // Replace with your Username

const postData = {
    "callerid": "your_caller_id",
    "soundurl": "https://example.com/sound.wav",
    "servicetype": "CALL",
    "destinations": [{
        "destination": "0276128936",
        "msgid": "MSG123456789"
    }]
};

fetch('https://frogapi.wigal.com.gh/api/v3/voice/send', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'API-KEY': apiKey,
        'USERNAME': username
    },
    body: JSON.stringify(postData)
})
.then(response => response.json())
.then(data => {
    console.log(data);
})
.catch(error => {
    console.error('Error:', error);
});`
                    },
                    {
                        lang: 'Python',
                        code: `import requests
import json

api_key = 'your_api_key_here' # Replace with your API Key
username = 'your_username_here' # Replace with your Username

post_data = {
    'callerid': 'your_caller_id',
    'soundurl': 'https://example.com/sound.wav',
    'servicetype': 'CALL',
    'destinations': [{
        'destination': '0276128936',
        'msgid': 'MSG123456789'
    }]
}

headers = {
    'Content-Type': 'application/json',
    'API-KEY': api_key,
    'USERNAME': username
}

response = requests.post('https://frogapi.wigal.com.gh/api/v3/voice/send', headers=headers, data=json.dumps(post_data))

print(response.json())`
                    },
                    {
                        lang: 'PHP',
                        code: `<?php
$apiKey = 'your_api_key_here'; // Replace with your API Key
$username = 'your_username_here'; // Replace with your Username

$postData = array(
    'callerid' => 'your_caller_id',
    'soundurl' => 'https://example.com/sound.wav',
    'servicetype' => 'CALL',
    'destinations' => array(
        array(
            'destination' => '0276128936',
            'msgid' => 'MSG123456789'
        )
    )
);

$ch = curl_init('https://frogapi.wigal.com.gh/api/v3/voice/send');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'API-KEY: ' . $apiKey,
    'USERNAME: ' . $username
));
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));

$response = curl_exec($ch);
if(curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
} else {
    echo $response;
}
curl_close($ch);
?>`
                    }
                ];

                const requestObjectSample = [
                    {
                        lang: 'JSON',
                        code: `{
  "callerid": "your_caller_id",
  "soundurl": "https://example.com/sound.wav",
  "servicetype": "CALL",
  "destinations": [
    {
      "destination": "0276128936",
      "msgid": "MSG123456789"
    }
  ]
}`
                    }
                ];

                const responseSample = [
                    {
                        lang: '200',
                        code: `{
    "status": "ACCEPTD",
    "message": "Message Accepted For Processing"
}`
                    },
                    {
                        lang: '400',
                        code: `{
    "status": "ERROR",
    "message": "Invalid request parameters"
}`
                    },
                    {
                        lang: '401',
                        code: `{
    "status": "UNAUTHORIZED",
    "message": "Authentication failed"
}`
                    },
                    {
                        lang: '403',
                        code: `{
    "status": "FORBIDDEN",
    "message": "Insufficient permissions"
}`
                    },
                    {
                        lang: '404',
                        code: `{
    "status": "ERROR",
    "message": "Resource not found"
}`
                    },
                    {
                        lang: '500',
                        code: `{
    "status": "ERROR",
    "message": "Internal server error"
}`
                    }
                ];

                return {
                    main: (
                        <>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                                Send voice messages.
                            </p>
                            <EndpointBox method="POST" url="https://frogapi.wigal.com.gh/api/v3/voice/send" theme={theme} />

                            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>Request Object</h2>
                            <ResponseTable data={[
                                { field: 'callerid', type: 'string', description: "The caller ID used for the voice call. Note: If you don't add a caller ID, a default one will be used. If you want a specific caller ID, you must subscribe to it." },
                                { field: 'soundurl', type: 'string', description: 'URL to the sound file to be played. Accepted sound: WAV file (Channels: mono, Format: wav(a-law), Sample rate: 8KHz, Bit rate: 64kbps)' },
                                { field: 'servicetype', type: 'string', description: 'The type of service. Default is "CALL"' },
                                { field: 'destinations', type: 'array', description: 'Array of destination objects containing destination phone number and message ID' },
                                { field: 'destinations[].destination', type: 'string', description: 'Recipient Phone Number' },
                                { field: 'destinations[].msgid', type: 'string', description: 'Your message ID' }
                            ]} />

                            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>Response Object</h2>
                            <ResponseTable data={[
                                { field: 'status', type: 'string', description: 'The status of the request' },
                                { field: 'message', type: 'string', description: 'The message response' }
                            ]} />

                            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>Responses</h2>

                            <ResponseAccordion code="200" status="OK">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Returns "ACCEPTD" when voice message is successfully accepted for processing' },
                                    { field: 'message', type: 'string', description: 'Returns "Message Accepted For Processing" on successful request' }
                                ]} />
                            </ResponseAccordion>

                            <ResponseAccordion code="400" status="INVALID REQUEST" type="error">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Error status code ("INVALID_REQUEST")' },
                                    { field: 'message', type: 'string', description: 'Detailed error message explaining the issue' }
                                ]} />
                            </ResponseAccordion>

                            <ResponseAccordion code="401" status="UNAUTHORIZED" type="error">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Error status code ("UNAUTHORIZED")' },
                                    { field: 'message', type: 'string', description: 'Message Response' }
                                ]} />
                            </ResponseAccordion>

                            <ResponseAccordion code="403" status="FORBIDDEN" type="error">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Error status code ("FORBIDDEN")' },
                                    { field: 'message', type: 'string', description: 'Message Response' }
                                ]} />
                            </ResponseAccordion>

                            <ResponseAccordion code="404" status="NOT FOUND" type="error">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Error status code' },
                                    { field: 'message', type: 'string', description: 'Detailed error message explaining the issue' }
                                ]} />
                            </ResponseAccordion>

                            <ResponseAccordion code="500" status="SERVER ERROR" type="error">
                                <ResponseTable data={[
                                    { field: 'status', type: 'string', description: 'Returns "ERROR" for server errors' },
                                    { field: 'message', type: 'string', description: 'Generic error message "Internal server error"' }
                                ]} />
                            </ResponseAccordion>
                        </>
                    ),
                    right: (
                        <>
                            <h2 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>Endpoint</h2>
                            <CodeExample samples={samples} theme={theme} />

                            <h2 style={{ fontSize: '1rem', marginBottom: '1rem', marginTop: '3rem', color: 'var(--text-primary)', fontWeight: 700 }}>Request Object</h2>
                            <CodeExample samples={requestObjectSample} theme={theme} />

                            <h2 style={{ fontSize: '1rem', marginBottom: '1rem', marginTop: '3rem', color: 'var(--text-primary)', fontWeight: 700 }}>Response Object</h2>
                            <CodeExample samples={responseSample} theme={theme} />
                        </>
                    )
                };
            })()
        },
        'Send voice interactive': (() => {
            const samples = [
                {
                    lang: 'curl',
                    code: `curl -X POST 'https://frogapi.wigal.com.gh/api/v3/voice/send/dynamic' \
-H "API-KEY: your_api_key_here" \
-H "USERNAME: your_username_here" \
-d '{
  "callerid": "your_caller_id",
  "servicetype": "CALL",
  "destinations": [{
    "destination": "0276128936",
    "msgid": "MSG123456789"
  }]
}'`
                },
                {
                    lang: 'javascript',
                    code: `const apiKey = 'your_api_key_here'; // Replace with your API Key
const username = 'your_username_here'; // Replace with your Username
const postData = {
    "callerid": "your_caller_id",
    "servicetype": "CALL",
    "destinations": [{
        "destination": "0276128936",
        "msgid": "MSG123456789"
    }]
};

fetch('https://frogapi.wigal.com.gh/api/v3/voice/send/dynamic', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'API-KEY': apiKey,
        'USERNAME': username
    },
    body: JSON.stringify(postData)
})
.then(response => response.json())
.then(data => {
    console.log(data);
})
.catch(error => {
    console.error('Error:', error);
});`
                },
                {
                    lang: 'python',
                    code: `import requests
import json

api_key = 'your_api_key_here' # Replace with your API Key
username = 'your_username_here' # Replace with your Username
post_data = {
    'callerid': 'your_caller_id',
    'servicetype': 'CALL',
    'destinations': [{
        'destination': '0276128936',
        'msgid': 'MSG123456789'
    }]
}

headers = {
    'Content-Type': 'application/json',
    'API-KEY': api_key,
    'USERNAME': username
}

response = requests.post('https://frogapi.wigal.com.gh/api/v3/voice/send/dynamic', headers=headers, data=json.dumps(post_data))

print(response.json())`
                },
                {
                    lang: 'php',
                    code: `<?php
$apiKey = 'your_api_key_here'; // Replace with your API Key
$username = 'your_username_here'; // Replace with your Username
$postData = array(
    'callerid' => 'your_caller_id',
    'servicetype' => 'CALL',
    'destinations' => array(
        array(
            'destination' => '0276128936',
            'msgid' => 'MSG123456789'
        )
    )
);

$ch = curl_init('https://frogapi.wigal.com.gh/api/v3/voice/send/dynamic');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'API-KEY: ' . $apiKey,
    'USERNAME: ' . $username
));
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));

$response = curl_exec($ch);
if(curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
} else {
    echo $response;
}
curl_close($ch);
?>`
                }
            ];

            const requestObjectSample = [
                {
                    lang: 'json',
                    code: `{
  "callerid": "your_caller_id",
  "servicetype": "CALL",
  "destinations": [
    {
      "destination": "0276128936",
      "msgid": "MSG123456789"
    }
  ]
}`
                }
            ];

            const responseSample = [
                {
                    lang: '200',
                    code: `{
  "status": "ACCEPTD",
  "message": "Message Accepted For Processing"
}`
                },
                {
                    lang: '400',
                    code: `{
  "status": "ERROR",
  "message": "Invalid request parameters"
}`
                },
                {
                    lang: '401',
                    code: `{
  "status": "UNAUTHORIZED",
  "message": "Authentication failed"
}`
                },
                {
                    lang: '403',
                    code: `{
  "status": "FORBIDDEN",
  "message": "Insufficient permissions"
}`
                },
                {
                    lang: '404',
                    code: `{
  "status": "ERROR",
  "message": "Resource not found"
}`
                },
                {
                    lang: '500',
                    code: `{
  "status": "ERROR",
  "message": "Internal server error"
}`
                }
            ];

            return {
                title: 'Send voice interactive',
                main: (
                    <>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                            Send interactive voice messages.
                        </p>
                        <EndpointBox method="POST" url="https://frogapi.wigal.com.gh/api/v3/voice/send/dynamic" theme={theme} />

                        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>Request Object</h2>

                        <div style={{
                            background: theme === 'dark' ? '#0a0a0a' : '#ffffff',
                            borderRadius: '16px',
                            border: `1px solid ${theme === 'dark' ? 'var(--border-color)' : '#e2e8f0'}`,
                            overflow: 'hidden',
                            marginBottom: '3rem',
                            marginTop: '2rem'
                        }}>
                            <div style={{
                                padding: '0.75rem 1.5rem',
                                borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#e2e8f0'}`,
                                background: theme === 'dark' ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: 'var(--text-secondary)'
                            }}>
                                Request Body
                            </div>
                            <SyntaxHighlighter
                                language="json"
                                style={vscDarkPlus}
                                customStyle={{
                                    margin: 0,
                                    padding: '1.5rem',
                                    background: theme === 'dark' ? '#0a0a0a' : '#ffffff',
                                    fontSize: '0.9rem',
                                    lineHeight: 1.6
                                }}
                            >
                                {`{
  "callerid": "your_caller_id",
  "servicetype": "CALL",
  "destinations": [
    {
      "destination": "0276128936",
      "msgid": "MSG123456789"
    }
  ]
}`}
                            </SyntaxHighlighter>
                        </div>

                        <ResponseTable data={[
                            { field: 'callerid', type: 'string', description: 'The caller ID used for the voice call' },
                            { field: 'servicetype', type: 'string', description: 'The type of service. Default is "CALL"' },
                            { field: 'destinations', type: 'array', description: 'Array of destination objects containing destination phone number and message ID' },
                            { field: 'destinations[].destination', type: 'string', description: 'Recipient Phone Number' },
                            { field: 'destinations[].msgid', type: 'string', description: 'Your message ID' }
                        ]} />

                        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>Response Object</h2>
                        <ResponseTable data={[
                            { field: 'status', type: 'string', description: 'The status of the request' },
                            { field: 'message', type: 'string', description: 'The message response' }
                        ]} />

                        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>Responses</h2>

                        <ResponseAccordion code="200" status="OK">
                            <ResponseTable data={[
                                { field: 'status', type: 'string', description: 'Returns "ACCEPTD" when message is accepted for processing' },
                                { field: 'message', type: 'string', description: 'Returns "Message Accepted For Processing" on successful request' }
                            ]} />
                        </ResponseAccordion>

                        <ResponseAccordion code="400" status="BAD REQUEST" type="error">
                            <ResponseTable data={[
                                { field: 'status', type: 'string', description: 'Error status code ("INVALID_REQUEST")' },
                                { field: 'message', type: 'string', description: 'Detailed error message explaining the issue' }
                            ]} />
                        </ResponseAccordion>

                        <ResponseAccordion code="401" status="UNAUTHORIZED" type="error">
                            <ResponseTable data={[
                                { field: 'status', type: 'string', description: 'Error status code ("UNAUTHORIZED")' },
                                { field: 'message', type: 'string', description: 'Message Response' }
                            ]} />
                        </ResponseAccordion>

                        <ResponseAccordion code="403" status="FORBIDDEN" type="error">
                            <ResponseTable data={[
                                { field: 'status', type: 'string', description: 'Error status code ("FORBIDDEN")' },
                                { field: 'message', type: 'string', description: 'Message Response' }
                            ]} />
                        </ResponseAccordion>

                        <ResponseAccordion code="404" status="NOT FOUND" type="error">
                            <ResponseTable data={[
                                { field: 'status', type: 'string', description: 'Error status code' },
                                { field: 'message', type: 'string', description: 'Detailed error message explaining the issue' }
                            ]} />
                        </ResponseAccordion>

                        <ResponseAccordion code="500" status="SERVER ERROR" type="error">
                            <ResponseTable data={[
                                { field: 'status', type: 'string', description: 'Returns "ERROR" for server errors' },
                                { field: 'message', type: 'string', description: 'Generic error message "Internal server error"' }
                            ]} />
                        </ResponseAccordion>

                        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>Voice Callback URL</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                            Your Voice Callback URL allows FROG to send real-time call events to your application and receive your responses to control the interactive voice call flow.
                        </p>

                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', marginTop: '2rem', fontWeight: 600 }}>How It Works</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    color: 'rgb(16, 185, 129)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    flexShrink: 0
                                }}>1</div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.5, margin: 0 }}>
                                    Provide Your Callback URL To Frog By Configuring It In Your Account Settings.
                                </p>
                            </div>
                        </div>

                        <div style={{ marginTop: '2.5rem', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            <video
                                src="/videos/voice-callback.webm"
                                autoPlay
                                loop
                                muted
                                playsInline
                                style={{ width: '100%', display: 'block' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    color: 'rgb(16, 185, 129)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    flexShrink: 0
                                }}>2</div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.5, margin: 0 }}>
                                    When call events occur (e.g., DIALED, RINGING, ANSWERED, ENDED), FROG will send an HTTP POST request to your callback URL with relevant call data.
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    color: 'rgb(16, 185, 129)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    flexShrink: 0
                                }}>3</div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.5, margin: 0 }}>
                                    Your endpoint should process the callback and respond with an action to control the call flow (e.g., READ, PLAY, COLLECT, RECORD).
                                </p>
                            </div>
                        </div>

                        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>Callback to you</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                            FROG will send an HTTP POST request to your callback URL endpoint with the following payload structure:
                        </p>

                        <div style={{
                            background: theme === 'dark' ? '#0a0a0a' : '#ffffff',
                            borderRadius: '16px',
                            border: `1px solid ${theme === 'dark' ? 'var(--border-color)' : '#e2e8f0'}`,
                            overflow: 'hidden',
                            marginBottom: '4rem'
                        }}>
                            <div style={{
                                padding: '0.75rem 1.5rem',
                                borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#e2e8f0'}`,
                                background: theme === 'dark' ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: 'var(--text-secondary)'
                            }}>
                                Request Payload
                            </div>
                            <SyntaxHighlighter
                                language="json"
                                style={vscDarkPlus}
                                customStyle={{
                                    margin: 0,
                                    padding: '1.5rem',
                                    background: theme === 'dark' ? '#0a0a0a' : '#ffffff',
                                    fontSize: '0.9rem',
                                    lineHeight: 1.6
                                }}
                            >
                                {`{
  "channelid": "CH123456789",
  "activitytime": "2024-04-23T14:59:14.143+00:00",
  "additionaldetails": "Call connected successfully",
  "event": "ANSWERED",
  "batchid": "BATCH001",
  "callfrom": "233276128036",
  "callto": "233276128037",
  "clientid": "MSG123456789",
  "callstarttime": "2024-04-23T14:58:00.000+00:00",
  "callendtime": "2024-04-23T14:59:30.000+00:00",
  "callduration": 90,
  "direction": "Outbound",
  "keypressed": "1"
}`}
                            </SyntaxHighlighter>
                        </div>

                        <ResponseTable data={[
                            { field: 'channelid', type: 'string', description: 'The unique ID for the call generated by Wigal' },
                            { field: 'activitytime', type: 'string', description: 'Timestamp of the event' },
                            { field: 'additionaldetails', type: 'string', description: 'Any additional details for the event' },
                            { field: 'event', type: 'string', description: 'The event type (see Events list below)' },
                            { field: 'batchid', type: 'string', description: 'Batch ID from Wigal' },
                            { field: 'callfrom', type: 'string', description: 'The caller ID' },
                            { field: 'callto', type: 'string', description: 'The destination number' },
                            { field: 'clientid', type: 'string', description: 'The unique ID the customer input when initiating the call (message ID)' },
                            { field: 'callstarttime', type: 'string', description: 'Timestamp when the call started' },
                            { field: 'callendtime', type: 'string', description: 'Timestamp when the call ended' },
                            { field: 'callduration', type: 'integer', description: 'Duration of the call in seconds' },
                            { field: 'direction', type: 'string', description: 'Call direction: "Inbound" or "Outbound"' },
                            { field: 'keypressed', type: 'string', description: 'Any key pressed during the call' }
                        ]} />

                        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>Events</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                            The following events can be sent to your callback URL:
                        </p>
                        <ResponseTable showType={false} data={[
                            { field: 'DIALED', description: 'Call has been dialed' },
                            { field: 'RINGING', description: 'Call is ringing' },
                            { field: 'ANSWERED', description: 'Call has been answered' },
                            { field: 'PROGRESS', description: 'Call is in progress' },
                            { field: 'ENDING', description: 'Call is ending' },
                            { field: 'ENDED', description: 'Call has ended' },
                            { field: 'Playback Started', description: 'Playback has started' },
                            { field: 'PlaybackFinished', description: 'Playback has finished' },
                            { field: 'PlaybackContinuing', description: 'Playback is continuing' },
                            { field: 'RecordingFinished', description: 'Recording has finished' },
                            { field: 'RecordingStarted', description: 'Recording has started' },
                            { field: 'RecordingFailed', description: 'Recording failed' },
                            { field: 'Answer', description: 'Call has been answered' },
                            { field: 'Dial', description: 'Call has been dialed' },
                            { field: 'ChannelDtmfReceived', description: 'The event contains the channel that pressed the DTMF key' }
                        ]} />

                        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>Actions</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                            The following actions can be sent in your response to control the call flow:
                        </p>

                        <TipBox theme={theme}>
                            <strong>Note:</strong> Actions can also trigger events depending on the action type. For example, when you send a <strong>PLAY</strong> action, you may receive events related to playback status. Similarly, <strong>COLLECT</strong> actions may generate events when digits are pressed, and <strong>RECORD</strong> actions may trigger events related to recording status.
                        </TipBox>

                        <ResponseTable showType={false} data={[
                            { field: 'READ', description: 'Read text to the caller' },
                            { field: 'PLAY', description: 'Play audio to the caller' },
                            { field: 'COLLECT', description: 'Collect input from the caller (DTMF)' },
                            { field: 'RECORD', description: 'Record audio from the caller' },
                            { field: 'DISCONNECT', description: 'Disconnect the call' },
                            { field: 'STOPRECORD', description: 'Stop recording audio' },
                            { field: 'STOPPLAY', description: 'Stop playing audio' },
                            { field: 'CONTINUE', description: 'Continue with the next step in the flow' }
                        ]} />

                        <TipBox theme={theme}>
                            <strong>Audio Format Requirements:</strong> For <strong>PLAY</strong> and <strong>RECORD</strong> actions, the <code>actiondata</code> field must contain an accessible audio URL. The audio file must be in <strong>WAV</strong> format with the following specifications:
                            <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem', listStyleType: 'disc' }}>
                                <li><strong>Format:</strong> WAV (a-law)</li>
                                <li><strong>Channels:</strong> Mono</li>
                                <li><strong>Sample rate:</strong> 8KHz</li>
                                <li><strong>Bit rate:</strong> 64kbps</li>
                            </ul>
                        </TipBox>

                        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>Response from your Callback</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                            Your endpoint should respond with the following payload structure to control the call flow:
                        </p>

                        <div style={{
                            background: theme === 'dark' ? '#0a0a0a' : '#ffffff',
                            borderRadius: '16px',
                            border: `1px solid ${theme === 'dark' ? 'var(--border-color)' : '#e2e8f0'}`,
                            overflow: 'hidden',
                            marginBottom: '4rem'
                        }}>
                            <div style={{
                                padding: '0.75rem 1.5rem',
                                borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#e2e8f0'}`,
                                background: theme === 'dark' ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: 'var(--text-secondary)'
                            }}>
                                Response Payload
                            </div>
                            <SyntaxHighlighter
                                language="json"
                                style={vscDarkPlus}
                                customStyle={{
                                    margin: 0,
                                    padding: '1.5rem',
                                    background: theme === 'dark' ? '#0a0a0a' : '#ffffff',
                                    fontSize: '0.9rem',
                                    lineHeight: 1.6
                                }}
                            >
                                {`{
  "channelid": "CH123456789",
  "action": "PLAY",
  "actiondata": "https://example.com/audio/welcome.wav",
  "batchid": "BATCH001",
  "callfrom": "233276128036",
  "callto": "233276128037",
  "clientid": "MSG123456789"
}`}
                            </SyntaxHighlighter>
                        </div>

                        <ResponseTable data={[
                            { field: 'channelid', type: 'string', description: 'The unique call ID from Wigal (same as received in callback)' },
                            { field: 'action', type: 'string', description: 'The action to perform (see Action list below)' },
                            { field: 'actiondata', type: 'string', description: 'Any required data depending on the action. For PLAY and RECORD actions, this must be an accessible audio URL (WAV format: mono, a-law, 8KHz, 64kbps)' },
                            { field: 'batchid', type: 'string', description: 'The same batch ID from Wigal (same as received in callback)' },
                            { field: 'callfrom', type: 'string', description: 'The caller ID (same as received in callback)' },
                            { field: 'callto', type: 'string', description: 'The destination number (same as received in callback)' },
                            { field: 'clientid', type: 'string', description: 'The message ID from the initial call (same as received in callback)' }
                        ]} />

                        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '4rem', fontWeight: 700 }}>What Are The Benefits?</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
                            {[
                                { title: 'Real-time Control', desc: 'Control the interactive voice call flow in real-time based on call events.' },
                                { title: 'Dynamic Interactions', desc: 'Create dynamic voice interactions that respond to user input and call state.' },
                                { title: 'Automation', desc: 'Automate complex voice workflows without manual intervention.' },
                                { title: 'Reliability', desc: 'Receive real-time updates about call status and events.' }
                            ].map((benefit, i) => (
                                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: 'var(--brand-green)',
                                        marginTop: '0.6rem',
                                        flexShrink: 0
                                    }} />
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, margin: 0 }}>
                                        <strong style={{ color: 'var(--text-primary)' }}>{benefit.title}:</strong> {benefit.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginTop: '3rem', fontStyle: 'italic', borderLeft: '4px solid var(--brand-green)', paddingLeft: '1.5rem' }}>
                            In summary, a Voice Callback URL is essential for implementing interactive voice calls, providing real-time event notifications and enabling dynamic call flow control.
                        </p>
                    </>
                ),
                right: (
                    <>
                        <h2 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>Endpoint</h2>
                        <CodeExample samples={samples} theme={theme} />

                        <h2 style={{ fontSize: '1rem', marginBottom: '1rem', marginTop: '3rem', color: 'var(--text-primary)', fontWeight: 700 }}>Request Object</h2>
                        <CodeExample samples={requestObjectSample} theme={theme} />

                        <h2 style={{ fontSize: '1rem', marginBottom: '1rem', marginTop: '3rem', color: 'var(--text-primary)', fontWeight: 700 }}>Response Object</h2>
                        <CodeExample samples={responseSample} theme={theme} />
                    </>
                )
            };
        })()
    };

    const rawContent = contentMap[activeSidebarItem] || {
        title: activeSidebarItem,
        body: (
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                This is the {activeSidebarItem} section of the documentation. Select a different option from the sidebar to view its details.
            </p>
        )
    };

    const currentContent = {
        title: rawContent.title,
        main: rawContent.main || rawContent.body?.main || rawContent.body,
        right: rawContent.right || rawContent.body?.right || null
    };

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    return (
        <div className="app-root bg-[var(--bg-primary)]" data-theme={theme}>
            <nav className="top-nav">
                <div className="top-row">
                    <div className="logo-section" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                            src={theme === 'dark' ? "/images/logo-white.png" : "/images/logo-main.png"}
                            alt="Logo"
                            style={{ height: '36px' }}
                        />
                    </div>

                    <div className="search-container" ref={searchRef}>
                        <div className="search-input-wrapper">
                            <Search size={16} style={{ marginRight: '8px', color: 'var(--text-secondary)' }} />
                            <input
                                id="docs-search"
                                type="text"
                                className="search-input"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setIsSearchOpen(true);
                                }}
                                onFocus={() => setIsSearchOpen(true)}
                                autoComplete="off"
                            />
                            <span className="search-hint">⌘K</span>
                        </div>

                        {isSearchOpen && filteredResults.length > 0 && (
                            <div className="search-results-dropdown">
                                {filteredResults.map((result, idx) => (
                                    <div
                                        key={idx}
                                        className="search-result-item"
                                        onClick={() => handleSearchResultClick(result)}
                                    >
                                        <div className="result-name">{result.name}</div>
                                        <div className="result-path">{result.tab} › {result.group}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {isSearchOpen && searchQuery.trim() !== '' && filteredResults.length === 0 && (
                            <div className="search-results-dropdown">
                                <div className="search-no-results">No results found for "{searchQuery}"</div>
                            </div>
                        )}
                    </div>

                    <div className="actions-section">
                        <a
                            href="https://frog.wigal.com.gh/login"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-get-started"
                        >
                            Get Started
                        </a>
                        <div style={{ width: '1px', height: '20px', background: 'var(--border-color)' }}></div>
                        <div className="theme-toggle" onClick={toggleTheme}>
                            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                        </div>
                    </div>
                </div>

                <div className="divider-line"></div>

                <div className="tabs-row">
                    {topTabs.map((tab) => (
                        <div
                            key={tab}
                            className={`tab-item ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab(tab);
                                const firstItem = sidebarGroups[tab]?.[0]?.items?.[0];
                                if (firstItem) {
                                    setActiveSidebarItem(typeof firstItem === 'object' ? firstItem.name : firstItem);
                                }
                            }}
                        >
                            {tab}
                        </div>
                    ))}
                </div>

                <div className="divider-line-full"></div>
            </nav>

            <div className="layout-container">
                <aside className="sidebar">
                    {sidebarContent.map((group, idx) => (
                        <div key={idx} className="nav-group">
                            <h3 className="nav-group-title">{group.title}</h3>
                            {group.items.map((item, i) => {
                                const isObject = typeof item === 'object';
                                const name = isObject ? item.name : item;
                                return (
                                    <div
                                        key={i}
                                        className={`sidebar-nav-item ${activeSidebarItem === name ? 'active' : ''}`}
                                        onClick={() => setActiveSidebarItem(name)}
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                    >
                                        {name}
                                        {isObject && item.hasChild && <ChevronRight size={14} opacity={0.5} />}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </aside>

                <div className="content-columns">
                    <main className="main-content">
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: 700 }}>{currentContent.title}</h1>
                        {currentContent.main}
                    </main>

                    {currentContent.right && (
                        <aside className="right-panel">
                            {currentContent.right}
                        </aside>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
