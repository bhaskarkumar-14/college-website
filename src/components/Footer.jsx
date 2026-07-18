import React from 'react';

const Footer = () => {
    return (
        <footer style={{ background: 'var(--bg-section)', borderTop: '1px solid var(--border-color)', padding: '5rem 0 3rem' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
                    <div>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.2rem', fontSize: '1.25rem' }}>Purnea College of Engineering</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
                            Affiliated to Bihar Engineering University, Patna.<br />
                            Near Ram Nagar, Purnea, Bihar - 854301.<br />
                            Established by Govt. of Bihar in 2017.
                        </p>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--text-primary)', marginBottom: '1.2rem', fontSize: '1.1rem' }}>Institutional Links</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: 0 }}>
                            <li><a href="#" style={linkStyle}>Affiliation Details</a></li>
                            <li><a href="#" style={linkStyle}>DST Bihar Portal</a></li>
                            <li><a href="#" style={linkStyle}>Academic Calendar</a></li>
                            <li><a href="#" style={linkStyle}>Careers / Recruitment</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--text-primary)', marginBottom: '1.2rem', fontSize: '1.1rem' }}>Support & Trust</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: 0 }}>
                            <li><a href="#" style={linkStyle}>Privacy Policy</a></li>
                            <li><a href="#" style={linkStyle}>Terms of Service</a></li>
                            <li><a href="#" style={linkStyle}>Cookie Preferences</a></li>
                            <li><a href="#" style={linkStyle}>Student Grievance FAQ</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--text-primary)', marginBottom: '1.2rem', fontSize: '1.1rem' }}>Contact Info</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                            <p><strong style={{ color: 'var(--text-primary)' }}>Email:</strong> principal.pcep@gmail.com</p>
                            <p><strong style={{ color: 'var(--text-primary)' }}>Phone:</strong> +91-6454-226777</p>
                            <p><strong style={{ color: 'var(--text-primary)' }}>Hours:</strong> Mon - Sat: 10 AM - 5 PM</p>
                        </div>
                    </div>
                </div>
                
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        © {new Date().getFullYear()} Purnea College of Engineering. All rights reserved. Managed under DST, Government of Bihar.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <a href="#" aria-label="Official Twitter Profile" style={socialLinkStyle}>Twitter</a>
                        <a href="#" aria-label="Official LinkedIn Page" style={socialLinkStyle}>LinkedIn</a>
                        <a href="#" aria-label="Official Facebook Page" style={socialLinkStyle}>Facebook</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const linkStyle = {
    color: 'var(--text-muted)',
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'color 0.2s ease'
};

const socialLinkStyle = {
    color: 'var(--text-muted)',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: 500,
    transition: 'color 0.2s ease'
};

export default Footer;
