import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Settings, Zap, BookOpen, Cpu, GraduationCap, Globe, Users, UserCheck } from 'lucide-react';

const Academics = ({ theme }) => {
    const departments = [
        {
            name: 'Civil Engineering',
            intake: 60,
            hod: 'Prof. Saurabh Kumar',
            icon: <Building2 />,
            info: 'Focuses on sustainable infrastructure, structural analysis, and advanced construction technologies.',
            labs: ['Fluid Mechanics Lab', 'Surveying Lab', 'Soil Mechanics Lab'],
            faculty: ['Prof. Utsav Mani', 'Prof. Sumit Kumar', 'Prof. Santosh Kumar']
        },
        {
            name: 'Mechanical Engineering',
            intake: 60,
            hod: 'Prof. Md. Saquib Akhter',
            icon: <Settings />,
            info: 'Covers thermodynamics, robotics, manufacturing systems, and material science.',
            labs: ['Thermodynamics Lab', 'Workshop Technology', 'Fluid Machinery'],
            faculty: ['Prof. Ratnesh Kumar', 'Prof. Ram Chandra Sahni']
        },
        {
            name: 'Electrical Engineering',
            intake: 60,
            hod: 'Prof. Manoj Kumar Rajak',
            icon: <Zap />,
            info: 'Specializes in power systems, electrical machines, and smart grid technologies.',
            labs: ['Electrical Machines Lab', 'Power Systems Lab', 'Control Systems Lab'],
            faculty: ['Prof. Md. Amjad Ali', 'Prof. Piyush', 'Prof. Priyanka Rani']
        },
        {
            name: 'Electronics & Communication',
            intake: 60,
            hod: 'Prof. Md. Iftekhar Alam',
            icon: <Zap />,
            info: 'Signal processing, telecommunication, VLSI design, and embedded systems.',
            labs: ['Analog & Digital Comm. Lab', 'Microprocessor Lab', 'VLSI Design Lab'],
            faculty: ['Prof. Ahad Noor', 'Prof. Ravi Anand']
        },
        {
            name: 'Computer Science (CSE)',
            intake: 60,
            hod: 'Prof. Raju Kumar',
            icon: <BookOpen />,
            info: 'Core software development, data structures, algorithms, and cloud computing.',
            labs: ['Programming Lab', 'Database Mgmt Lab', 'Operating System Lab'],
            faculty: ['Mrs. Supriya Kumari', 'Prof. Tapan Kumar', 'Prof. Ravi Kumar']
        },
        {
            name: 'CSE (Artificial Intelligence)',
            intake: 60,
            hod: 'Prof. Raju Kumar',
            icon: <Cpu />,
            info: 'Cutting-edge AI, machine learning, deep learning, and data analytics.',
            labs: ['AI & ML Lab', 'Python Programming', 'Data Analytics Lab'],
            faculty: ['Prof. Tapan Kumar', 'Prof. Ravi Kumar']
        },
        {
            name: 'Mechatronics Engineering',
            intake: 30,
            icon: <Settings />,
            info: 'Hybrid discipline combining mechanical, electrical, and computer engineering.',
            labs: ['Robotics Lab', 'Automation Lab'],
            faculty: []
        }
    ];

    const collaborations = [
        {
            title: 'IIT Bombay Spoken Tutorial',
            desc: 'Collaborative program providing self-paced software training and certification.',
            icon: <Globe size={32} />
        },
        {
            title: 'National Level FDPs',
            desc: 'Hosts AICTE approved Faculty Development Programs on emerging technologies like LaTeX.',
            icon: <GraduationCap size={32} />
        }
    ];

    return (
        <div className="section-padding" style={{ background: 'var(--bg-page)', minHeight: '100vh', paddingTop: '8rem' }}>
            <div className="container" style={{ maxWidth: '1200px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: '4rem' }}
                >
                    <h2 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                        Academic <span className="gradient-text">Excellence</span>
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                        Official B.Tech programs affiliated with Bihar Engineering University (BEU), Patna.
                        Empowering the next generation of engineers with industry-aligned curriculum.
                    </p>
                </motion.div>

                {/* Departments Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginBottom: '6rem' }}>
                    {departments.map((dept, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -10 }}
                            className="glass"
                            style={{
                                padding: '2.5rem',
                                borderRadius: '24px',
                                border: '1px solid var(--border-color)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent)', width: 'fit-content', padding: '12px', borderRadius: '12px', marginBottom: '1.5rem' }}>
                                {React.cloneElement(dept.icon, { size: 32 })}
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>{dept.name}</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>{dept.info}</p>

                            {/* HOD & Intake Stats */}
                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {dept.hod && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <GraduationCap size={18} style={{ color: 'var(--accent)' }} />
                                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>HOD: {dept.hod}</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Users size={18} style={{ color: 'var(--accent)' }} />
                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>Intake: {dept.intake} Students</span>
                                </div>
                            </div>

                            {/* Faculty List */}
                            {dept.faculty && dept.faculty.length > 0 && (
                                <div style={{ marginTop: '1rem', borderTop: '1px dashed var(--border-color)', paddingTop: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <UserCheck size={16} style={{ color: 'var(--text-muted)' }} />
                                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>Key Faculty</span>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {dept.faculty.map((fac, i) => (
                                            <span key={i} style={{ fontSize: '0.85rem', color: 'var(--text-primary)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                                                {fac}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Labs Chips */}
                            <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {dept.labs.map((lab, i) => (
                                    <span key={i} style={{
                                        fontSize: '0.8rem',
                                        padding: '4px 10px',
                                        borderRadius: '12px',
                                        background: 'var(--bg-section)',
                                        color: 'var(--text-muted)',
                                        border: '1px solid var(--border-color)'
                                    }}>
                                        {lab}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Collaborations Section */}
                <div style={{ background: 'var(--bg-section)', borderRadius: '40px', padding: '4rem', border: '1px solid var(--border-color)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h3 style={{ fontSize: '2.5rem', color: 'var(--text-primary)' }}>Collaborations & Initiatives</h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                        {collaborations.map((collab, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '1.5rem', alignItems: 'start' }}>
                                <div style={{ color: 'var(--accent)', background: 'var(--bg-page)', padding: '1rem', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
                                    {collab.icon}
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{collab.title}</h4>
                                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{collab.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Academics;
