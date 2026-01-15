import React from 'react';
import { motion } from 'framer-motion';
import { Music, Code, Users, Award, Calendar, Heart } from 'lucide-react';

const StudentLife = ({ theme }) => {
    const events = [
        {
            title: 'Tech Alegria',
            type: 'Technical Fest',
            desc: 'The annual technical powerhouse featuring HackCelestial (Hackathon), HackRobo, coding contests, and robotics workshops.',
            icon: <Code />,
            color: '#3B82F6'
        },
        {
            title: 'Youth Fest',
            type: 'Cultural Fest',
            desc: 'A vibrant celebration of art, dance, music, and drama. Brings together students to showcase their creative talents.',
            icon: <Music />,
            color: '#EC4899'
        },
        {
            title: 'Sports Week',
            type: 'Annual Sports',
            desc: 'Week-long inter-branch competition including Cricket, Volleyball, Badminton, and Athletics.',
            icon: <Award />,
            color: '#10B981'
        }
    ];

    return (
        <div className="section-padding" style={{ background: 'var(--bg-section)', minHeight: '100vh', paddingTop: '8rem' }}>
            <div className="container" style={{ maxWidth: '1200px' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ textAlign: 'center', marginBottom: '5rem' }}
                >
                    <h2 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                        Life at <span className="gradient-text">PCE</span>
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                        Beyond academics, we foster a community of creativity, leadership, and celebration.
                    </p>
                </motion.div>

                {/* Events Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem', marginBottom: '6rem' }}>
                    {events.map((event, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -10 }}
                            className="glass"
                            style={{ padding: '2.5rem', borderRadius: '32px', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}
                        >
                            <div style={{
                                position: 'absolute', top: 0, right: 0, padding: '0.5rem 1.5rem',
                                background: event.color, color: 'white',
                                borderBottomLeftRadius: '20px', fontWeight: 600, fontSize: '0.85rem'
                            }}>
                                {event.type}
                            </div>
                            <div style={{
                                background: `rgba(${parseInt(event.color.slice(1, 3), 16)}, ${parseInt(event.color.slice(3, 5), 16)}, ${parseInt(event.color.slice(5, 7), 16)}, 0.1)`,
                                width: '64px', height: '64px', borderRadius: '20px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: event.color, marginBottom: '1.5rem'
                            }}>
                                {React.cloneElement(event.icon, { size: 32 })}
                            </div>
                            <h3 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>{event.title}</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>{event.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Clubs & Communities */}
                <div style={{ background: 'var(--bg-card)', borderRadius: '40px', padding: '4rem', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', md: 'row', gap: '3rem', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Student Clubs</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                                From coding societies to eco-clubs, PCE offers various platforms for students to pursue their passions.
                                Our student-led committees organize workshops, seminars, and social drives regularly.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                {['Coding Club', 'Robotics Society', 'Cultural Committee', 'Sports Club', 'NSS Unit'].map((club, i) => (
                                    <span key={i} style={{
                                        padding: '10px 20px', borderRadius: '100px',
                                        background: 'var(--bg-page)', border: '1px solid var(--border-color)',
                                        color: 'var(--accent)', fontWeight: 500
                                    }}>
                                        {club}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                            <div style={{
                                width: '100%', maxWidth: '400px', aspectRatio: '1/1',
                                background: 'linear-gradient(45deg, var(--accent), var(--accent-secondary))',
                                borderRadius: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '5rem', color: 'white', fontWeight: 700, opacity: 0.9
                            }}>
                                <Users size={120} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentLife;
