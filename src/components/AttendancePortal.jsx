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
    AlertCircle,
    Timer,
    Award,
    Check,
    X,
    Lock,
    ArrowLeft,
    ArrowRight
} from 'lucide-react';
import AttendanceChart from './AttendanceChart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const AttendancePortal = ({ studentId = "PEC/CSE/22/045", onLogout }) => {
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'exams' | 'attempts'
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Exam states
    const [exams, setExams] = useState([]);
    const [examsLoading, setExamsLoading] = useState(false);
    const [activeExam, setActiveExam] = useState(null);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [examAnswers, setExamAnswers] = useState({}); // { qIndex: optIndex }
    const [examTimer, setExamTimer] = useState(0); // in seconds
    const [examSubmitted, setExamSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [noticeSearch, setNoticeSearch] = useState('');
    const [noticeCategory, setNoticeCategory] = useState('All');

    const getAuthHeader = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo?.token}`
        };
    };

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
            if (res.status === 401 || res.status === 404) {
                localStorage.removeItem('userInfo');
                if (onLogout) onLogout();
                return;
            }
            if (res.ok) {
                const data = await res.json();
                setDashboardData(data);
            } else {
                setError('Failed to load dashboard data');
            }
        } catch (err) {
            console.error("Fetch dashboard error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchExams = async () => {
        setExamsLoading(true);
        try {
            const res = await fetch('/api/auth/exams', {
                headers: getAuthHeader()
            });
            if (res.ok) {
                const data = await res.json();
                setExams(data);
            }
        } catch (err) {
            console.error("Fetch exams error:", err);
        } finally {
            setExamsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    useEffect(() => {
        if (activeTab === 'exams') {
            fetchExams();
        }
    }, [activeTab]);

    // Timer logic during exam
    useEffect(() => {
        let interval = null;
        if (activeExam && !examSubmitted && examTimer > 0) {
            interval = setInterval(() => {
                setExamTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        submitExam(true); // Auto-submit when timer hits zero
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [activeExam, examSubmitted, examTimer]);

    // Anti-cheat tab visibility change detector
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (activeExam && !examSubmitted && document.visibilityState === 'hidden') {
                alert("Anti-Cheat Warning: Tab change or application switch detected! Your test is being auto-submitted immediately.");
                submitExam(true);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [activeExam, examSubmitted, examAnswers]);

    const startQuiz = (exam) => {
        setActiveExam(exam);
        setActiveQuestionIndex(0);
        setExamAnswers({});
        setExamTimer(exam.duration);
        setExamSubmitted(false);
        setScore(0);
    };

    const submitExam = async (auto = false) => {
        if (examSubmitted) return;
        setSubmitLoading(true);

        // Grade exam: skip unattempted questions
        let finalScore = 0;
        let attemptedCount = 0;
        activeExam.questions.forEach((q, idx) => {
            const userAns = examAnswers[idx];
            if (userAns !== undefined) {
                attemptedCount++;
                const correctIdx = q.correct !== undefined ? q.correct : q.correctOption;
                if (userAns === correctIdx) {
                    finalScore++;
                }
            }
        });

        setScore(finalScore);
        setExamSubmitted(true);

        const timeTaken = activeExam.duration - examTimer;

        // Save attempt to backend
        try {
            await fetch('/api/auth/exams/submit', {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify({
                    examId: activeExam._id,
                    examTitle: activeExam.title,
                    score: finalScore,
                    totalQuestions: activeExam.questions.length,
                    timeTaken,
                    attemptedCount
                })
            });
            // Refresh dashboard data to include new attempts
            fetchDashboard();
        } catch (err) {
            console.error("Save attempt error:", err);
        } finally {
            setSubmitLoading(false);
        }
    };

    const formatTime = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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

    const subjects = (dashboardData?.academicAttendance || []).map(sub => ({
        name: sub.subjectName || 'Unknown Subject',
        subjectName: sub.subjectName || 'Unknown Subject',
        attended: sub.attendedLectures || 0,
        total: sub.totalLectures || 0,
        color: sub.subjectName?.includes('Architecture') ? '#3b82f6' : sub.subjectName?.includes('Cryptography') ? '#10b981' : '#f43f5e',
        icon: <BookOpen size={18} />
    }));

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
            {/* Distraction-Free Locked Exam Overlay */}
            {activeExam && !examSubmitted && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'var(--bg-page)',
                    zIndex: 99999,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '2rem 1.5rem',
                    overflowY: 'auto'
                }}>
                    <div className="glass" style={{ width: '100%', maxWidth: '800px', padding: '2.5rem', borderRadius: '28px', border: '1px solid var(--border-color)', marginTop: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '2rem' }}>
                            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.4rem', margin: 0 }}>{activeExam.title}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(59, 130, 246, 0.1)', padding: '8px 16px', borderRadius: '12px', color: 'var(--accent)', fontWeight: 700 }}>
                                <Timer size={18} />
                                <span>{formatTime(examTimer)}</span>
                            </div>
                        </div>

                        <div>
                            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                                <span>Question {activeQuestionIndex + 1} of {activeExam.questions.length}</span>
                                <span>Practice Exam</span>
                            </div>

                            <h4 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                                {activeExam.questions[activeQuestionIndex].question || activeExam.questions[activeQuestionIndex].questionText}
                            </h4>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                                {activeExam.questions[activeQuestionIndex].options.map((option, optIdx) => {
                                    const isSelected = examAnswers[activeQuestionIndex] === optIdx;
                                    return (
                                        <div
                                            key={optIdx}
                                            onClick={() => setExamAnswers({ ...examAnswers, [activeQuestionIndex]: optIdx })}
                                            style={{
                                                padding: '1.25rem',
                                                borderRadius: '12px',
                                                border: `1.5px solid ${isSelected ? 'var(--accent)' : 'var(--border-color)'}`,
                                                background: isSelected ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-page)',
                                                color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
                                                cursor: 'pointer',
                                                fontWeight: isSelected ? 600 : 500,
                                                transition: 'all 0.2s ease',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <span>{option}</span>
                                            <div style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                border: '2px solid var(--border-color)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {isSelected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent)' }}></div>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <button
                                    onClick={() => setActiveQuestionIndex(p => Math.max(0, p - 1))}
                                    disabled={activeQuestionIndex === 0}
                                    className="btn-primary"
                                    style={{ background: 'var(--bg-section)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', opacity: activeQuestionIndex === 0 ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <ArrowLeft size={16} /> Prev
                                </button>
                                {activeQuestionIndex === activeExam.questions.length - 1 ? (
                                    <button
                                        onClick={() => {
                                            if (window.confirm("Are you sure you want to submit the exam?")) {
                                                submitExam();
                                            }
                                        }}
                                        className="btn-primary"
                                        style={{ background: '#10b981', color: 'white' }}
                                    >
                                        Submit Exam
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setActiveQuestionIndex(p => p + 1)}
                                        className="btn-primary"
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                    >
                                        Next <ArrowRight size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="blob-bg">
                <div className="blob" style={{ top: '-10%', right: '-10%', background: 'var(--accent)', width: '600px', height: '600px', opacity: 0.1 }}></div>
                <div className="blob" style={{ bottom: '-10%', left: '-10%', background: 'var(--accent-secondary)', width: '500px', height: '500px', opacity: 0.1, animationDelay: '2s' }}></div>
            </div>

            <div className="container">
                <div className="dashboard-header-flex">
                    <div>
                        <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)' }}>Student Attendance <span className="gradient-text">Dashboard</span></h2>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Welcome back, <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{dashboardData?.profile?.fullName || studentId}</span></p>
                    </div>
                    <button
                        onClick={onLogout}
                        className="glass"
                        style={{ padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border-color)', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600 }}
                    >
                        Sign Out
                    </button>
                </div>

                {/* Tab Navigation Menu */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
                    {['overview', 'exams', 'attempts'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '12px',
                                border: 'none',
                                background: activeTab === tab ? 'var(--accent)' : 'var(--bg-page)',
                                color: activeTab === tab ? 'white' : 'var(--text-muted)',
                                cursor: 'pointer',
                                fontWeight: 600,
                                textTransform: 'capitalize',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {tab === 'overview' ? 'Overview' : tab === 'exams' ? 'Exam Center' : 'Attempt History'}
                        </button>
                    ))}
                </div>

                <div className="dashboard-layout-grid">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        <AnimatePresence mode="wait">
                            {activeTab === 'overview' && (
                                <motion.div
                                    key="overview"
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 15 }}
                                    transition={{ duration: 0.25 }}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
                                >
                                    {/* Overall Attendance Metrics & Info */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                        <div className="glass" style={{ padding: '1.5rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Enrolled Program</span>
                                            <h4 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', margin: '0.25rem 0 0', fontWeight: 800 }}>B.Tech ({dashboardData?.profile?.branch || 'CSE'})</h4>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Session 2022-26</span>
                                        </div>

                                        {(() => {
                                            const totalAttended = (dashboardData?.academicAttendance || []).reduce((acc, sub) => acc + (sub.attendedLectures || 0), 0);
                                            const totalLectures = (dashboardData?.academicAttendance || []).reduce((acc, sub) => acc + (sub.totalLectures || 0), 0);
                                            const overall = totalLectures > 0 ? Math.round((totalAttended / totalLectures) * 100) : 100;
                                            const standing = overall >= 75 ? 'Good Standing' : overall >= 60 ? 'Warning Zone' : 'Critical Alert';
                                            const standingColor = overall >= 75 ? '#10b981' : overall >= 60 ? '#f59e0b' : '#f43f5e';
                                            
                                            return (
                                                <>
                                                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Overall Attendance</span>
                                                        <h4 style={{ fontSize: '1.65rem', color: standingColor, margin: '0.25rem 0 0', fontWeight: 800 }}>{overall}%</h4>
                                                        <span style={{ fontSize: '0.75rem', color: standingColor, fontWeight: 700, marginTop: '4px' }}>● {standing}</span>
                                                    </div>
                                                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Lectures Attended</span>
                                                        <h4 style={{ fontSize: '1.45rem', color: 'var(--text-primary)', margin: '0.25rem 0 0', fontWeight: 800 }}>{totalAttended} / {totalLectures}</h4>
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Across all courses</span>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>

                                    <AttendanceChart data={subjects} />

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                        {subjects.map((sub, idx) => {
                                            const percentage = sub.total > 0 ? ((sub.attended / sub.total) * 100).toFixed(1) : 0;
                                            const isWarning = sub.total > 0 && (sub.attended / sub.total) < 0.75;

                                            return (
                                                <motion.div
                                                    key={idx}
                                                    whileHover={{ y: -5 }}
                                                    className="glass"
                                                    style={{ padding: '1.75rem', position: 'relative', borderLeft: `4px solid ${sub.color}` }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                                                        <div>
                                                            <h5 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>{sub.subjectName}</h5>
                                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>L-T-P: 3-1-0</span>
                                                        </div>
                                                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: sub.color }}>{percentage}%</span>
                                                    </div>

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
                                </motion.div>
                            )}

                            {activeTab === 'exams' && (
                                <motion.div
                                    key="exams"
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 15 }}
                                    transition={{ duration: 0.25 }}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
                                >
                                    <div className="glass" style={{ padding: '2.5rem', borderRadius: '28px' }}>
                                        {!activeExam || examSubmitted ? (
                                            <>
                                                <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <Award color="var(--accent)" /> Available Practice Examinations
                                                </h3>
                                                <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Test your academic knowledge with real-time timers and multiple-choice questions.</p>
                                                
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                                    {examsLoading ? (
                                                        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', textAlign: 'center', padding: '2rem' }}>Loading exams...</p>
                                                    ) : exams.length === 0 ? (
                                                        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', textAlign: 'center', padding: '2rem' }}>No practice exams currently available for your branch.</p>
                                                    ) : (
                                                        exams.map(exam => (
                                                            <div key={exam._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-page)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                                                                <div>
                                                                    <h4 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '4px' }}>{exam.title}</h4>
                                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                                        {exam.questions.length} Questions • {exam.duration / 60} Minutes
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    onClick={() => startQuiz(exam)}
                                                                    className="btn-primary"
                                                                    style={{ padding: '10px 24px', borderRadius: '10px' }}
                                                                >
                                                                    Start Exam
                                                                </button>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </>
                                        ) : null}

                                        {examSubmitted && activeExam && (
                                            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
                                                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                                                    <h3 style={{ color: 'var(--text-primary)', fontSize: '2.2rem', marginBottom: '0.5rem', fontWeight: 800 }}>Practice Exam Results</h3>
                                                    <p style={{ color: 'var(--text-muted)' }}>Review your detailed scorecard and answers explanations</p>
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
                                                    <div style={{ background: 'var(--bg-page)', padding: '1.25rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Score</p>
                                                        <h3 style={{ fontSize: '1.75rem', color: '#10b981', marginTop: '0.25rem', marginBottom: 0, fontWeight: 800 }}>
                                                            {score} / {activeExam.questions.length}
                                                        </h3>
                                                    </div>
                                                    <div style={{ background: 'var(--bg-page)', padding: '1.25rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Attempted</p>
                                                        <h3 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', marginTop: '0.25rem', marginBottom: 0, fontWeight: 800 }}>
                                                            {Object.keys(examAnswers).length}
                                                        </h3>
                                                    </div>
                                                    <div style={{ background: 'var(--bg-page)', padding: '1.25rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Time Taken</p>
                                                        <h3 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', marginTop: '0.25rem', marginBottom: 0, fontWeight: 800 }}>
                                                            {formatTime(activeExam.duration - examTimer)}
                                                        </h3>
                                                    </div>
                                                    <div style={{ background: 'var(--bg-page)', padding: '1.25rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Avg Time/Q</p>
                                                        <h3 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', marginTop: '0.25rem', marginBottom: 0, fontWeight: 800 }}>
                                                            {((activeExam.duration - examTimer) / (Object.keys(examAnswers).length || 1)).toFixed(1)}s
                                                        </h3>
                                                    </div>
                                                </div>

                                                <h4 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontWeight: 700 }}>Question Log & Review</h4>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                                                    {activeExam.questions.map((q, idx) => {
                                                        const yourAns = examAnswers[idx];
                                                        const correctIdx = q.correct !== undefined ? q.correct : q.correctOption;
                                                        const isCorrect = yourAns === correctIdx;

                                                        return (
                                                            <div key={idx} style={{ background: 'var(--bg-page)', padding: '1.5rem', borderRadius: '16px', border: `1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}` }}>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                                                    <h5 style={{ color: 'var(--text-primary)', fontSize: '1.05rem', margin: 0, flex: 1, paddingRight: '1rem', fontWeight: 600 }}>
                                                                        Q{idx + 1}. {q.question || q.questionText}
                                                                    </h5>
                                                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isCorrect ? '#10b981' : '#f43f5e' }}>
                                                                        {isCorrect ? 'Correct (+1)' : 'Incorrect / Unattempted (0)'}
                                                                    </span>
                                                                </div>
                                                                <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1.25rem' }}>
                                                                    {q.options.map((opt, optIdx) => {
                                                                        const isSelected = optIdx === yourAns;
                                                                        const isCorrectOpt = optIdx === correctIdx;
                                                                        let bg = 'var(--bg-section)';
                                                                        let border = '1px solid var(--border-color)';
                                                                        let color = 'var(--text-main)';

                                                                        if (isCorrectOpt) {
                                                                            bg = 'rgba(16, 185, 129, 0.1)';
                                                                            border = '1px solid #10b981';
                                                                            color = '#10b981';
                                                                        } else if (isSelected && !isCorrect) {
                                                                            bg = 'rgba(244, 63, 94, 0.1)';
                                                                            border = '1px solid #f43f5e';
                                                                            color = '#f43f5e';
                                                                        }

                                                                        return (
                                                                            <div key={optIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', borderRadius: '8px', background: bg, border: border, color: color, fontSize: '0.9rem' }}>
                                                                                <span>{opt}</span>
                                                                                {isCorrectOpt && <Check size={16} color="#10b981" />}
                                                                                {isSelected && !isCorrect && <X size={16} color="#f43f5e" />}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                                <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--accent)' }}>
                                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                                                                        <strong style={{ color: 'var(--text-primary)' }}>Explanation:</strong> {q.explanation}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                <button
                                                    onClick={() => setActiveExam(null)}
                                                    className="btn-primary"
                                                    style={{ width: '100%', padding: '12px' }}
                                                >
                                                    Back to Practice Exams
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'attempts' && (
                                <motion.div
                                    key="attempts"
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 15 }}
                                    transition={{ duration: 0.25 }}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
                                >
                                    <div className="glass" style={{ padding: '2.5rem', borderRadius: '28px' }}>
                                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Award color="var(--accent)" /> Practice Exam Attempt History
                                        </h3>
                                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Track all your past exam scores and matching timing logs.</p>

                                        {(() => {
                                            const chartAttempts = (dashboardData?.examAttempts || []).map((att, idx) => ({
                                                attemptNum: `#${idx + 1}`,
                                                scorePercentage: att.totalQuestions > 0 ? Math.round((att.score / att.totalQuestions) * 100) : 0,
                                                title: att.examTitle
                                            }));

                                            const CustomAttemptTooltip = ({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    return (
                                                        <div className="glass" style={{ padding: '10px 15px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
                                                            <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px', margin: 0 }}>{data.title}</p>
                                                            <p style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.9rem', margin: '4px 0 0 0' }}>Accuracy: {payload[0].value}%</p>
                                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: '2px 0 0 0' }}>Attempt {data.attemptNum}</p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            };

                                            return chartAttempts.length >= 2 ? (
                                                <div style={{ background: 'var(--bg-page)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border-color)', marginBottom: '2.5rem', height: '220px' }}>
                                                    <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '1rem', fontWeight: 600 }}>Score Progression Trend (%)</h4>
                                                    <ResponsiveContainer width="100%" height="80%">
                                                        <LineChart data={chartAttempts}>
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.3} />
                                                            <XAxis dataKey="attemptNum" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} />
                                                            <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} />
                                                            <RechartsTooltip content={<CustomAttemptTooltip />} />
                                                            <Line type="monotone" dataKey="scorePercentage" stroke="var(--accent)" strokeWidth={3} dot={{ fill: 'var(--accent)', r: 4 }} activeDot={{ r: 6 }} />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            ) : null;
                                        })()}

                                        <div style={{ display: 'grid', gap: '1rem' }}>
                                            {dashboardData?.examAttempts && dashboardData.examAttempts.length > 0 ? (
                                                [...dashboardData.examAttempts].reverse().map((attempt, idx) => (
                                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-page)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                                                        <div>
                                                            <h5 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '4px', fontWeight: 600 }}>{attempt.examTitle}</h5>
                                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                                                                Taken on: {new Date(attempt.submittedAt).toLocaleString()} • Duration: {formatTime(attempt.timeTaken)}
                                                            </p>
                                                        </div>
                                                        <div style={{ textAlign: 'right' }}>
                                                            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent)' }}>
                                                                {attempt.score} / {attempt.totalQuestions}
                                                            </div>
                                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                                {((attempt.score / attempt.totalQuestions) * 100).toFixed(1)}% Accuracy
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', textAlign: 'center', padding: '2rem' }}>No past exams completed yet.</p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        <div className="glass" style={{ padding: '2rem', borderRadius: '32px' }}>
                            <h4 style={{ color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <AlertCircle size={20} color="var(--accent)" /> Important Notices
                            </h4>

                            {/* Filter and search controls */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <input
                                    type="text"
                                    placeholder="Search notices..."
                                    value={noticeSearch}
                                    onChange={e => setNoticeSearch(e.target.value)}
                                    style={{ padding: '8px 12px', borderRadius: '10px', background: 'var(--bg-page)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                                />
                                <select
                                    value={noticeCategory}
                                    onChange={e => setNoticeCategory(e.target.value)}
                                    style={{ padding: '8px 12px', borderRadius: '10px', background: 'var(--bg-page)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                                >
                                    <option value="All">All Categories</option>
                                    <option value="General">General</option>
                                    <option value="Exam">Exam</option>
                                    <option value="Event">Event</option>
                                    <option value="Urgent">Urgent</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {(() => {
                                    const filtered = (dashboardData?.announcements || []).filter(ann => {
                                        const matchesCategory = noticeCategory === 'All' || ann.type === noticeCategory;
                                        const matchesSearch = ann.title.toLowerCase().includes(noticeSearch.toLowerCase()) || 
                                                              ann.message.toLowerCase().includes(noticeSearch.toLowerCase());
                                        return matchesCategory && matchesSearch;
                                    });

                                    return filtered.length > 0 ? (
                                        filtered.map((ann, idx) => (
                                            <div key={idx} style={{ padding: '15px', background: 'var(--bg-page)', borderRadius: '16px', borderLeft: `4px solid ${ann.type === 'Urgent' ? '#f43f5e' : 'var(--accent)'}` }}>
                                                <h5 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '5px', fontWeight: 600 }}>{ann.title}</h5>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>{ann.message}</p>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block', fontWeight: 600 }}>
                                                    {new Date(ann.date).toLocaleDateString()} • <span style={{ color: 'var(--accent)' }}>{ann.type}</span>
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>No matching announcements</p>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendancePortal;
