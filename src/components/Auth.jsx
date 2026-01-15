import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Lock,
    User,
    ArrowRight,
    Building2,
    AlertCircle,
    Mail,
    BookOpen,
    ChevronLeft,
    GraduationCap
} from 'lucide-react';

const Auth = ({ onLogin, onBack }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loginAs, setLoginAs] = useState('Student'); // 'Student' or 'Faculty'

    const [formData, setFormData] = useState({
        fullName: '',
        studentId: '',
        facultyEmail: '',
        email: '',
        branch: 'CSE',
        session: '2025-29',
        password: '',
        confirmPassword: '',
        department: 'CSE',
        designation: 'Assistant Professor'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!isLogin && formData.password !== formData.confirmPassword) {
                throw new Error('Passwords do not match');
            }

            let endpoint = '';
            let payload = {};

            if (loginAs === 'Faculty') {
                endpoint = isLogin ? '/api/auth/faculty/login' : '/api/auth/faculty/register';
                payload = isLogin
                    ? { email: formData.facultyEmail, password: formData.password }
                    : {
                        fullName: formData.fullName,
                        email: formData.facultyEmail,
                        password: formData.password,
                        department: formData.department,
                        designation: formData.designation
                    };
            } else {
                endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
                payload = isLogin
                    ? { studentId: formData.studentId, password: formData.password }
                    : {
                        fullName: formData.fullName,
                        studentId: formData.studentId,
                        email: formData.email,
                        branch: formData.branch,
                        session: formData.session,
                        password: formData.password
                    };
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Authentication failed');
            }

            // Success
            localStorage.setItem('userInfo', JSON.stringify(data));
            const displayId = data.role === 'Faculty' ? data.fullName : data.studentId;
            onLogin(displayId, data.role || 'Student');

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="auth-container" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            background: 'var(--bg-page)',
            fontFamily: 'var(--font-body)',
            transition: 'background-color 0.3s ease'
        }}>
            {/* Animated Background Elements */}
            <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0 }}>
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        x: [0, 100, 0],
                        y: [0, 50, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{
                        position: 'absolute',
                        top: '-10%',
                        left: '10%',
                        width: '40vw',
                        height: '40vw',
                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
                        filter: 'blur(80px)',
                        borderRadius: '50%'
                    }}
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [0, -90, 0],
                        x: [0, -50, 0],
                        y: [0, 100, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    style={{
                        position: 'absolute',
                        bottom: '-10%',
                        right: '10%',
                        width: '35vw',
                        height: '35vw',
                        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
                        filter: 'blur(80px)',
                        borderRadius: '50%'
                    }}
                />
            </div>

            {/* Main Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="glass"
                style={{
                    width: '100%',
                    maxWidth: isLogin ? '480px' : '650px',
                    padding: '3.5rem',
                    background: 'var(--bg-card)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '32px',
                    zIndex: 1,
                    boxShadow: 'var(--shadow-lg)',
                    margin: '1.5rem',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                {/* Back Button */}
                <button
                    onClick={onBack}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        marginBottom: '2rem',
                        padding: 0,
                        transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                >
                    <ChevronLeft size={16} /> Backward to Home
                </button>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        background: 'var(--bg-section)',
                        padding: '5px',
                        borderRadius: '16px',
                        display: 'inline-flex',
                        gap: '5px',
                        border: '1px solid var(--border-color)',
                        marginBottom: '1.5rem'
                    }}>
                        {['Student', 'Faculty'].map((role) => (
                            <button
                                key={role}
                                onClick={() => { setLoginAs(role); setError(''); }}
                                style={{
                                    border: 'none',
                                    padding: '8px 24px',
                                    borderRadius: '12px',
                                    background: loginAs === role ? 'var(--bg-page)' : 'transparent',
                                    color: loginAs === role ? 'var(--text-primary)' : 'var(--text-muted)',
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    boxShadow: loginAs === role ? '0 2px 10px rgba(0,0,0,0.05)' : 'none',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {role} Portal
                            </button>
                        ))}
                    </div>

                    <h2 style={{ fontSize: '2.25rem', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '0.5rem' }}>
                        {loginAs === 'Student'
                            ? (isLogin ? 'Scholar Sign In' : 'Join Academic Community')
                            : (isLogin ? 'Faculty Access' : 'New Faculty Registration')}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                        {isLogin ? `Access your ${loginAs.toLowerCase()} dashboard` : 'Create your account today'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <AnimatePresence mode="wait">
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                            >
                                <div className="input-group">
                                    <label>Full Name</label>
                                    <div className="input-wrapper">
                                        <User className="icon" size={18} />
                                        <input
                                            type="text"
                                            name="fullName"
                                            placeholder="Bhaskar Jha"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            required={!isLogin}
                                            autoComplete="name"
                                        />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>Email Address</label>
                                    <div className="input-wrapper">
                                        <Mail className="icon" size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="scholar@purnea.edu"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required={!isLogin}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {loginAs === 'Student' ? (
                        <div className="input-group">
                            <label>Student ID</label>
                            <div className="input-wrapper">
                                <User className="icon" size={18} />
                                <input
                                    type="text"
                                    name="studentId"
                                    placeholder="PEC/CSE/22/XXX"
                                    value={formData.studentId}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="input-group">
                            <label>Faculty Email</label>
                            <div className="input-wrapper">
                                <Mail className="icon" size={18} />
                                <input
                                    type="email"
                                    name="facultyEmail"
                                    placeholder="faculty@pce.edu"
                                    value={formData.facultyEmail}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {!isLogin && loginAs === 'Student' && (
                        <>
                            <div className="input-group">
                                <label>Academic Branch</label>
                                <div className="input-wrapper">
                                    <BookOpen className="icon" size={18} />
                                    <select
                                        name="branch"
                                        value={formData.branch}
                                        onChange={handleInputChange}
                                        style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', borderRadius: '14px', background: 'var(--bg-section)', border: '1px solid var(--border-color)', color: 'var(--text-main)', appearance: 'none', outline: 'none' }}
                                    >
                                        <option value="CSE">Computer Science (CSE)</option>
                                        <option value="ECE">Electronics & Comm. (ECE)</option>
                                        <option value="ME">Mechanical Engg. (ME)</option>
                                        <option value="CE">Civil Engineering (CE)</option>
                                        <option value="EE">Electrical Engineering (EE)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Academic Session</label>
                                <div className="input-wrapper">
                                    <BookOpen className="icon" size={18} />
                                    <select
                                        name="session"
                                        value={formData.session}
                                        onChange={handleInputChange}
                                        style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', borderRadius: '14px', background: 'var(--bg-section)', border: '1px solid var(--border-color)', color: 'var(--text-main)', appearance: 'none', outline: 'none' }}
                                    >
                                        <option>2025-29</option>
                                        <option>2024-28</option>
                                        <option>2023-27</option>
                                        <option>2022-26</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    {!isLogin && loginAs === 'Faculty' && (
                        <div className="input-group">
                            <label>Department</label>
                            <div className="input-wrapper">
                                <Building2 className="icon" size={18} />
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', borderRadius: '14px', background: 'var(--bg-section)', border: '1px solid var(--border-color)', color: 'var(--text-main)', appearance: 'none', outline: 'none' }}
                                >
                                    <option value="CSE">Computer Science</option>
                                    <option value="ECE">Electronics (ECE)</option>
                                    <option value="ME">Mechanical (ME)</option>
                                    <option value="CE">Civil (CE)</option>
                                    <option value="EE">Electrical (EE)</option>
                                    <option value="ASH">Applied Science (ASH)</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="input-group">
                        <label>{isLogin ? 'Cipher Password' : 'New Password'}</label>
                        <div className="input-wrapper">
                            <Lock className="icon" size={18} />
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {!isLogin && (
                        <div className="input-group">
                            <label>Re-verify Password</label>
                            <div className="input-wrapper">
                                <Lock className="icon" size={18} />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required={!isLogin}
                                />
                            </div>
                        </div>
                    )}

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{
                                background: 'rgba(244, 63, 94, 0.1)',
                                color: '#f43f5e',
                                padding: '1rem',
                                borderRadius: '12px',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                border: '1px solid rgba(244, 63, 94, 0.2)'
                            }}
                        >
                            <AlertCircle size={18} />
                            {error}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-auth"
                        style={{
                            marginTop: '1.5rem',
                            width: '100%',
                            padding: '1.125rem',
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, var(--accent) 0%, #8b5cf6 100%)',
                            color: 'white',
                            border: 'none',
                            fontWeight: 700,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {loading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}
                            />
                        ) : (
                            <>
                                {isLogin ? 'Sign In Now' : 'Create My Account'}
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '2.5rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    {isLogin ? (
                        <>New scholar here? <span onClick={() => setIsLogin(false)} style={{ color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', marginLeft: '5px' }}>Register Account</span></>
                    ) : (
                        <>Already a member? <span onClick={() => setIsLogin(true)} style={{ color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', marginLeft: '5px' }}>Sign In Instead</span></>
                    )}
                </div>
            </motion.div>

            <style>{`
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .input-group label {
          color: var(--text-primary);
          font-weight: 600;
          font-size: 0.825rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .input-wrapper {
          position: relative;
        }
        .input-wrapper .icon {
          position: absolute;
          left: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          transition: color 0.3s ease;
        }
        .input-wrapper input {
          width: 100%;
          padding: 1rem 1.25rem 1rem 3.5rem;
          border-radius: 14px;
          background: var(--bg-section);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          font-size: 1rem;
          outline: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .input-wrapper input:focus {
          border-color: var(--accent);
          background: var(--bg-page);
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
        .input-wrapper input:focus + .icon {
          color: var(--accent);
        }
        .btn-auth:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -5px rgba(59, 130, 246, 0.5);
        }
        .btn-auth:active {
          transform: translateY(0);
        }
        .btn-auth:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>
        </div>
    );
};

export default Auth;
