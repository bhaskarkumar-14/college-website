import express from 'express';
import { registerStudent, loginStudent, getStudentProfile, getStudentDashboard, markBiometricAttendance } from '../controllers/authController.js';
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from '../controllers/announcementController.js';
import { protectStudent, protectFaculty, protectAny } from '../middleware/authMiddleware.js';

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

// --- Faculty Routes ---
import { registerFaculty, loginFaculty, getStudentsByFilter, updateStudentAttendance, modifyStudentSubject } from '../controllers/facultyController.js';

router.post('/faculty/register', registerFaculty);
router.post('/faculty/login', loginFaculty);
router.get('/faculty/students', protectFaculty, getStudentsByFilter);
router.put('/faculty/attendance', protectFaculty, updateStudentAttendance);
router.put('/faculty/subject', protectFaculty, modifyStudentSubject);


export default router;
