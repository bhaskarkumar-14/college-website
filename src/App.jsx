import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  GraduationCap,
  Fingerprint,
  BookOpen,
  Calendar,
  ChevronRight,
  Menu,
  X,
  Zap,
  Settings,
  Cpu,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Auth from './components/Auth';
import AttendancePortal from './components/AttendancePortal';
import ResultPortal from './components/ResultPortal';
import Academics from './components/Academics';
import Facilities from './components/Facilities';
import Admissions from './components/Admissions';
import StudentLife from './components/StudentLife';
import Gallery from './components/Gallery';
import Footer from './components/Footer';
import FacultyDashboard from './components/FacultyDashboard';

const Navbar = ({
  onLoginClick,
  onAcademicsClick,
  onFacilitiesClick,
  onAdmissionsClick,
  onStudentLifeClick,
  onGalleryClick,
  onResultsClick,
  onHomeClick,
  user,
  onLogout,
  theme,
  toggleTheme
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const MobileMenuBtn = ({ onClick, children }) => (
    <button
      onClick={() => { onClick(); setIsMenuOpen(false); }}
      className="mobile-menu-btn"
    >
      {children}
    </button>
  );

  return (
    <>
      <nav className="glass" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, margin: '1rem', borderRadius: '16px', background: 'var(--bg-navbar)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={onHomeClick}>
            <div style={{ background: 'var(--accent)', padding: '4px', borderRadius: '8px', color: 'white', display: 'flex', alignItems: 'center' }}>
              <img src="/pce-logo.jpg" alt="PCE Logo" style={{ width: '32px', height: '32px', borderRadius: '4px' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', marginBottom: 0 }}>Purnia College of Engineering</h1>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '-4px' }}>Govt. Engineering College, Purnia</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div style={{ gap: '1.5rem', alignItems: 'center' }} className="desktop-nav">
            <button onClick={onHomeClick} style={navButtonStyle}>About</button>
            <button onClick={onAcademicsClick} style={navButtonStyle}>Academics</button>
            <button onClick={onAdmissionsClick} style={navButtonStyle}>Admissions</button>
            <button onClick={onFacilitiesClick} style={navButtonStyle}>Facilities</button>
            <button onClick={onStudentLifeClick} style={navButtonStyle}>Student Life</button>
            <button onClick={onGalleryClick} style={navButtonStyle}>Gallery</button>
            <button onClick={onResultsClick} style={navButtonStyle}>Results</button>

            {/* Theme Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              style={{
                background: 'var(--bg-section)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </motion.button>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>ID: {user}</span>
                <button className="btn-primary" onClick={onLogout} style={{ background: '#f43f5e' }}>Logout</button>
              </div>
            ) : (
              <button className="btn-primary" onClick={onLoginClick}>Student Portal</button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="mobile-nav-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="mobile-menu-overlay"
          >
            <div className="mobile-menu-list">
              <MobileMenuBtn onClick={onHomeClick}>About</MobileMenuBtn>
              <MobileMenuBtn onClick={onAcademicsClick}>Academics</MobileMenuBtn>
              <MobileMenuBtn onClick={onAdmissionsClick}>Admissions</MobileMenuBtn>
              <MobileMenuBtn onClick={onFacilitiesClick}>Facilities</MobileMenuBtn>
              <MobileMenuBtn onClick={onStudentLifeClick}>Student Life</MobileMenuBtn>
              <MobileMenuBtn onClick={onGalleryClick}>Gallery</MobileMenuBtn>
              <MobileMenuBtn onClick={onResultsClick}>Results</MobileMenuBtn>

              <div style={{ width: '100%', height: '1px', background: 'var(--border-color)', margin: '0.5rem 0' }}></div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 12px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Theme</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleTheme}
                  style={{
                    background: 'var(--bg-section)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </motion.button>
              </div>

              {user ? (
                <div style={{ padding: '12px', background: 'var(--bg-section)', borderRadius: '8px', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Signed in as</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{user}</span>
                  </div>
                  <button className="btn-primary" onClick={() => { onLogout(); setIsMenuOpen(false); }} style={{ width: '100%', background: '#f43f5e', padding: '0.5rem' }}>Logout</button>
                </div>
              ) : (
                <button className="btn-primary" onClick={() => { onLoginClick(); setIsMenuOpen(false); }} style={{ marginTop: '0.5rem' }}>Student Portal Login</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const navButtonStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--text-primary)',
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'var(--font-heading)',
  fontSize: '0.95rem'
};

const Hero = ({ onGetStarted, onAdmissionsClick }) => {
  return (
    <section className="section-padding" style={{ paddingTop: '10rem', background: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.1) 0%, transparent 40%)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span style={{ color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.875rem' }}>
            Established 2017 • Affiliated to BEU Patna
          </span>
          <h2 className="hero-title">
            Shaping Excellence in <span className="gradient-text">Modern Engineering</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: '2.5rem', maxWidth: '500px' }}>
            Purnea College of Engineering (PCE) is a premier technical institution under DST Bihar, dedicated to fostering innovation and academic rigor.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={onGetStarted}>Student Portal Login</button>
            <button onClick={onAdmissionsClick} style={{
              background: 'transparent',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontFamily: 'var(--font-heading)',
              fontWeight: 500,
              cursor: 'pointer'
            }}>View Admissions</button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ position: 'relative' }}
        >
          <div className="animate-float" style={{ background: 'var(--accent)', borderRadius: '32px', padding: '10px', boxShadow: '0 30px 60px -12px rgba(59, 130, 246, 0.3)' }}>
            <img
              src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800"
              alt="PCE Purnia Campus"
              style={{ width: '100%', borderRadius: '24px', display: 'block' }}
            />
          </div>
          <div className="glass" style={{ position: 'absolute', bottom: '-30px', left: '-10px', right: '-10px', padding: '1.5rem', borderRadius: '24px', maxWidth: '80%', margin: '0 auto' }}>
            <h4 style={{ color: 'var(--accent)' }}>Dr. Manoj Kumar</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Principal, PCE Purnia</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

function App() {
  const [view, setView] = useState('home');
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogin = (id, role = 'Student') => {
    setUser(id);
    if (role === 'Faculty') {
      setView('faculty-portal');
    } else {
      setView('portal');
    }
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    setUser(null);
    setView('home');
    window.scrollTo(0, 0);
  };

  const commonProps = {
    onLoginClick: () => setView('auth'),
    onAcademicsClick: () => { setView('academics'); window.scrollTo(0, 0); },
    onFacilitiesClick: () => { setView('facilities'); window.scrollTo(0, 0); },
    onAdmissionsClick: () => { setView('admissions'); window.scrollTo(0, 0); },
    onStudentLifeClick: () => { setView('student-life'); window.scrollTo(0, 0); },
    onGalleryClick: () => { setView('gallery'); window.scrollTo(0, 0); },
    onResultsClick: () => { setView('results'); window.scrollTo(0, 0); },
    onHomeClick: () => { setView('home'); window.scrollTo(0, 0); },
    user,
    onLogout: handleLogout,
    theme,
    toggleTheme
  };

  if (view === 'auth') {
    return <Auth onLogin={handleLogin} onBack={() => setView('home')} theme={theme} />;
  }

  return (
    <div className="App" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Dynamic Background */}
      <div className="blob-bg">
        <div className="blob" style={{ top: '10%', left: '10%', background: 'var(--accent)', width: '400px', height: '400px', animationDelay: '0s' }}></div>
        <div className="blob" style={{ top: '40%', right: '10%', background: 'var(--accent-secondary)', width: '350px', height: '350px', animationDelay: '2s' }}></div>
        <div className="blob" style={{ bottom: '10%', left: '20%', background: '#f43f5e', width: '300px', height: '300px', animationDelay: '4s' }}></div>
      </div>

      <Navbar {...commonProps} />

      {view === 'home' && (
        <>
          <Hero onGetStarted={() => setView('auth')} onAdmissionsClick={() => setView('admissions')} />

          {/* Principal's Note */}
          <section className="section-padding" style={{ background: 'var(--bg-page)' }}>
            <div className="container">
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '4rem', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Principal's <span className="gradient-text">Message</span></h3>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-main)', fontStyle: 'italic', marginBottom: '2rem' }}>
                    "Our mission is to empower students with technical knowledge and ethical values that will enable them to contribute significantly to the engineering field. At PCE Purnia, we provide a vibrant academic environment supported by modern labs and dedicated faculty."
                  </p>
                  <p style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-primary)' }}>Dr. Manoj Kumar</p>
                  <p style={{ color: 'var(--text-muted)' }}>Principal, Purnia College of Engineering</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="glass" style={{ padding: '1.5rem' }}>
                    <h5 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Institution Code</h5>
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>PCEP (DST Bihar)</p>
                  </div>
                  <div className="glass" style={{ padding: '1.5rem' }}>
                    <h5 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Affiliation</h5>
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Bihar Engineering University, Patna</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="section-padding" style={{ background: 'var(--bg-section)' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h3 style={{ fontSize: '2.5rem', color: 'var(--text-primary)' }}>Core Management Features</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Advanced systems for students and faculty tracking</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <motion.div whileHover={{ y: -10 }} className="glass" style={{ padding: '2.5rem', borderRadius: '20px' }}>
                  <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent)', width: 'fit-content', padding: '12px', borderRadius: '12px', marginBottom: '1.5rem' }}>
                    <Fingerprint size={32} />
                  </div>
                  <h4 style={{ color: 'var(--text-primary)' }}>Biometric Attendance</h4>
                  <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>High-precision fingerprint and visual verification for daily attendance tracking.</p>
                </motion.div>

                <motion.div whileHover={{ y: -10 }} className="glass" style={{ padding: '2.5rem', borderRadius: '20px' }}>
                  <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent)', width: 'fit-content', padding: '12px', borderRadius: '12px', marginBottom: '1.5rem' }}>
                    <BookOpen size={32} />
                  </div>
                  <h4 style={{ color: 'var(--text-primary)' }}>Smart Course Tracking</h4>
                  <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Real-time analytics for B.Tech semester courses and lecture participation.</p>
                </motion.div>

                <motion.div whileHover={{ y: -10 }} className="glass" style={{ padding: '2.5rem', borderRadius: '20px' }}>
                  <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent)', width: 'fit-content', padding: '12px', borderRadius: '12px', marginBottom: '1.5rem' }}>
                    <Zap size={32} />
                  </div>
                  <h4 style={{ color: 'var(--text-primary)' }}>Instant Notifications</h4>
                  <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Instant alerts for low attendance, exam schedules, and department circulars.</p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Departments Summary Section */}
          <section className="section-padding" style={{ background: 'var(--bg-page)' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h3 style={{ fontSize: '2.5rem', color: 'var(--text-primary)' }}>Official B.Tech Branches</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Comprehensive engineering programs approved by AICTE</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                {[
                  { name: 'Civil Engineering', icon: <Building2 size={24} />, desc: 'Structural design and infrastructure development.' },
                  { name: 'Mechanical Engineering', icon: <Settings size={24} />, desc: 'Core systems and advanced manufacturing.' },
                  { name: 'Electrical Engineering', icon: <Zap size={24} />, desc: 'Power systems and electrical machines.' },
                  { name: 'Electronics & Comm.', icon: <Zap size={24} />, desc: 'Signal processing and network systems.' },
                  { name: 'CSE (General)', icon: <BookOpen size={24} />, desc: 'Software engineering and system architecture.' },
                  { name: 'CSE (AI)', icon: <Cpu size={24} />, desc: 'Artificial intelligence and neural networks.' },
                  { name: 'Mechatronics', icon: <Settings size={24} />, desc: 'Hybrid mechanical and electrical systems.' }
                ].map((branch, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -5 }}
                    className="glass"
                    style={{ padding: '2rem' }}
                  >
                    <div style={{ color: 'var(--accent)', marginBottom: '1rem' }}>{branch.icon}</div>
                    <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{branch.name}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{branch.desc}</p>
                  </motion.div>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <button className="btn-primary" onClick={commonProps.onAcademicsClick}>View Full Academic Details</button>
              </div>
            </div>
          </section>
        </>
      )}

      {view === 'academics' && <Academics theme={theme} />}
      {view === 'facilities' && <Facilities theme={theme} />}
      {view === 'admissions' && <Admissions theme={theme} />}
      {view === 'student-life' && <StudentLife theme={theme} />}
      {view === 'gallery' && <Gallery theme={theme} />}
      {view === 'results' && <ResultPortal />}
      {view === 'portal' && <AttendancePortal theme={theme} onLogout={handleLogout} />}
      {view === 'faculty-portal' && <FacultyDashboard theme={theme} onLogout={handleLogout} />}

      <Footer />
    </div>
  );
}

export default App;
