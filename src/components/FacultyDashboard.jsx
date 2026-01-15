import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Edit2, BookOpen, AlertCircle, LogOut, Trash2 } from 'lucide-react';

const FacultyDashboard = ({ theme, onLogout }) => {
    const [view, setView] = useState('students');
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const [announcements, setAnnouncements] = useState([]);
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', message: '', type: 'General' });

    const [branch, setBranch] = useState('CSE');
    const [session, setSession] = useState('2022-26');
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [newSubject, setNewSubject] = useState('');

    // Helper to request auth headers easily
    const getAuthHeader = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo?.token}`
        };
    };

    useEffect(() => {
        if (view === 'students') fetchStudents();
        if (view === 'announcements') fetchAnnouncements();
    }, [branch, session, view]);

    // Client-side filtering for students based on name or ID search
    useEffect(() => {
        const results = students.filter(student =>
            student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredStudents(results);
    }, [searchTerm, students]);

    const fetchStudents = async () => {
        try {
            const res = await fetch(`/api/auth/faculty/students?branch=${branch}&session=${session}`, {
                headers: getAuthHeader()
            });
            const data = await res.json();
            setStudents(data);
            setFilteredStudents(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch students:", error);
            setLoading(false);
        }
    };

    const fetchAnnouncements = async () => {
        try {
            const res = await fetch('/api/auth/announcements', {
                headers: getAuthHeader()
            });
            const data = await res.json();
            setAnnouncements(data);
        } catch (error) {
            console.error("Failed to fetch announcements:", error);
        }
    };

    const handleCreateAnnouncement = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/announcements', {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify(newAnnouncement)
            });
            if (res.ok) {
                alert("Announcement Posted!");
                setNewAnnouncement({ title: '', message: '', type: 'General' });
                fetchAnnouncements();
            }
        } catch (error) {
            console.error("Post failed:", error);
        }
    };

    const handleDeleteAnnouncement = async (id) => {
        if (!window.confirm("Delete this announcement?")) return;
        try {
            const res = await fetch(`/api/auth/announcements/${id}`, {
                method: 'DELETE',
                headers: getAuthHeader()
            });
            if (res.ok) {
                fetchAnnouncements();
            } else {
                const errorData = await res.json();
                alert(`Failed to delete: ${errorData.message || res.statusText}`);
            }
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Delete failed: Network or Server Error");
        }
    };

    const handleUpdateAttendance = async (studentId, subjectName, type) => {
        try {
            // Payload structure: Identify student, subject, and the increment action
            const payload = {
                studentId,
                subjectName,
                incrementAttended: type === 'present' ? 1 : 0,
                incrementTotal: 1
            };

            const res = await fetch('/api/auth/faculty/attendance', {
                method: 'PUT',
                headers: getAuthHeader(),
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Attendance Updated!");
                if (selectedStudent && selectedStudent._id === studentId) {
                    const updated = await res.json();
                    setSelectedStudent(updated);
                }
                fetchStudents();
            }
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    const handleModifySubject = async (studentId, subjectName, action) => {
        try {
            const payload = {
                studentId,
                subjectName,
                action, // 'add' or 'remove'
                totalLectures: 40 // Default
            };

            const res = await fetch('/api/auth/faculty/subject', {
                method: 'PUT',
                headers: getAuthHeader(),
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert(action === 'add' ? "Subject Added" : "Subject Removed");
                const updated = await res.json();
                setSelectedStudent(updated);
                setNewSubject('');
                fetchStudents();
            } else {
                const err = await res.json();
                alert(err.message);
            }
        } catch (error) {
            console.error("Modify failed:", error);
        }
    };

    return (
        <div style={{ padding: '8rem 2rem 4rem', minHeight: '100vh', background: 'var(--bg-section)', color: 'var(--text-main)' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)' }}>Faculty <span className="gradient-text">Management Portal</span></h2>
                        <p style={{ color: 'var(--text-muted)' }}>Manage student records and academic progress</p>
                    </div>
                    <button onClick={onLogout} className="btn-primary" style={{ background: '#f43f5e' }}>
                        <LogOut size={18} style={{ marginRight: '8px' }} /> Logout
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
                    <div className="glass" style={{ padding: '2rem', borderRadius: '24px', height: 'fit-content' }}>
                        <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Menu</h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            <button
                                onClick={() => { setView('students'); setSelectedStudent(null); }}
                                style={{
                                    padding: '12px', borderRadius: '12px', border: 'none',
                                    background: view === 'students' ? 'var(--accent)' : 'var(--bg-page)',
                                    color: view === 'students' ? 'white' : 'var(--text-muted)',
                                    display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 600
                                }}
                            >
                                <Users size={18} /> Student Directory
                            </button>
                            <button
                                onClick={() => { setView('announcements'); setSelectedStudent(null); }}
                                style={{
                                    padding: '12px', borderRadius: '12px', border: 'none',
                                    background: view === 'announcements' ? 'var(--accent)' : 'var(--bg-page)',
                                    color: view === 'announcements' ? 'white' : 'var(--text-muted)',
                                    display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 600
                                }}
                            >
                                <AlertCircle size={18} /> Announcements
                            </button>
                        </div>

                        {view === 'students' && (
                            <>
                                <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Filters</h4>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Branch</label>
                                    <select
                                        value={branch}
                                        onChange={(e) => setBranch(e.target.value)}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-page)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
                                    >
                                        {['CSE', 'ECE', 'ME', 'CE', 'EE'].map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Session</label>
                                    <select
                                        value={session}
                                        onChange={(e) => setSession(e.target.value)}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-page)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
                                    >
                                        {['2022-26', '2023-27', '2024-28', '2025-29'].map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Search Student</label>
                                    <div style={{ position: 'relative' }}>
                                        <Search size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
                                        <input
                                            type="text"
                                            placeholder="Name or ID..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', background: 'var(--bg-page)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div>
                        {view === 'students' ? (
                            selectedStudent ? (
                                <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
                                    <button onClick={() => setSelectedStudent(null)} style={{ marginBottom: '1rem', background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}>← Back to List</button>

                                    <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                                        <h3 style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>{selectedStudent.fullName}</h3>
                                        <p style={{ color: 'var(--text-muted)' }}>{selectedStudent.studentId} • {selectedStudent.email}</p>
                                    </div>

                                    <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Academic Attendance Management</h4>
                                    <div style={{ display: 'grid', gap: '1rem' }}>
                                        {selectedStudent.academicAttendance.map((sub, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-page)', padding: '1rem', borderRadius: '12px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ background: 'var(--accent)', padding: '8px', borderRadius: '8px', color: 'white' }}><BookOpen size={16} /></div>
                                                    <div>
                                                        <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{sub.subjectName}</p>
                                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{sub.attendedLectures} / {sub.totalLectures} Lectures</p>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                    <button
                                                        onClick={() => handleUpdateAttendance(selectedStudent._id, sub.subjectName, 'absent')}
                                                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #f43f5e', background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', cursor: 'pointer', fontSize: '0.8rem' }}
                                                    >
                                                        Absent
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateAttendance(selectedStudent._id, sub.subjectName, 'present')}
                                                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #10b981', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                                                    >
                                                        Present
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm(`Remove ${sub.subjectName}?`))
                                                                handleModifySubject(selectedStudent._id, sub.subjectName, 'remove')
                                                        }}
                                                        style={{ marginLeft: '10px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                                        title="Remove Subject"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-color)' }}>
                                            <input
                                                type="text"
                                                placeholder="Enter new subject name..."
                                                value={newSubject}
                                                onChange={(e) => setNewSubject(e.target.value)}
                                                style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'var(--bg-page)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                                            />
                                            <button
                                                onClick={() => handleModifySubject(selectedStudent._id, newSubject, 'add')}
                                                disabled={!newSubject.trim()}
                                                style={{ padding: '10px 20px', borderRadius: '8px', background: 'var(--accent)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', opacity: newSubject.trim() ? 1 : 0.6 }}
                                            >
                                                Add Subject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
                                    <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Student Directory ({filteredStudents.length})</h4>
                                    {loading ? <p>Loading records...</p> : (
                                        <div style={{ display: 'grid', gap: '1rem' }}>
                                            {filteredStudents.map(student => (
                                                <motion.div
                                                    key={student._id}
                                                    whileHover={{ x: 5 }}
                                                    onClick={() => setSelectedStudent(student)}
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        padding: '1rem',
                                                        borderRadius: '12px',
                                                        background: 'var(--bg-page)',
                                                        cursor: 'pointer',
                                                        border: '1px solid transparent',
                                                        transition: 'border-color 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                                                >
                                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                        <div style={{ background: 'var(--bg-section)', padding: '10px', borderRadius: '50%' }}><Users size={20} /></div>
                                                        <div>
                                                            <h5 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{student.fullName}</h5>
                                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{student.studentId}</p>
                                                        </div>
                                                    </div>
                                                    <Edit2 size={16} color="var(--text-muted)" />
                                                </motion.div>
                                            ))}
                                            {filteredStudents.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No students found matching criteria.</p>}
                                        </div>
                                    )}
                                </div>
                            )) : (
                            <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
                                <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Manage Announcements</h4>

                                <form onSubmit={handleCreateAnnouncement} style={{ marginBottom: '2rem', background: 'var(--bg-page)', padding: '1.5rem', borderRadius: '16px' }}>
                                    <h5 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Post New Update</h5>
                                    <div style={{ display: 'grid', gap: '1rem' }}>
                                        <input
                                            type="text"
                                            placeholder="Title"
                                            required
                                            value={newAnnouncement.title}
                                            onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                            style={{ padding: '10px', borderRadius: '8px', background: 'var(--bg-section)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                                        />
                                        <textarea
                                            placeholder="Message content..."
                                            required
                                            rows="3"
                                            value={newAnnouncement.message}
                                            onChange={e => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                                            style={{ padding: '10px', borderRadius: '8px', background: 'var(--bg-section)', border: '1px solid var(--border-color)', color: 'var(--text-main)', resize: 'vertical' }}
                                        />
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <select
                                                value={newAnnouncement.type}
                                                onChange={e => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                                                style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'var(--bg-section)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                                            >
                                                <option value="General">General</option>
                                                <option value="Exam">Exam</option>
                                                <option value="Event">Event</option>
                                                <option value="Urgent">Urgent</option>
                                            </select>
                                            <button type="submit" className="btn-primary" style={{ flex: 1 }}>Publish</button>
                                        </div>
                                    </div>
                                </form>

                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    {announcements.map(ann => (
                                        <div key={ann._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'var(--bg-page)', padding: '1rem', borderRadius: '12px', borderLeft: `4px solid ${ann.type === 'Urgent' ? '#f43f5e' : 'var(--accent)'}` }}>
                                            <div>
                                                <h5 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{ann.title} <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', background: 'var(--bg-section)', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px' }}>{ann.type}</span></h5>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{ann.message}</p>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Posted: {new Date(ann.date).toLocaleDateString()}</p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteAnnouncement(ann._id)}
                                                style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '5px' }}
                                                title="Delete Announcement"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    {announcements.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No active announcements.</p>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacultyDashboard;
