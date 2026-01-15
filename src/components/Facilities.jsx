import React from 'react';
import { motion } from 'framer-motion';
import { Library, Home, Monitor, Bike, Coffee, Landmark, Wifi, ShieldCheck } from 'lucide-react';

const Facilities = ({ theme }) => {
    const facilities = [
        {
            title: 'Central Library',
            desc: 'Vast collection of technical books, journals, and NDL membership. Quiet Study zones with digital resource access.',
            icon: <Library />,
            highlight: 'National Digital Library Member'
        },
        {
            title: 'Hostels (Boys & Girls)',
            desc: 'Boys Hostels: A.P.J. Abdul Kalam & C.V. Raman. Girls Hostel: Mother Teresa. All equipped with modern amenities and mess.',
            icon: <Home />,
            highlight: 'Within 12.5-Acre Campus'
        },
        {
            title: 'Computer Center',
            desc: 'State-of-the-art labs with high-speed workstations, AI/ML kits, and specialized engineering software.',
            icon: <Monitor />,
            highlight: 'High-Speed Connectivity'
        },
        {
            title: 'Wi-Fi Campus',
            desc: 'Seamless wireless high-speed internet access across academic and residential blocks for constant learning.',
            icon: <Wifi />,
            highlight: '24/7 Connectivity'
        },
        {
            title: 'Sports & Fitness',
            desc: 'Modern gymnasium and dedicated sports club for indoor and outdoor games (Cricket, Volleyball, Badminton).',
            icon: <Bike />,
            highlight: 'Active Playground'
        },
        {
            title: 'Campus Life',
            desc: 'Includes on-campus Cafeteria, Bank/ATM services, Medical Room, and a large Guest House for visitors.',
            icon: <Landmark />,
            highlight: 'Self-Sustain Campus'
        }
    ];

    return (
        <div className="section-padding" style={{ background: 'var(--bg-section)', minHeight: '100vh', paddingTop: '8rem' }}>
            <div className="container" style={{ maxWidth: '1200px' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ textAlign: 'center', marginBottom: '4rem' }}
                >
                    <span style={{ color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>Infrastructure</span>
                    <h2 style={{ fontSize: '3.5rem', marginTop: '1rem', color: 'var(--text-primary)' }}>
                        World-Class <span className="gradient-text">Facilities</span>
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '1rem auto' }}>
                        A strategically located 12.5-acre campus on NH-31, providing students with every resource needed for excellence.
                    </p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
                    {facilities.map((fac, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            className="glass"
                            style={{
                                padding: '3rem',
                                borderRadius: '32px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-card)',
                                boxShadow: 'var(--shadow-lg)'
                            }}
                        >
                            <div style={{
                                color: 'var(--accent)',
                                marginBottom: '2rem',
                                background: 'var(--bg-page)',
                                width: '64px',
                                height: '64px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '20px',
                                boxShadow: 'var(--shadow-md)'
                            }}>
                                {React.cloneElement(fac.icon, { size: 32 })}
                            </div>
                            <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{fac.title}</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.8', fontSize: '1.05rem' }}>{fac.desc}</p>

                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.5rem 1rem',
                                background: 'rgba(59, 130, 246, 0.1)',
                                borderRadius: '100px',
                                color: 'var(--accent)',
                                fontSize: '0.875rem',
                                fontWeight: 600
                            }}>
                                <ShieldCheck size={16} />
                                {fac.highlight}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Location Advantage */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                        marginTop: '6rem',
                        padding: '4rem',
                        borderRadius: '40px',
                        background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%)',
                        color: 'white',
                        textAlign: 'center'
                    }}
                >
                    <h3 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Strategic Location</h3>
                    <p style={{ fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto', opacity: 0.9 }}>
                        Located 0.5 km from the Purnea Bus Stand and 7 km from the Purnea Railway Junction.
                        Easy accessibility coupled with a serene education environment.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Facilities;
