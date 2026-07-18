import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Edit2, BookOpen, AlertCircle, LogOut, Trash2, FileText, Camera, ScanFace } from 'lucide-react';

const FacultyDashboard = ({ theme, onLogout }) => {
    const [view, setView] = useState('students');
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const [announcements, setAnnouncements] = useState([]);
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', message: '', type: 'General' });
    const [announcementSearch, setAnnouncementSearch] = useState('');
    const [announcementCategory, setAnnouncementCategory] = useState('All');

    const [branch, setBranch] = useState('CSE');
    const [session, setSession] = useState('2022-26');
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [newSubject, setNewSubject] = useState('');

    // Exam Management States
    const [exams, setExams] = useState([]);
    const [examTitle, setExamTitle] = useState('');
    const [examBranch, setExamBranch] = useState('CSE');
    const [examDuration, setExamDuration] = useState(5); // in minutes
    const [examQuestions, setExamQuestions] = useState([]);
    const [pdfParsing, setPdfParsing] = useState(false);
    const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);

    // Question Builder State
    const [qText, setQText] = useState('');
    const [qOpt0, setQOpt0] = useState('');
    const [qOpt1, setQOpt1] = useState('');
    const [qOpt2, setQOpt2] = useState('');
    const [qOpt3, setQOpt3] = useState('');
    const [qCorrect, setQCorrect] = useState(0);
    const [qExplanation, setQExplanation] = useState('');

    // Classroom Face Scan States
    const [scanBranch, setScanBranch] = useState('CSE');
    const [scanSession, setScanSession] = useState('2022-26');
    const [scanSubject, setScanSubject] = useState('');
    const [classroomPhotoPreview, setClassroomPhotoPreview] = useState('');
    const [scanningClassroom, setScanningClassroom] = useState(false);
    const [scanResults, setScanResults] = useState(null);
    const [scanError, setScanError] = useState('');

    // Batch Attendance Sheet States
    const [sheetBranch, setSheetBranch] = useState('CSE');
    const [sheetSession, setSheetSession] = useState('2022-26');
    const [sheetSubject, setSheetSubject] = useState('');
    const [sheetStudents, setSheetStudents] = useState([]);
    const [sheetAttendance, setSheetAttendance] = useState({});
    const [sheetLoading, setSheetLoading] = useState(false);
    const [sheetSubmitting, setSheetSubmitting] = useState(false);

    // Helper to request auth headers easily
    const getAuthHeader = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo?.token}`
        };
    };

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo && userInfo.subjects && userInfo.subjects.length > 0) {
            setSheetSubject(userInfo.subjects[0]);
        }
    }, []);

    const fetchSheetStudents = async () => {
        if (!sheetBranch || !sheetSession) return;
        setSheetLoading(true);
        try {
            const res = await fetch(`/api/auth/faculty/students?branch=${sheetBranch}&session=${sheetSession}`, {
                headers: getAuthHeader()
            });
            const data = await res.json();
            setSheetStudents(data);
            
            // Default all students to "Present"
            const initialAttendance = {};
            data.forEach(s => {
                initialAttendance[s._id] = 'Present';
            });
            setSheetAttendance(initialAttendance);
            setSheetLoading(false);
        } catch (error) {
            console.error("Failed to fetch students for sheet:", error);
            setSheetLoading(false);
        }
    };

    useEffect(() => {
        if (view === 'attendanceSheet') {
            fetchSheetStudents();
        }
    }, [sheetBranch, sheetSession, view]);

    const handleSubmitBatchAttendance = async (e) => {
        e.preventDefault();
        if (!sheetSubject) {
            alert("Please select a subject.");
            return;
        }

        setSheetSubmitting(true);

        const attendanceData = Object.keys(sheetAttendance).map(studentId => ({
            studentId,
            status: sheetAttendance[studentId]
        }));

        try {
            const res = await fetch('/api/auth/faculty/attendance/batch', {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify({
                    subjectName: sheetSubject,
                    attendanceData
                })
            });

            const data = await res.json();
            if (res.ok) {
                alert("Batch attendance submitted successfully!");
                fetchSheetStudents();
            } else {
                alert(data.message || "Failed to submit attendance.");
            }
        } catch (error) {
            console.error("Submit batch attendance error:", error);
            alert("An error occurred during submission.");
        } finally {
            setSheetSubmitting(false);
        }
    };

    useEffect(() => {
        if (view === 'students') fetchStudents();
        if (view === 'announcements') fetchAnnouncements();
        if (view === 'exams') fetchExams();
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

    // --- Practice Exam Management Functions ---
    const fetchExams = async () => {
        try {
            const res = await fetch('/api/auth/exams', {
                headers: getAuthHeader()
            });
            if (res.ok) {
                const data = await res.json();
                setExams(data);
            }
        } catch (error) {
            console.error("Failed to fetch exams:", error);
        }
    };

    const handleAddQuestion = () => {
        if (!qText.trim() || !qOpt0.trim() || !qOpt1.trim() || !qOpt2.trim() || !qOpt3.trim() || !qExplanation.trim()) {
            alert("Please fill in the question, all 4 options, and the explanation.");
            return;
        }

        const newQ = {
            question: qText,
            options: [qOpt0, qOpt1, qOpt2, qOpt3],
            correct: parseInt(qCorrect),
            explanation: qExplanation
        };

        if (editingQuestionIndex !== null) {
            const updated = [...examQuestions];
            updated[editingQuestionIndex] = newQ;
            setExamQuestions(updated);
            setEditingQuestionIndex(null);
        } else {
            setExamQuestions([...examQuestions, newQ]);
        }

        // Reset question builder fields
        setQText('');
        setQOpt0('');
        setQOpt1('');
        setQOpt2('');
        setQOpt3('');
        setQCorrect(0);
        setQExplanation('');
    };

    const handleLoadQuestionForEdit = (idx) => {
        const q = examQuestions[idx];
        setQText(q.question);
        setQOpt0(q.options[0]);
        setQOpt1(q.options[1]);
        setQOpt2(q.options[2]);
        setQOpt3(q.options[3]);
        setQCorrect(q.correct);
        setQExplanation(q.explanation);
        setEditingQuestionIndex(idx);
    };

    const handleCreateExam = async (e) => {
        e.preventDefault();
        if (!examTitle.trim()) {
            alert("Please provide an exam title.");
            return;
        }
        if (examQuestions.length === 0) {
            alert("Please add at least one question to the exam.");
            return;
        }

        const payload = {
            title: examTitle,
            branch: examBranch,
            duration: examDuration * 60, // Convert minutes to seconds
            questions: examQuestions
        };

        try {
            const res = await fetch('/api/auth/faculty/exams', {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Practice Exam Created Successfully!");
                setExamTitle('');
                setExamBranch('CSE');
                setExamDuration(5);
                setExamQuestions([]);
                fetchExams();
            } else {
                const data = await res.json();
                alert(data.message || "Failed to create exam.");
            }
        } catch (err) {
            console.error("Create exam error:", err);
            alert("Server error creating exam.");
        }
    };

    const handleDeleteExam = async (id) => {
        if (!window.confirm("Delete this practice exam?")) return;
        try {
            const res = await fetch(`/api/auth/faculty/exams/${id}`, {
                method: 'DELETE',
                headers: getAuthHeader()
            });

            if (res.ok) {
                alert("Exam Deleted!");
                fetchExams();
            } else {
                alert("Failed to delete exam.");
            }
        } catch (err) {
            console.error("Delete exam error:", err);
        }
    };

    const handleScanClassroom = async (e) => {
        e.preventDefault();
        if (!scanBranch || !scanSession || !scanSubject || !classroomPhotoPreview) {
            setScanError('Please select branch, session, subject, and upload a classroom photo.');
            return;
        }
        setScanningClassroom(true);
        setScanError('');
        setScanResults(null);

        try {
            const res = await fetch('/api/auth/faculty/attendance/scan-classroom', {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify({
                    branch: scanBranch,
                    session: scanSession,
                    subjectName: scanSubject,
                    image: classroomPhotoPreview
                })
            });

            const data = await res.json();
            if (res.ok) {
                setScanResults(data);
                fetchStudents();
            } else {
                setScanError(data.message || 'Failed to analyze photo.');
            }
        } catch (err) {
            console.error(err);
            setScanError('Server error while performing facial recognition scanning.');
        } finally {
            setScanningClassroom(false);
        }
    };

    const handlePdfUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check if PDF file
        if (file.type !== 'application/pdf') {
            alert("Only PDF files are supported.");
            return;
        }

        const reader = new FileReader();
        reader.onload = async () => {
            const base64 = reader.result;
            try {
                setPdfParsing(true);
                const res = await fetch('/api/auth/faculty/exams/parse-pdf', {
                    method: 'POST',
                    headers: getAuthHeader(),
                    body: JSON.stringify({ pdfData: base64 })
                });
                
                const data = await res.json();
                if (res.ok) {
                    alert(data.message || `Successfully parsed questions!`);
                    setExamQuestions([...examQuestions, ...data.questions]);
                } else {
                    alert(data.message || "Failed to parse questions from PDF.");
                }
            } catch (err) {
                console.error("PDF upload error:", err);
                alert("Server error uploading/parsing PDF.");
            } finally {
                setPdfParsing(false);
            }
        };
        reader.readAsDataURL(file);
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
                <div className="dashboard-header-flex">
                    <div>
                        <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)' }}>Faculty <span className="gradient-text">Management Portal</span></h2>
                        <p style={{ color: 'var(--text-muted)' }}>Manage student records and academic progress</p>
                    </div>
                    <button onClick={onLogout} className="btn-primary" style={{ background: '#f43f5e' }}>
                        <LogOut size={18} style={{ marginRight: '8px' }} /> Logout
                    </button>
                </div>

                <div className="faculty-layout-grid">
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
                            <button
                                onClick={() => { setView('exams'); setSelectedStudent(null); }}
                                style={{
                                    padding: '12px', borderRadius: '12px', border: 'none',
                                    background: view === 'exams' ? 'var(--accent)' : 'var(--bg-page)',
                                    color: view === 'exams' ? 'white' : 'var(--text-muted)',
                                    display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 600
                                }}
                            >
                                <BookOpen size={18} /> Manage Exams
                            </button>
                            <button
                                onClick={() => { setView('faceScan'); setSelectedStudent(null); }}
                                style={{
                                    padding: '12px', borderRadius: '12px', border: 'none',
                                    background: view === 'faceScan' ? 'var(--accent)' : 'var(--bg-page)',
                                    color: view === 'faceScan' ? 'white' : 'var(--text-muted)',
                                    display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 600
                                }}
                            >
                                <Camera size={18} /> Smart Face Attendance
                            </button>
                            <button
                                onClick={() => { setView('attendanceSheet'); setSelectedStudent(null); }}
                                style={{
                                    padding: '12px', borderRadius: '12px', border: 'none',
                                    background: view === 'attendanceSheet' ? 'var(--accent)' : 'var(--bg-page)',
                                    color: view === 'attendanceSheet' ? 'white' : 'var(--text-muted)',
                                    display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 600
                                }}
                            >
                                <ScanFace size={18} /> Mark Attendance
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
                        <AnimatePresence mode="wait">
                            {view === 'students' && (
                                <motion.div
                                    key="students"
                                    initial={{ opacity: 0, x: 15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -15 }}
                                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                                >
                                    {selectedStudent ? (
                                        <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                                                <button onClick={() => setSelectedStudent(null)} style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}>← Back to List</button>
                                                <button 
                                                    onClick={() => window.print()} 
                                                    style={{ 
                                                        padding: '6px 14px', 
                                                        borderRadius: '8px', 
                                                        background: 'rgba(59, 130, 246, 0.1)', 
                                                        color: '#3b82f6', 
                                                        border: '1px solid rgba(59, 130, 246, 0.2)', 
                                                        cursor: 'pointer', 
                                                        fontWeight: 600,
                                                        fontSize: '0.85rem' 
                                                    }}
                                                >
                                                    🖨️ Print Attendance Report
                                                </button>
                                            </div>
                                            <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                            {selectedStudent.profilePhoto ? (
                                                <img 
                                                    src={selectedStudent.profilePhoto} 
                                                    alt={selectedStudent.fullName} 
                                                    style={{ 
                                                        width: '90px', 
                                                        height: '90px', 
                                                        borderRadius: '50%', 
                                                        objectFit: 'cover', 
                                                        border: '3px solid var(--accent)',
                                                        boxShadow: '0 8px 24px rgba(99, 102, 241, 0.15)'
                                                    }}
                                                />
                                            ) : (
                                                <div style={{ 
                                                    width: '90px', 
                                                    height: '90px', 
                                                    borderRadius: '50%', 
                                                    background: 'var(--bg-section)', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center',
                                                    border: '3px solid var(--border-color)'
                                                }}>
                                                    <Users size={36} style={{ color: 'var(--text-muted)' }} />
                                                </div>
                                            )}
                                            
                                            <div style={{ flex: 1, minWidth: '200px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                                    <h3 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', fontWeight: 800, margin: 0 }}>{selectedStudent.fullName}</h3>
                                                    {(() => {
                                                        const totalAttended = selectedStudent.academicAttendance.reduce((acc, sub) => acc + (sub.attendedLectures || 0), 0);
                                                        const totalLectures = selectedStudent.academicAttendance.reduce((acc, sub) => acc + (sub.totalLectures || 0), 0);
                                                        const overall = totalLectures > 0 ? (totalAttended / totalLectures) * 100 : 100;
                                                        if (overall >= 75) {
                                                            return <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>Good Standing</span>;
                                                        } else if (overall >= 60) {
                                                            return <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.2)' }}>Low Attendance Warn</span>;
                                                        } else {
                                                            return <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.2)' }}>Critical Attendance Alert</span>;
                                                        }
                                                    })()}
                                                </div>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.4rem', marginBottom: '0.2rem' }}><strong>ID:</strong> {selectedStudent.studentId} | <strong>Branch:</strong> {selectedStudent.branch}</p>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}><strong>Email:</strong> {selectedStudent.email} | <strong>Session:</strong> 2022-26</p>
                                            </div>
                                        </div>

                                        {/* Performance metrics grid */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' }}>
                                            {(() => {
                                                const totalAttended = selectedStudent.academicAttendance.reduce((acc, sub) => acc + (sub.attendedLectures || 0), 0);
                                                const totalLectures = selectedStudent.academicAttendance.reduce((acc, sub) => acc + (sub.totalLectures || 0), 0);
                                                const overall = totalLectures > 0 ? Math.round((totalAttended / totalLectures) * 100) : 100;
                                                const examsCount = selectedStudent.examAttempts ? selectedStudent.examAttempts.length : 0;
                                                
                                                return (
                                                    <>
                                                        <div style={{ background: 'var(--bg-section)', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Overall Attendance</span>
                                                            <h4 style={{ fontSize: '1.6rem', color: overall >= 75 ? '#10b981' : overall >= 60 ? '#f59e0b' : '#f43f5e', margin: 0, fontWeight: 800 }}>{overall}%</h4>
                                                        </div>
                                                        <div style={{ background: 'var(--bg-section)', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Lectures</span>
                                                            <h4 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', margin: 0, fontWeight: 800 }}>{totalAttended} / {totalLectures}</h4>
                                                        </div>
                                                        <div style={{ background: 'var(--bg-section)', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Exams Completed</span>
                                                            <h4 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', margin: 0, fontWeight: 800 }}>{examsCount}</h4>
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    <h4 style={{ marginBottom: '1.25rem', color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.15rem' }}>Subject-wise Attendance Progress</h4>
                                    <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
                                        {selectedStudent.academicAttendance.map((sub, idx) => {
                                            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
                                            const facultySubjects = userInfo.subjects || [];
                                            const isFacultyAdmin = userInfo.isAdmin || false;
                                            const canManage = isFacultyAdmin || facultySubjects.includes(sub.subjectName);
                                            const pct = sub.totalLectures > 0 ? Math.round((sub.attendedLectures / sub.totalLectures) * 100) : 100;
                                            const isLow = pct < 75;

                                            return (
                                                <div key={idx} style={{ 
                                                    background: 'var(--bg-page)', 
                                                    padding: '1.25rem', 
                                                    borderRadius: '16px', 
                                                    border: '1px solid var(--border-color)',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '0.75rem'
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                            <div style={{ background: isLow ? 'rgba(244, 63, 94, 0.1)' : 'rgba(99, 102, 241, 0.1)', padding: '8px', borderRadius: '8px', color: isLow ? '#f43f5e' : 'var(--accent)' }}>
                                                                <BookOpen size={16} />
                                                            </div>
                                                            <div>
                                                                <h5 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                                    {sub.subjectName}
                                                                    {!canManage && (
                                                                        <span style={{ fontSize: '0.65rem', background: 'var(--bg-section)', padding: '2px 8px', borderRadius: '8px', color: 'var(--text-muted)', fontWeight: 600 }}>
                                                                            Read-Only
                                                                        </span>
                                                                    )}
                                                                </h5>
                                                                <p style={{ fontSize: '0.8rem', color: isLow ? '#f43f5e' : '#10b981', margin: '0.15rem 0 0', fontWeight: 600 }}>
                                                                    {sub.attendedLectures} / {sub.totalLectures} Lectures ({pct}%)
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                            <button
                                                                disabled={!canManage}
                                                                onClick={() => handleUpdateAttendance(selectedStudent._id, sub.subjectName, 'absent')}
                                                                style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #f43f5e', background: 'rgba(244, 63, 94, 0.05)', color: '#f43f5e', cursor: canManage ? 'pointer' : 'not-allowed', fontSize: '0.8rem', fontWeight: 600, opacity: canManage ? 1 : 0.4, transition: 'all 0.2s' }}
                                                            >
                                                                Absent
                                                            </button>
                                                            <button
                                                                disabled={!canManage}
                                                                onClick={() => handleUpdateAttendance(selectedStudent._id, sub.subjectName, 'present')}
                                                                style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #10b981', background: 'rgba(16, 185, 129, 0.05)', color: '#10b981', cursor: canManage ? 'pointer' : 'not-allowed', fontSize: '0.8rem', fontWeight: 700, opacity: canManage ? 1 : 0.4, transition: 'all 0.2s' }}
                                                            >
                                                                Present
                                                            </button>
                                                            <button
                                                                disabled={!canManage}
                                                                onClick={() => {
                                                                    if (window.confirm(`Remove ${sub.subjectName}?`))
                                                                        handleModifySubject(selectedStudent._id, sub.subjectName, 'remove')
                                                                }}
                                                                style={{ marginLeft: '4px', background: 'transparent', border: 'none', color: '#ef4444', cursor: canManage ? 'pointer' : 'not-allowed', opacity: canManage ? 1 : 0.3, fontSize: '1.2rem', padding: '2px' }}
                                                                title="Remove Subject"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Subject Attendance Progress Bar */}
                                                    <div style={{ width: '100%', height: '6px', borderRadius: '3px', background: 'var(--bg-section)', overflow: 'hidden' }}>
                                                        <div style={{ 
                                                            width: `${Math.min(pct, 100)}%`, 
                                                            height: '100%', 
                                                            background: isLow ? 'linear-gradient(90deg, #f43f5e, #fda4af)' : 'linear-gradient(90deg, var(--accent), #818cf8)',
                                                            borderRadius: '3px',
                                                            transition: 'width 0.4s ease'
                                                        }} />
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-color)', alignItems: 'center' }}>
                                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Add Assigned Subject:</label>
                                            <select
                                                value={newSubject}
                                                onChange={(e) => setNewSubject(e.target.value)}
                                                style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'var(--bg-page)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                                            >
                                                <option value="">-- Select Subject --</option>
                                                {(JSON.parse(localStorage.getItem('userInfo') || '{}').subjects || []).map(sub => (
                                                    <option key={sub} value={sub}>{sub}</option>
                                                ))}
                                                {JSON.parse(localStorage.getItem('userInfo') || '{}').isAdmin && (
                                                    <>
                                                        <option value="Adv. Computer Architecture">Adv. Computer Architecture</option>
                                                        <option value="Network Security & Cryptography">Network Security & Cryptography</option>
                                                        <option value="Cloud Computing">Cloud Computing</option>
                                                        <option value="Internet of Things">Internet of Things</option>
                                                        <option value="Biology for Engineers">Biology for Engineers</option>
                                                    </>
                                                )}
                                            </select>
                                            <button
                                                onClick={() => {
                                                    handleModifySubject(selectedStudent._id, newSubject, 'add');
                                                    setNewSubject('');
                                                }}
                                                disabled={!newSubject}
                                                style={{ padding: '10px 20px', borderRadius: '8px', background: 'var(--accent)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', opacity: newSubject ? 1 : 0.5 }}
                                            >
                                                Add Subject
                                            </button>
                                        </div>

                                        {/* Biometric logs history */}
                                        <h4 style={{ marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            Biometric Attendance History
                                        </h4>
                                        <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'grid', gap: '0.75rem', background: 'var(--bg-section)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                                            {selectedStudent.biometricLogs && selectedStudent.biometricLogs.length > 0 ? (
                                                [...selectedStudent.biometricLogs].reverse().map((log, idx) => (
                                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', borderBottom: idx < selectedStudent.biometricLogs.length - 1 ? '1px solid var(--border-color)' : 'none', paddingBottom: '0.5rem' }}>
                                                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                                                            {new Date(log.timestamp).toLocaleString()}
                                                        </span>
                                                        <span style={{ fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                                                            {log.status || 'Success'}
                                                        </span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>No biometric logs recorded for this student.</p>
                                            )}
                                        </div>

                                        {/* Practice Exam Attempt History */}
                                        <h4 style={{ marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            Practice Exam Attempt History
                                        </h4>
                                        <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'grid', gap: '0.75rem', background: 'var(--bg-section)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                                            {selectedStudent.examAttempts && selectedStudent.examAttempts.length > 0 ? (
                                                [...selectedStudent.examAttempts].reverse().map((attempt, idx) => (
                                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', borderBottom: idx < selectedStudent.examAttempts.length - 1 ? '1px solid var(--border-color)' : 'none', paddingBottom: '0.5rem' }}>
                                                        <div>
                                                            <p style={{ fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                                                                {attempt.examTitle}
                                                            </p>
                                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                                                                {new Date(attempt.submittedAt).toLocaleString()} • Duration: {Math.floor(attempt.timeTaken / 60)}m {attempt.timeTaken % 60}s
                                                            </p>
                                                        </div>
                                                        <div style={{ textAlign: 'right' }}>
                                                            <span style={{ fontSize: '1rem', color: 'var(--accent)', fontWeight: 800 }}>
                                                                {attempt.score} / {attempt.totalQuestions}
                                                            </span>
                                                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>
                                                                {((attempt.score / attempt.totalQuestions) * 100).toFixed(0)}% Accuracy
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>No exam attempts recorded for this student.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h4 style={{ color: 'var(--text-primary)', margin: 0 }}>Student Directory ({filteredStudents.length})</h4>
                                    </div>
                                    
                                    {/* High-Level Overview Stats Bar */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                                        <div style={{ background: 'var(--bg-page)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Registered Students</span>
                                            <h4 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0, fontWeight: 800 }}>{students.length}</h4>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{filteredStudents.length} matching filters</span>
                                        </div>
                                        {(() => {
                                            let totalAttended = 0;
                                            let totalLectures = 0;
                                            students.forEach(s => {
                                                s.academicAttendance.forEach(sub => {
                                                    totalAttended += sub.attendedLectures || 0;
                                                    totalLectures += sub.totalLectures || 0;
                                                });
                                            });
                                            const avg = totalLectures > 0 ? Math.round((totalAttended / totalLectures) * 100) : 0;
                                            return (
                                                <div style={{ background: 'var(--bg-page)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Average Class Attendance</span>
                                                    <h4 style={{ fontSize: '1.5rem', color: avg >= 75 ? '#10b981' : '#f43f5e', margin: 0, fontWeight: 800 }}>{avg}%</h4>
                                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Across all departments</span>
                                                </div>
                                            );
                                        })()}
                                        <div style={{ background: 'var(--bg-page)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Published Practice Exams</span>
                                            <h4 style={{ fontSize: '1.5rem', color: 'var(--accent)', margin: 0, fontWeight: 800 }}>{exams.length}</h4>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Available for student attempts</span>
                                        </div>
                                    </div>
                                    
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
                                                        {student.profilePhoto ? (
                                                            <img 
                                                                src={student.profilePhoto} 
                                                                alt={student.fullName} 
                                                                style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(var(--accent-rgb, 99, 102, 241), 0.2)' }}
                                                            />
                                                        ) : (
                                                            <div style={{ background: 'var(--bg-section)', padding: '10px', borderRadius: '50%' }}><Users size={20} /></div>
                                                        )}
                                                        <div>
                                                            <h5 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{student.fullName}</h5>
                                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{student.studentId}</p>
                                                        </div>
                                                    </div>
                                                    <Edit2 size={16} color="var(--text-muted)" />
                                                </motion.div>
                                            ))
                                            }
                                            {filteredStudents.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No students found matching criteria.</p>}
                                        </div>
                                    )}
                                </div>
                            )}
                                </motion.div>
                            )}

                            {view === 'announcements' && (
                                <motion.div
                                    key="announcements"
                                    initial={{ opacity: 0, x: 15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -15 }}
                                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                                >
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

                                <h5 style={{ marginBottom: '1rem', color: 'var(--text-primary)', marginTop: '2rem' }}>Published Updates</h5>
                                 
                                 {/* Search & Filter Controls */}
                                 <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                     <input
                                         type="text"
                                         placeholder="Search announcements..."
                                         value={announcementSearch}
                                         onChange={e => setAnnouncementSearch(e.target.value)}
                                         style={{ flex: 2, minWidth: '200px', padding: '10px', borderRadius: '8px', background: 'var(--bg-section)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                                     />
                                     <select
                                         value={announcementCategory}
                                         onChange={e => setAnnouncementCategory(e.target.value)}
                                         style={{ flex: 1, minWidth: '130px', padding: '10px', borderRadius: '8px', background: 'var(--bg-section)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                                     >
                                         <option value="All">All Categories</option>
                                         <option value="General">General</option>
                                         <option value="Exam">Exam</option>
                                         <option value="Event">Event</option>
                                         <option value="Urgent">Urgent</option>
                                     </select>
                                 </div>

                                 <div style={{ display: 'grid', gap: '1rem' }}>
                                     {(() => {
                                         const filtered = announcements.filter(ann => {
                                             const matchesCategory = announcementCategory === 'All' || ann.type === announcementCategory;
                                             const matchesSearch = ann.title.toLowerCase().includes(announcementSearch.toLowerCase()) || 
                                                                   ann.message.toLowerCase().includes(announcementSearch.toLowerCase());
                                             return matchesCategory && matchesSearch;
                                         });

                                         return filtered.length > 0 ? (
                                             filtered.map(ann => (
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
                                             ))
                                         ) : (
                                             <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', textAlign: 'center', padding: '1.5rem' }}>No announcements match search criteria.</p>
                                         );
                                     })()}
                                 </div>
                            </div>
                                </motion.div>
                            )}

                            {view === 'exams' && (
                                <motion.div
                                    key="exams"
                                    initial={{ opacity: 0, x: 15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -15 }}
                                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                                >
                                    <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
                                <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Manage Practice Examinations</h4>

                                {/* Create New Exam Builder Form */}
                                <form onSubmit={handleCreateExam} style={{ marginBottom: '3rem', background: 'var(--bg-page)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                                    <h5 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 600 }}>Create New Exam</h5>
                                    
                                    {/* PDF Upload Card */}
                                    <div style={{ marginBottom: '2rem', padding: '1.5rem', borderRadius: '14px', background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.15)' }}>
                                        <h6 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.4rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FileText size={18} color="var(--accent)" /> Auto-Generate Questions from PDF
                                        </h6>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.25rem', lineHeight: '1.4' }}>
                                            Have an exam question paper PDF? Select it below. The system will parse its text, identify questions, multiple-choice options, answers, and explanations, and append them directly to the builder.
                                        </p>
                                        
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                                            <input
                                                type="file"
                                                accept="application/pdf"
                                                onChange={handlePdfUpload}
                                                disabled={pdfParsing}
                                                style={{
                                                    fontSize: '0.85rem',
                                                    color: 'var(--text-main)',
                                                    background: 'var(--bg-section)',
                                                    padding: '8px 12px',
                                                    borderRadius: '8px',
                                                    border: '1px solid var(--border-color)',
                                                    cursor: 'pointer'
                                                }}
                                            />
                                            {pdfParsing && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>Extracting questions from PDF...</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>Exam Title</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Advanced Architecture Quiz"
                                                required
                                                value={examTitle}
                                                onChange={e => setExamTitle(e.target.value)}
                                                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-section)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>Target Branch</label>
                                            <select
                                                value={examBranch}
                                                onChange={e => setExamBranch(e.target.value)}
                                                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-section)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                                            >
                                                {['CSE', 'ECE', 'ME', 'CE', 'EE', 'default'].map(b => <option key={b} value={b}>{b === 'default' ? 'All (Generic)' : b}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>Duration (Minutes)</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="120"
                                                required
                                                value={examDuration}
                                                onChange={e => setExamDuration(parseInt(e.target.value) || 5)}
                                                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-section)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Question Builder Box */}
                                    <div style={{ background: 'var(--bg-section)', padding: '1.5rem', borderRadius: '14px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                                        <h6 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '1.25rem', fontWeight: 600 }}>Questionnaire Builder</h6>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                                            <input
                                                type="text"
                                                placeholder="Question description text..."
                                                value={qText}
                                                onChange={e => setQText(e.target.value)}
                                                style={{ padding: '10px', borderRadius: '8px', background: 'var(--bg-page)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                                            />
                                            
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <input
                                                    type="text"
                                                    placeholder="Option 1"
                                                    value={qOpt0}
                                                    onChange={e => setQOpt0(e.target.value)}
                                                    style={{ padding: '10px', borderRadius: '8px', background: 'var(--bg-page)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Option 2"
                                                    value={qOpt1}
                                                    onChange={e => setQOpt1(e.target.value)}
                                                    style={{ padding: '10px', borderRadius: '8px', background: 'var(--bg-page)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Option 3"
                                                    value={qOpt2}
                                                    onChange={e => setQOpt2(e.target.value)}
                                                    style={{ padding: '10px', borderRadius: '8px', background: 'var(--bg-page)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Option 4"
                                                    value={qOpt3}
                                                    onChange={e => setQOpt3(e.target.value)}
                                                    style={{ padding: '10px', borderRadius: '8px', background: 'var(--bg-page)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                                                />
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Correct Option</label>
                                                    <select
                                                        value={qCorrect}
                                                        onChange={e => setQCorrect(parseInt(e.target.value))}
                                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-page)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                                                    >
                                                        <option value={0}>Option 1</option>
                                                        <option value={1}>Option 2</option>
                                                        <option value={2}>Option 3</option>
                                                        <option value={3}>Option 4</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Educational Explanation</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Explain why this choice is correct..."
                                                        value={qExplanation}
                                                        onChange={e => setQExplanation(e.target.value)}
                                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-page)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleAddQuestion}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                borderRadius: '8px',
                                                border: editingQuestionIndex !== null ? '1px solid var(--accent)' : '1px dashed var(--accent)',
                                                background: editingQuestionIndex !== null ? 'var(--accent)' : 'transparent',
                                                color: editingQuestionIndex !== null ? 'white' : 'var(--accent)',
                                                fontWeight: 600,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {editingQuestionIndex !== null ? '✓ Update Question' : `+ Add Question to Builder List (${examQuestions.length} added)`}
                                        </button>
                                    </div>

                                    {/* Questions Added Summary */}
                                    {examQuestions.length > 0 && (
                                        <div style={{ marginBottom: '2rem' }}>
                                            <h6 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.75rem', fontWeight: 600 }}>Questions Preview ({examQuestions.length})</h6>
                                            <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--bg-section)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                                                {examQuestions.map((q, idx) => (
                                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-page)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem' }}>
                                                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{idx + 1}. {q.question.substring(0, 60)}...</span>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleLoadQuestionForEdit(idx)}
                                                                style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setExamQuestions(examQuestions.filter((_, i) => i !== idx));
                                                                    if (editingQuestionIndex === idx) setEditingQuestionIndex(null);
                                                                }}
                                                                style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.1rem' }}
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', borderRadius: '10px', fontWeight: 700 }}>
                                        Publish Practice Exam
                                    </button>
                                </form>

                                {/* List of existing exams */}
                                <h5 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontWeight: 600 }}>Published Practice Exams</h5>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {exams.map(exam => (
                                        <div key={exam._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-page)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                            <div>
                                                <h5 style={{ color: 'var(--text-primary)', fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                                                    {exam.title}
                                                    <span style={{ fontSize: '0.7rem', background: 'var(--bg-section)', padding: '2px 8px', borderRadius: '12px', marginLeft: '10px', color: 'var(--accent)', fontWeight: 700 }}>
                                                        {exam.branch === 'default' ? 'All Branches' : exam.branch}
                                                    </span>
                                                </h5>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                    {exam.questions.length} questions • {exam.duration / 60} mins duration
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteExam(exam._id)}
                                                style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px' }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    {exams.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>No exams published yet.</p>}
                                </div>
                            </div>
                                </motion.div>
                            )}

                            {view === 'faceScan' && (
                                <motion.div
                                    key="faceScan"
                                    initial={{ opacity: 0, x: 15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -15 }}
                                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                                >
                                    <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
                                <style>{`
                                    @keyframes scanLaser {
                                        0% { top: 0%; }
                                        50% { top: 98%; }
                                        100% { top: 0%; }
                                    }
                                `}</style>
                                <h3 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Camera size={26} color="var(--accent)" /> Smart Face ID Attendance Scan
                                </h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                                    Upload a classroom group photo. The built-in AI facial recognition scanner will automatically identify present students and instantly log their biometric attendance in the database.
                                </p>

                                <form onSubmit={handleScanClassroom} style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Target Branch</label>
                                            <select
                                                value={scanBranch}
                                                onChange={(e) => setScanBranch(e.target.value)}
                                                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-page)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
                                            >
                                                {['CSE', 'ECE', 'ME', 'CE', 'EE'].map(b => <option key={b} value={b}>{b}</option>)}
                                            </select>
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Session</label>
                                            <select
                                                value={scanSession}
                                                onChange={(e) => setScanSession(e.target.value)}
                                                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-page)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
                                            >
                                                {['2022-26', '2023-27', '2024-28', '2025-29'].map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Select Subject</label>
                                            <select
                                                value={scanSubject}
                                                onChange={(e) => setScanSubject(e.target.value)}
                                                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-page)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
                                                required
                                            >
                                                <option value="">-- Select Subject --</option>
                                                {(JSON.parse(localStorage.getItem('userInfo') || '{}').subjects || []).map(sub => (
                                                    <option key={sub} value={sub}>{sub}</option>
                                                ))}
                                                {JSON.parse(localStorage.getItem('userInfo') || '{}').isAdmin && (
                                                    <>
                                                        <option value="Adv. Computer Architecture">Adv. Computer Architecture</option>
                                                        <option value="Network Security & Cryptography">Network Security & Cryptography</option>
                                                        <option value="Cloud Computing">Cloud Computing</option>
                                                        <option value="Internet of Things">Internet of Things</option>
                                                        <option value="Biology for Engineers">Biology for Engineers</option>
                                                    </>
                                                )}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Photo Uploader Card */}
                                    <div style={{ background: 'var(--bg-page)', border: '2px dashed var(--border-color)', borderRadius: '16px', padding: '2rem', textAlign: 'center', position: 'relative' }}>
                                        {classroomPhotoPreview ? (
                                            <div style={{ position: 'relative', maxWidth: '400px', margin: '0 auto' }}>
                                                <img src={classroomPhotoPreview} alt="Classroom group upload" style={{ width: '100%', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }} />
                                                
                                                {/* Simulated face recognition scanning laser line */}
                                                {scanningClassroom && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        left: 0,
                                                        width: '100%',
                                                        height: '3px',
                                                        background: '#10b981',
                                                        boxShadow: '0 0 15px #10b981',
                                                        animation: 'scanLaser 2s linear infinite'
                                                    }} />
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={() => setClassroomPhotoPreview('')}
                                                    style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 'bold' }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <Camera size={44} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                                                <h5 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: 600 }}>Upload Classroom Group Photo</h5>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>JPEG, PNG format (Maximum size 10MB)</p>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => setClassroomPhotoPreview(reader.result);
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                    style={{ display: 'none' }}
                                                    id="classroom-image-input"
                                                />
                                                <label
                                                    htmlFor="classroom-image-input"
                                                    style={{ padding: '10px 20px', borderRadius: '8px', background: 'var(--bg-section)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', display: 'inline-block' }}
                                                >
                                                    Choose Image File
                                                </label>
                                            </div>
                                        )}
                                    </div>

                                    {scanError && (
                                        <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '10px 15px', borderRadius: '8px', fontSize: '0.9rem' }}>
                                            {scanError}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        disabled={scanningClassroom || !classroomPhotoPreview || !scanSubject}
                                        style={{ width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 700, opacity: (scanningClassroom || !classroomPhotoPreview || !scanSubject) ? 0.6 : 1 }}
                                    >
                                        {scanningClassroom ? 'Analyzing Photo & Processing Matches...' : 'Analyze Classroom Photo & Log Attendance'}
                                    </button>
                                </form>

                                {/* Scan Results View */}
                                {scanResults && (
                                    <div style={{ marginTop: '2.5rem', borderTop: '1px dashed var(--border-color)', paddingTop: '2rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                            <h4 style={{ color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>Attendance Scanning Report</h4>
                                            <span style={{ background: '#10b981', color: 'white', fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: '20px' }}>
                                                SUCCESSFULLY LOGGED
                                            </span>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                                            <div style={{ background: 'var(--bg-page)', padding: '1.25rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Total Students Scanned</p>
                                                <h3 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', marginTop: '0.25rem', marginBottom: 0, fontWeight: 800 }}>{scanResults.scannedCount}</h3>
                                            </div>
                                            <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1.25rem', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                                <p style={{ fontSize: '0.8rem', color: '#10b981', margin: 0 }}>Identified (Present)</p>
                                                <h3 style={{ fontSize: '1.75rem', color: '#10b981', marginTop: '0.25rem', marginBottom: 0, fontWeight: 800 }}>{scanResults.presentCount}</h3>
                                            </div>
                                            <div style={{ background: 'rgba(244, 63, 94, 0.05)', padding: '1.25rem', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                                                <p style={{ fontSize: '0.8rem', color: '#f43f5e', margin: 0 }}>Unidentified (Absent)</p>
                                                <h3 style={{ fontSize: '1.75rem', color: '#f43f5e', marginTop: '0.25rem', marginBottom: 0, fontWeight: 800 }}>{scanResults.absentCount}</h3>
                                            </div>
                                        </div>

                                        <h5 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontWeight: 600 }}>Identified Students List</h5>
                                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                                            {scanResults.results.map((student, idx) => (
                                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-page)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                                    <div>
                                                        <p style={{ color: 'var(--text-primary)', fontWeight: 600, margin: 0 }}>{student.fullName}</p>
                                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>ID: {student.studentId}</p>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        {student.matched ? (
                                                            <>
                                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Match: {student.confidence}%</span>
                                                                <span style={{ fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontWeight: 700 }}>
                                                                    Present
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span style={{ fontSize: '0.8rem', background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', padding: '4px 10px', borderRadius: '20px', fontWeight: 700 }}>
                                                                Absent
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                </div>
                                    </motion.div>
                                )}

                            {view === 'attendanceSheet' && (
                                <motion.div
                                    key="attendanceSheet"
                                    initial={{ opacity: 0, x: 15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -15 }}
                                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                                >
                                    <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
                                        <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <ScanFace size={24} color="var(--accent)" /> Mark Manual Student Attendance
                                        </h4>
                                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                                            Select your subject, branch, and session. Toggle individual student attendance status and submit the complete sheet.
                                        </p>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem', background: 'var(--bg-page)', padding: '1.5rem', borderRadius: '16px' }}>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>Subject</label>
                                                <select
                                                    value={sheetSubject}
                                                    onChange={e => setSheetSubject(e.target.value)}
                                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-section)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                                                >
                                                    {(() => {
                                                        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                                                        const subs = userInfo?.subjects || [];
                                                        return subs.map(s => <option key={s} value={s}>{s}</option>);
                                                    })()}
                                                </select>
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>Branch</label>
                                                <select
                                                    value={sheetBranch}
                                                    onChange={e => setSheetBranch(e.target.value)}
                                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-section)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                                                >
                                                    {['CSE', 'ECE', 'ME', 'CE', 'EE'].map(b => <option key={b} value={b}>{b}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>Session</label>
                                                <select
                                                    value={sheetSession}
                                                    onChange={e => setSheetSession(e.target.value)}
                                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-section)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                                                >
                                                    {['2022-26', '2023-27', '2024-28', '2025-29'].map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        {sheetLoading ? (
                                            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', textAlign: 'center', padding: '2rem' }}>Loading students list...</p>
                                        ) : sheetStudents.length === 0 ? (
                                            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', textAlign: 'center', padding: '2rem' }}>No students registered in this Branch & Session.</p>
                                        ) : (
                                            <form onSubmit={handleSubmitBatchAttendance}>
                                                <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
                                                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-primary)' }}>
                                                        <thead>
                                                            <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                                                                <th style={{ padding: '12px 8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Student Name</th>
                                                                <th style={{ padding: '12px 8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Reg No. (Student ID)</th>
                                                                <th style={{ padding: '12px 8px', color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>Attendance Selection</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {sheetStudents.map(student => {
                                                                const currentStatus = sheetAttendance[student._id] || 'Present';
                                                                return (
                                                                    <tr key={student._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                                        <td style={{ padding: '15px 8px', fontWeight: 600 }}>{student.fullName}</td>
                                                                        <td style={{ padding: '15px 8px', color: 'var(--text-muted)' }}>{student.studentId}</td>
                                                                        <td style={{ padding: '15px 8px', textAlign: 'center' }}>
                                                                            <div style={{ display: 'inline-flex', gap: '1.5rem', alignItems: 'center' }}>
                                                                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.95rem' }}>
                                                                                    <input
                                                                                        type="radio"
                                                                                        name={`attendance-${student._id}`}
                                                                                        value="Present"
                                                                                        checked={currentStatus === 'Present'}
                                                                                        onChange={() => setSheetAttendance({ ...sheetAttendance, [student._id]: 'Present' })}
                                                                                        style={{ accentColor: 'var(--accent)' }}
                                                                                    />
                                                                                    <span>Present</span>
                                                                                </label>
                                                                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.95rem' }}>
                                                                                    <input
                                                                                        type="radio"
                                                                                        name={`attendance-${student._id}`}
                                                                                        value="Absent"
                                                                                        checked={currentStatus === 'Absent'}
                                                                                        onChange={() => setSheetAttendance({ ...sheetAttendance, [student._id]: 'Absent' })}
                                                                                        style={{ accentColor: '#f43f5e' }}
                                                                                    />
                                                                                    <span>Absent</span>
                                                                                </label>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={sheetSubmitting}
                                                    className="btn-primary"
                                                    style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '1rem', fontWeight: 700 }}
                                                >
                                                    {sheetSubmitting ? 'Submitting Attendance Sheet...' : 'Submit Class Attendance'}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            {/* Hidden printable report layout for window.print() */}
            {selectedStudent && (
                <div id="print-report-root">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000000', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                        <div>
                            <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 800, color: '#000000' }}>PURNEA COLLEGE OF ENGINEERING</h1>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.95rem', color: '#555555', fontWeight: 600 }}>Official Attendance & Academic Standing Report</p>
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#777777' }}>Generated on: {new Date().toLocaleString()}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: 800, border: '2px solid #000000', padding: '4px 12px', borderRadius: '4px', color: '#000000' }}>
                                CSE DEPARTMENT
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '2.5rem', marginBottom: '2rem', alignItems: 'center' }}>
                        {selectedStudent.profilePhoto && (
                            <img 
                                src={selectedStudent.profilePhoto} 
                                alt={selectedStudent.fullName} 
                                style={{ width: '120px', height: '120px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #000000' }} 
                            />
                        )}
                        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', color: '#000000' }}>
                            <div>
                                <p style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}><strong>Student Name:</strong> {selectedStudent.fullName}</p>
                                <p style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}><strong>Roll Number / ID:</strong> {selectedStudent.studentId}</p>
                                <p style={{ margin: '0', fontSize: '1rem' }}><strong>Branch:</strong> {selectedStudent.branch}</p>
                            </div>
                            <div>
                                <p style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}><strong>Official Email:</strong> {selectedStudent.email}</p>
                                <p style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}><strong>Academic Standing:</strong> {(() => {
                                    const totalAttended = selectedStudent.academicAttendance.reduce((acc, sub) => acc + (sub.attendedLectures || 0), 0);
                                    const totalLectures = selectedStudent.academicAttendance.reduce((acc, sub) => acc + (sub.totalLectures || 0), 0);
                                    const overall = totalLectures > 0 ? (totalAttended / totalLectures) * 100 : 100;
                                    return overall >= 75 ? 'GOOD STANDING' : 'LOW ATTENDANCE WARNING';
                                })()}</p>
                                <p style={{ margin: '0', fontSize: '1rem' }}><strong>Session:</strong> 2022-2026</p>
                            </div>
                        </div>
                    </div>

                    <h3 style={{ borderBottom: '1px solid #000000', paddingBottom: '0.5rem', marginBottom: '1.25rem', fontSize: '1.25rem', color: '#000000' }}>Course-wise Attendance Breakdown</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem', color: '#000000' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #000000', textAlign: 'left' }}>
                                <th style={{ padding: '8px', fontSize: '0.95rem' }}>Subject Name</th>
                                <th style={{ padding: '8px', fontSize: '0.95rem' }}>Attended Lectures</th>
                                <th style={{ padding: '8px', fontSize: '0.95rem' }}>Total Lectures</th>
                                <th style={{ padding: '8px', fontSize: '0.95rem', textAlign: 'right' }}>Attendance Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedStudent.academicAttendance.map((sub, idx) => {
                                const rate = sub.totalLectures > 0 ? Math.round((sub.attendedLectures / sub.totalLectures) * 100) : 100;
                                return (
                                    <tr key={idx} style={{ borderBottom: '1px solid #dddddd' }}>
                                        <td style={{ padding: '8px', fontSize: '0.9rem' }}>{sub.subjectName}</td>
                                        <td style={{ padding: '8px', fontSize: '0.9rem' }}>{sub.attendedLectures}</td>
                                        <td style={{ padding: '8px', fontSize: '0.9rem' }}>{sub.totalLectures}</td>
                                        <td style={{ padding: '8px', fontSize: '0.9rem', textAlign: 'right', fontWeight: 'bold' }}>{rate}%</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div style={{ marginTop: '5rem', display: 'flex', justifyContent: 'space-between', color: '#000000' }}>
                        <div style={{ textAlign: 'center', width: '200px', borderTop: '1px solid #000000', paddingTop: '0.5rem' }}>
                            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 'bold' }}>Class Coordinator</p>
                        </div>
                        <div style={{ textAlign: 'center', width: '200px', borderTop: '1px solid #000000', paddingTop: '0.5rem' }}>
                            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 'bold' }}>Head of Department</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacultyDashboard;
