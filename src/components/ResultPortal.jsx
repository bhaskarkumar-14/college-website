import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

const ResultPortal = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const query = encodeURIComponent(searchQuery.trim());
            const response = await fetch(`/api/results?rollNo=${query}`);

            // Specific handling for 404s to give a better user experience than a generic error
            if (!response.ok) {
                const message = response.status === 404
                    ? 'No result found for this Roll Number. Please check and try again.'
                    : 'Failed to fetch result. Please try again later.';
                throw new Error(message);
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            padding: '8rem 2rem 4rem',
            minHeight: '100vh',
            background: 'var(--bg-section)',
            color: 'var(--text-main)'
        }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                        University <span className="gradient-text">Examination Results</span>
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>Provisional Marksheet Portal for Session 2024-25</p>
                </div>

                <div style={{ maxWidth: '600px', margin: '0 auto 4rem' }}>
                    <form onSubmit={handleSearch} className="glass" style={{ padding: '10px', borderRadius: '50px', display: 'flex', alignItems: 'center' }}>
                        <div style={{ padding: '0 1.5rem', color: 'var(--text-muted)' }}>
                            <Search size={24} />
                        </div>
                        <input
                            type="text"
                            placeholder="Enter Roll Number (e.g., PEC/CSE/22/045)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                flex: 1,
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-primary)',
                                fontSize: '1.1rem',
                                outline: 'none',
                                padding: '10px'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                background: 'var(--accent)',
                                color: 'white',
                                border: 'none',
                                padding: '12px 30px',
                                borderRadius: '40px',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: loading ? 'wait' : 'pointer',
                                transition: 'transform 0.2s'
                            }}
                        >
                            {loading ? 'Searching...' : 'Check Result'}
                        </button>
                    </form>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ marginTop: '1rem', color: '#f43f5e', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                            <AlertCircle size={18} /> {error}
                        </motion.div>
                    )}
                </div>

                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass"
                            style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem', borderRadius: '24px' }}
                        >
                            <div style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{result.name}</h3>
                                    <p style={{ color: 'var(--text-muted)' }}>Roll No: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{result.rollNo}</span></p>
                                    <p style={{ color: 'var(--text-muted)' }}>{result.course} | {result.semester}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        color: '#10b981',
                                        padding: '8px 16px',
                                        borderRadius: '20px',
                                        fontWeight: 700,
                                        marginBottom: '10px'
                                    }}>
                                        <CheckCircle size={18} /> {result.status}
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Result Declared on {result.date}</p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                                <div style={{ background: 'var(--bg-page)', padding: '1.5rem', borderRadius: '16px', textAlign: 'center' }}>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Semester Grade Point Average (SGPA)</p>
                                    <h2 style={{ fontSize: '3rem', color: 'var(--accent)' }}>{result.sgpa}</h2>
                                </div>
                                <div style={{ background: 'var(--bg-page)', padding: '1.5rem', borderRadius: '16px', textAlign: 'center' }}>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Cumulative Grade Point Average (CGPA)</p>
                                    <h2 style={{ fontSize: '3rem', color: 'var(--text-primary)' }}>{result.cgpa}</h2>
                                </div>
                            </div>

                            <h4 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <BookOpen size={20} color="var(--accent)" /> Detailed Marksheet
                            </h4>
                            <div style={{ overflowX: 'auto', marginBottom: '3rem' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-primary)' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                                            <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Subject Code</th>
                                            <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Subject Name</th>
                                            <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Credits</th>
                                            <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Grade</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.subjects.map((sub, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <td style={{ padding: '15px 12px', fontWeight: 600 }}>{sub.code}</td>
                                                <td style={{ padding: '15px 12px' }}>{sub.name}</td>
                                                <td style={{ padding: '15px 12px' }}>{sub.credits}</td>
                                                <td style={{ padding: '15px 12px', fontWeight: 700, color: ['O', 'A+'].includes(sub.grade) ? '#10b981' : 'var(--text-primary)' }}>
                                                    {sub.grade}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>* This is a computer-generated document.</p>
                                <button style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    background: 'var(--text-primary)',
                                    color: 'var(--bg-page)',
                                    padding: '12px 24px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}>
                                    <Download size={18} /> Download Marksheet
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ResultPortal;
