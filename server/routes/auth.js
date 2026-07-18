import express from 'express';
import { registerStudent, loginStudent, getStudentProfile, getStudentDashboard, markBiometricAttendance } from '../controllers/authController.js';
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from '../controllers/announcementController.js';
import { protectStudent, protectFaculty, protectAny } from '../middleware/authMiddleware.js';
import { getExams, createExam, deleteExam, parsePdfExamQuestions, submitExamAttempt } from '../controllers/examController.js';

const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.get('/profile', protectStudent, getStudentProfile);
router.get('/dashboard', protectStudent, getStudentDashboard);
router.post('/mark-attendance', protectStudent, markBiometricAttendance);

// Announcement Routes
router.get('/announcements', getAnnouncements); // Public access
router.post('/announcements', protectFaculty, createAnnouncement); // Faculty only
router.delete('/announcements/:id', protectFaculty, deleteAnnouncement); // Faculty only

// Practice Exams Routes
router.get('/exams', protectAny, getExams); // Students and Faculty
router.post('/faculty/exams', protectFaculty, createExam); // Faculty only
router.post('/faculty/exams/parse-pdf', protectFaculty, parsePdfExamQuestions); // Faculty only
router.delete('/faculty/exams/:id', protectFaculty, deleteExam); // Faculty only
router.post('/exams/submit', protectStudent, submitExamAttempt); // Student only

// --- Faculty Routes ---
import { registerFaculty, loginFaculty, getStudentsByFilter, updateStudentAttendance, modifyStudentSubject, scanClassroomAttendance, submitBatchAttendance } from '../controllers/facultyController.js';

router.post('/faculty/register', registerFaculty);
router.post('/faculty/login', loginFaculty);
router.get('/faculty/students', protectFaculty, getStudentsByFilter);
router.put('/faculty/attendance', protectFaculty, updateStudentAttendance);
router.post('/faculty/attendance/batch', protectFaculty, submitBatchAttendance);
router.put('/faculty/subject', protectFaculty, modifyStudentSubject);
router.post('/faculty/attendance/scan-classroom', protectFaculty, scanClassroomAttendance);

export default router;
