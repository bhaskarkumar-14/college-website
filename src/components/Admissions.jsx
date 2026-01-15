import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, Calendar, GraduationCap, ArrowRight } from 'lucide-react';

const Admissions = ({ theme }) => {
    return (
        <div className="section-padding" style={{ background: 'var(--bg-page)', minHeight: '100vh', paddingTop: '8rem' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: '4rem' }}
                >
                    <h2 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                        Join <span className="gradient-text">Future Engineers</span>
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                        Your journey to innovation starts here. Purnea College of Engineering offers a transparent and merit-based admission process.
                    </p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {/* Admission Process Card */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="glass"
                        style={{ padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border-color)' }}
                    >
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', width: 'fit-content', padding: '12px', borderRadius: '12px', marginBottom: '1.5rem', color: 'var(--accent)' }}>
                            <GraduationCap size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Admission Process</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                            Admission to the four-year B.Tech course is conducted through the <strong>Bihar Combined Entrance Competitive Examination (B.C.E.C.E.)</strong> and <strong>JEE Main</strong>.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {['Appear for JEE (Main) / BCECE', 'Check BCECE Board Rank List', 'Participate in Online Counseling', 'Seat Allotment & Document Verification'].map((item, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                                    <ArrowRight size={16} style={{ color: 'var(--accent)' }} />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Eligibility Criteria */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="glass"
                        style={{ padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border-color)' }}
                    >
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', width: 'fit-content', padding: '12px', borderRadius: '12px', marginBottom: '1.5rem', color: 'var(--accent)' }}>
                            <CheckCircle size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Eligibility</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                            Candidates must satisfy the following criteria to be eligible for admission:
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[
                                'Passed 10+2 with Physics, Mathematics, and Chemistry (PCM).',
                                'Minimum 45% marks (40% for reserved categories).',
                                'Valid scorecard from JEE Main or BCECE.',
                                'Domicile of Bihar (for state quota seats).'
                            ].map((item, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                                    <CheckCircle size={18} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '4px' }} />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Documents & Helpdesk */}
                <motion.div
                    initial={{ opacity: 0, marginTop: 40 }}
                    whileInView={{ opacity: 1, marginTop: 60 }}
                    className="glass"
                    style={{ padding: '3rem', borderRadius: '32px', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', md: 'row', gap: '2rem', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <FileText size={28} style={{ color: 'var(--accent)' }} />
                                <h3 style={{ fontSize: '1.75rem', color: 'var(--text-primary)' }}>Documents Required</h3>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                {[
                                    '10th & 12th Marksheets', 'Admit Card (JEE/BCECE)', 'Rank Card', 'Caste/Income Certificate',
                                    'Allotment Letter', 'Passport Size Photos', 'Aadhar Card', 'Migration Certificate'
                                ].map((doc, idx) => (
                                    <div key={idx} style={{
                                        padding: '0.75rem 1rem',
                                        background: 'var(--bg-page)',
                                        borderRadius: '8px',
                                        fontSize: '0.9rem',
                                        color: 'var(--text-secondary)',
                                        border: '1px solid var(--border-color)'
                                    }}>
                                        • {doc}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Need specific details?</p>
                        <a
                            href="https://bceceboard.bihar.gov.in/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'var(--accent)',
                                color: 'white',
                                padding: '12px 24px',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                fontWeight: 500
                            }}
                        >
                            Visit BCECE Board Website <ArrowRight size={18} />
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Admissions;
