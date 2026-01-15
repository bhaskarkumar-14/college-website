import React from 'react';

const Footer = () => {
    return (
        <footer style={{ background: 'var(--bg-section)', borderTop: '1px solid var(--border-color)', padding: '4rem 0' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.2fr 1fr', gap: '4rem' }}>
                    <div>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Purnia College of Engineering</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            Affiliated to Bihar Engineering University, Patna.<br />
                            Near Ram Nagar, Purnea, Bihar - 854301.<br />
                            Established by Govt. of Bihar in 2017.
                        </p>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</a></li>
                            <li><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</a></li>
                            <li><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Affiliation Details</a></li>
                            <li><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>DST Bihar</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Branches</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-muted)' }}>
                            <li>Civil, Mechanical, Electrical</li>
                            <li>Electronics & Comm.</li>
                            <li>CSE & CSE (AI)</li>
                            <li>Mechatronics</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Connect</h4>
                        <div style={{ marginTop: '0.5rem' }}>
                            <p style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Email Principal:</p>
                            <p style={{ color: 'var(--text-muted)' }}>principal.pcep@gmail.com</p>
                            <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '1rem' }}>Phone:</p>
                            <p style={{ color: 'var(--text-muted)' }}>06454-226777</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
