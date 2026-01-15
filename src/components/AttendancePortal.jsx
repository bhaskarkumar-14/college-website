import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Fingerprint,
    ScanFace,
    Camera,
    CheckCircle,
    BookOpen,
    Cpu,
    Zap,
    Settings,
    Building2,
    Users,
    AlertCircle
} from 'lucide-react';
import AttendanceChart from './AttendanceChart';

const AttendancePortal = ({ studentId = "PEC/CSE/22/045" }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState('CSE');

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const branches = [
        { id: 'CE', name: 'Civil', icon: <Building2 size={14} /> },
        { id: 'ME', name: 'Mechanical', icon: <Settings size={14} /> },
        { id: 'EE', name: 'Electrical', icon: <Zap size={14} /> },
        { id: 'ECE', name: 'ECE', icon: <Zap size={14} /> },
        { id: 'CSE', name: 'CSE (General)', icon: <BookOpen size={14} /> },
        { id: 'CSE-AI', name: 'CSE (AI)', icon: <Cpu size={14} /> },
        { id: 'MT', name: 'Mechatronics', icon: <Cpu size={14} /> },
    ];

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

                if (!userInfo.token) {
                    setLoading(false);
                    return;
                }

                const res = await fetch('/api/auth/dashboard', {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });

                if (res.ok) {
                    const data = await res.json();
                    setDashboardData(data);
                    if (data?.profile?.branch && data.profile.branch.includes('CSE')) {
                        setSelectedBranch('CSE');
                    }
                } else {
                    console.error('Dashboard fetch failed:', res.status);
                    setError('Failed to load dashboard data');
                }
            } catch (error) {
                console.error("Failed to fetch dashboard:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    // Transform backend academic attendance data into a format suitable for the chart and display cards
    // Defaults to 0 if data is missing to prevent crashes
    const subjects = (dashboardData?.academicAttendance || []).map(sub => ({
        name: sub.subjectName || 'Unknown Subject',
        attended: sub.attendedLectures || 0,
        total: sub.totalLectures || 0,
        color: 'linear-gradient(90deg, #3b82f6, #2dd4bf)',
        icon: <BookOpen size={18} />
    }));

    const handleScan = async () => {
        if (isScanning || isSuccess) return;
        setIsScanning(true);

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

            if (!userInfo.token) {
                alert("Authentication error: Please login again.");
                setIsScanning(false);
                return;
            }

            // Simulate a biometric scan by sending a request to the backend
            // In a real app, this would interface with a hardware scanner or camera API
            const res = await fetch('/api/auth/mark-attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify({ deviceId: 'WEB-PORTAL-SCANNER' })
            });

            const data = await res.json();

            if (res.ok) {
                if (data.log) {
                    setDashboardData(prev => ({
                        ...prev,
                        biometricLogs: [data.log, ...(prev?.biometricLogs || [])]
                    }));
                }

                setTimeout(() => {
                    setIsScanning(false);
                    setIsSuccess(true);
                }, 1500);
            } else {
                alert(data.message || 'Scan failed');
                setIsScanning(false);
            }
        } catch (err) {
            console.error("Scan Error:", err);
            alert("Network error during scan");
            setIsScanning(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-primary)' }}>
                <h3>Loading Dashboard...</h3>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#f43f5e' }}>
                <AlertCircle size={48} />
                <h3 style={{ marginTop: '1rem' }}>Unable to load dashboard</h3>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="attendance-portal" style={{
            padding: '8rem 2rem 4rem',
            background: 'var(--bg-section)',
            minHeight: '100vh',
            color: 'var(--text-main)',
            transition: 'background-color 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div className="blob-bg">
                <div className="blob" style={{ top: '-10%', right: '-10%', background: 'var(--accent)', width: '600px', height: '600px', opacity: 0.1 }}></div>
                <div className="blob" style={{ bottom: '-10%', left: '-10%', background: 'var(--accent-secondary)', width: '500px', height: '500px', opacity: 0.1, animationDelay: '2s' }}></div>
            </div>
            <div className="container">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '3rem'
                }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)' }}>Student Attendance <span className="gradient-text">Dashboard</span></h2>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Welcome back, <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{dashboardData?.profile?.fullName || studentId}</span></p>
                    </div>
                    <div className="glass" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', borderRadius: '12px' }}>
                        <Users size={18} color="var(--accent)" />
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Session 2024-25</span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '2.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

                        <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
                            <h4 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Active Department Programs</h4>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {branches.map((branch) => (
                                    <motion.button
                                        key={branch.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedBranch(branch.id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            padding: '12px 20px',
                                            borderRadius: '14px',
                                            border: '1px solid var(--border-color)',
                                            cursor: 'pointer',
                                            background: selectedBranch === branch.id ? 'var(--accent)' : 'var(--bg-page)',
                                            color: selectedBranch === branch.id ? 'white' : 'var(--text-muted)',
                                            fontWeight: 600,
                                            fontSize: '0.9rem',
                                            transition: 'all 0.3s ease',
                                            boxShadow: selectedBranch === branch.id ? '0 8px 20px -5px var(--accent)' : 'none'
                                        }}
                                    >
                                        {branch.icon}
                                        {branch.name}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        <AttendanceChart data={subjects} />

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                            {subjects.map((sub, idx) => {
                                const percentage = sub.total > 0 ? Math.round((sub.attended / sub.total) * 100) : 0;
                                const isWarning = percentage < 75;

                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        whileHover={{ y: -8 }}
                                        className="glass"
                                        style={{
                                            padding: '2rem',
                                            borderRadius: '28px',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                            <div style={{
                                                background: 'rgba(59, 130, 246, 0.1)',
                                                color: 'var(--accent)',
                                                padding: '12px',
                                                borderRadius: '16px'
                                            }}>
                                                {sub.icon}
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <h3 style={{ fontSize: '2rem', color: isWarning ? '#f43f5e' : 'var(--text-primary)', lineHeight: 1 }}>{percentage}%</h3>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginTop: '4px' }}>Accuracy</p>
                                            </div>
                                        </div>

                                        <h5 style={{ fontSize: '1.15rem', marginBottom: '1.5rem', color: 'var(--text-primary)', minHeight: '3.5rem' }}>{sub.name}</h5>

                                        <div style={{ height: '10px', background: 'var(--bg-section)', borderRadius: '5px', overflow: 'hidden', marginBottom: '1rem' }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                style={{ height: '100%', background: sub.color, borderRadius: '5px' }}
                                            />
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                Lectures: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{sub.attended}</span> / {sub.total}
                                            </span>
                                            {isWarning && (
                                                <div style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <AlertCircle size={12} /> Low Attendance
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

                        <div className="glass" style={{ padding: '2rem', borderRadius: '32px' }}>
                            <h4 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <AlertCircle size={20} color="var(--accent)" />
                                Important Notices
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {(dashboardData?.announcements || []).length > 0 ? (
                                    dashboardData.announcements.map((ann, idx) => (
                                        <div key={idx} style={{ padding: '15px', background: 'var(--bg-page)', borderRadius: '16px', borderLeft: '4px solid var(--accent)' }}>
                                            <h5 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '5px' }}>{ann.title}</h5>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{ann.message}</p>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block', fontWeight: 600 }}>
                                                {new Date(ann.date).toLocaleDateString()} • <span style={{ color: 'var(--accent)' }}>{ann.type}</span>
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>No recent announcements</p>
                                )}
                            </div>
                        </div>

                        <div className="glass" style={{ padding: '3rem 2rem', borderRadius: '32px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '2.5rem' }}>
                                <Camera size={20} color="var(--accent)" />
                                <h4 style={{ color: 'var(--text-primary)', margin: 0 }}>Face Verification</h4>
                            </div>

                            <div
                                onClick={handleScan}
                                style={{
                                    width: '220px',
                                    height: '220px',
                                    margin: '0 auto 2.5rem',
                                    borderRadius: '30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: (isScanning || isSuccess) ? 'default' : 'pointer',
                                    position: 'relative',
                                    background: 'var(--bg-page)',
                                    border: `1px solid ${isSuccess ? '#10b981' : 'var(--border-color)'}`,
                                    boxShadow: isScanning ? '0 0 40px -10px var(--accent)' : 'none',
                                    transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
                                    overflow: 'hidden'
                                }}
                            >
                                <div style={{ position: 'absolute', top: 15, left: 15, width: 30, height: 30, borderTop: '3px solid var(--accent)', borderLeft: '3px solid var(--accent)', opacity: 0.6 }}></div>
                                <div style={{ position: 'absolute', top: 15, right: 15, width: 30, height: 30, borderTop: '3px solid var(--accent)', borderRight: '3px solid var(--accent)', opacity: 0.6 }}></div>
                                <div style={{ position: 'absolute', bottom: 15, left: 15, width: 30, height: 30, borderBottom: '3px solid var(--accent)', borderLeft: '3px solid var(--accent)', opacity: 0.6 }}></div>
                                <div style={{ position: 'absolute', bottom: 15, right: 15, width: 30, height: 30, borderBottom: '3px solid var(--accent)', borderRight: '3px solid var(--accent)', opacity: 0.6 }}></div>

                                <AnimatePresence mode="wait">
                                    {isScanning ? (
                                        <motion.div
                                            key="scanning"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            style={{ width: '100%', height: '100%', position: 'relative' }}
                                        >
                                            <div style={{ width: '100%', height: '100%', background: 'var(--accent)', opacity: 0.1 }}></div>

                                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <ScanFace size={80} color="var(--accent)" />
                                            </div>

                                            <motion.div
                                                animate={{ top: ['10%', '90%', '10%'] }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                                style={{
                                                    position: 'absolute',
                                                    left: '10%',
                                                    width: '80%',
                                                    height: '2px',
                                                    background: '#10b981',
                                                    boxShadow: '0 0 15px #10b981, 0 0 30px #10b981'
                                                }}
                                            />

                                            <motion.p
                                                animate={{ opacity: [0.5, 1, 0.5] }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                                style={{ position: 'absolute', bottom: 40, width: '100%', textAlign: 'center', fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600 }}
                                            >
                                                Aligning Face...
                                            </motion.p>
                                        </motion.div>
                                    ) : isSuccess ? (
                                        <motion.div
                                            key="success"
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            style={{ textAlign: 'center' }}
                                        >
                                            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '20px', borderRadius: '50%' }}>
                                                <CheckCircle size={60} color="#10b981" />
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="idle" style={{ opacity: 0.5 }}>
                                            <ScanFace size={80} color="var(--text-muted)" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div style={{ minHeight: '5rem' }}>
                                <h5 style={{
                                    fontSize: '1.25rem',
                                    color: isSuccess ? '#10b981' : 'var(--text-primary)',
                                    marginBottom: '0.5rem',
                                    fontWeight: 700
                                }}>
                                    {isScanning ? 'Identifying...' : isSuccess ? 'Identity Verified' : 'Tap to Scan Face'}
                                </h5>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                    {isScanning ? 'Please look directly at the camera' : isSuccess ? 'Biometric match confirm. Attendance recorded.' : 'Secure Face ID verification required for attendance'}
                                </p>
                            </div>
                        </div>

                        <div className="glass" style={{ padding: '2rem', borderRadius: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h4 style={{ color: 'var(--text-primary)' }}>Terminal Log</h4>
                                <div style={{ background: 'var(--accent)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', color: 'white', fontWeight: 600 }}>LIVE</div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {(dashboardData?.biometricLogs || []).map((log, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                                        <div style={{ background: 'var(--bg-section)', padding: '10px', borderRadius: '12px', color: 'var(--text-muted)' }}>
                                            <ScanFace size={14} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Face ID Verified</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{new Date(log.timestamp).toLocaleTimeString()}</p>
                                        </div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>{log.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button style={{
                            width: '100%',
                            marginTop: '2.5rem',
                            padding: '1rem',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}>View Academic Report</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendancePortal;
