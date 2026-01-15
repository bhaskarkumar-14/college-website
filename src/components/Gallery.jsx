import React from 'react';
import { motion } from 'framer-motion';
import { Image, Play } from 'lucide-react';

const getUnsplashId = (id) => {
    const ids = {
        1: '1562774053-701939374585', // College Building
        2: '1523580494863-6f3031224c94', // Fest/Crowd
        3: '1485827404703-eb1255cc363c', // Robotics/Tech
        4: '1521587760476-6c12a4b040da', // Library
        5: '1531482615713-2afd69097998', // Computer Lab
        6: '1461896182503-d5ed1c0a83b6', // Sports
        7: '1544531586-fde5298cdd40', // Seminar
    };
    return ids[id] || '1562774053-701939374585';
};

const Gallery = ({ theme }) => {
    // Using placeholder images for now as we don't have real assets in the workspace
    // In a real scenario, these would be imported assets
    const images = [
        { id: 1, size: 'large', color: '#3B82F6', title: 'Main Administration Building' },
        { id: 2, size: 'small', color: '#EC4899', title: 'Annual Fest 2024' },
        { id: 3, size: 'small', color: '#10B981', title: 'Robotics Workshop' },
        { id: 4, size: 'medium', color: '#F59E0B', title: 'Library Reading Hall' },
        { id: 5, size: 'small', color: '#6366F1', title: 'Computer Center Lab' },
        { id: 6, size: 'large', color: '#8B5CF6', title: 'Sports Week Finals' },
        { id: 7, size: 'medium', color: '#EF4444', title: 'Seminar Hall Event' },
    ];

    return (
        <div className="section-padding" style={{ background: 'var(--bg-page)', minHeight: '100vh', paddingTop: '8rem' }}>
            <div className="container" style={{ maxWidth: '1200px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: '4rem' }}
                >
                    <h2 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                        Campus <span className="gradient-text">Moments</span>
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                        Capturing the spirit and vibrancy of Purnea College of Engineering.
                    </p>
                </motion.div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gridAutoRows: '250px',
                    gap: '1.5rem'
                }}>
                    {images.map((img, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.02 }}
                            viewport={{ once: true }}
                            style={{
                                gridRowEnd: img.size === 'large' ? 'span 2' : 'span 1',
                                gridColumnEnd: img.size === 'large' ? 'span 2' : 'span 1',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                position: 'relative',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-color)',
                                boxShadow: 'var(--shadow-md)'
                            }}
                        >
                            {/* Real Image */}
                            <img
                                src={`https://images.unsplash.com/photo-${getUnsplashId(img.id)}?auto=format&fit=crop&q=80&w=800`}
                                alt={img.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.5s ease'
                                }}
                            />

                            {/* Overlay */}
                            <div style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                padding: '1.5rem',
                                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                color: 'white'
                            }}>
                                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500 }}>{img.title}</h4>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Gallery;
