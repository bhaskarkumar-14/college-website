import Student from '../models/Student.js';
import Announcement from '../models/Announcement.js';
import jwt from 'jsonwebtoken';

console.log("PCE Backend Controller Initialized");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d',
    });
};

const BRANCH_SESSION_SUBJECTS = {
    '2022-26': { // 7th Semester
        'CSE': [
            { name: 'Biology for Engineers', total: 30, attended: 28 },
            { name: 'Advanced Computer Architecture', total: 42, attended: 35 },
            { name: 'Cyber Security', total: 38, attended: 32 },
            { name: 'Virtual Reality', total: 40, attended: 36 },
            { name: 'Induction Program', total: 45, attended: 39 }
        ],
        'ECE': [
            { name: 'Wireless Communication', total: 45, attended: 40 },
            { name: 'Business Analytics', total: 42, attended: 28 },
            { name: 'Cost Management', total: 30, attended: 25 },
            { name: 'Graduate Employability Skills', total: 38, attended: 34 },
            { name: 'VLSI Technology', total: 40, attended: 37 }
        ],
        'CE': [
            { name: 'Graduate Employability Skills', total: 44, attended: 41 },
            { name: 'Professional Practice, Law & Ethics', total: 40, attended: 30 },
            { name: 'Repair & Rehab of Structures', total: 28, attended: 20 },
            { name: 'Concrete Materials', total: 36, attended: 34 },
            { name: 'Cyber Security', total: 42, attended: 39 }
        ],
        'ME': [
            { name: 'Internal Combustion Engines', total: 46, attended: 42 },
            { name: 'Induction Program', total: 40, attended: 35 },
            { name: 'Renewable Energy Systems', total: 32, attended: 29 },
            { name: 'Automation in Manufacturing', total: 44, attended: 38 },
            { name: 'Operations Research', total: 38, attended: 30 }
        ],
        'EE': [
            { name: 'Power System Protection', total: 45, attended: 41 },
            { name: 'Human Values & Ethics', total: 42, attended: 33 },
            { name: 'Cyber Security', total: 30, attended: 27 },
            { name: 'Virtual Reality', total: 38, attended: 35 },
            { name: 'Electrical Drives', total: 40, attended: 38 }
        ],
        'default': [
            { name: 'Biology for Engineers', total: 30, attended: 25 },
            { name: 'Cyber Security', total: 40, attended: 35 }
        ]
    },
    '2023-27': { // 5th Semester
        'CSE': [
            { name: 'Professional Skill Development', total: 45, attended: 40 },
            { name: 'Artificial Intelligence', total: 42, attended: 38 },
            { name: 'Database Management Systems', total: 40, attended: 35 },
            { name: 'Formal Language & Automata Theory', total: 38, attended: 30 },
            { name: 'Software Engineering', total: 36, attended: 32 },
            { name: 'Seminar', total: 30, attended: 28 }
        ],
        'ECE': [
            { name: 'Digital Signal Processing', total: 45, attended: 40 },
            { name: 'Microprocessors and Microcontrollers', total: 42, attended: 38 },
            { name: 'Linear Control Systems', total: 40, attended: 35 },
            { name: 'Linear Integrated Circuits and Applications', total: 36, attended: 32 },
            { name: 'Probability Theory and Stochastic Processes', total: 38, attended: 33 },
            { name: 'Computer Networks and Security', total: 44, attended: 41 },
            { name: 'Environmental Science', total: 30, attended: 28 },
            { name: 'Constitution of India', total: 20, attended: 18 }
        ],
        'ME': [
            { name: 'Heat Transfer', total: 45, attended: 40 },
            { name: 'Fluid Machinery', total: 42, attended: 38 },
            { name: 'Manufacturing Processes', total: 40, attended: 35 },
            { name: 'Kinematics of Machine', total: 38, attended: 30 },
            { name: 'Constitution of India', total: 36, attended: 32 },
            { name: 'Graduate Employability Skills', total: 30, attended: 28 }
        ],
        'CE': [
            { name: 'Mechanics of Materials', total: 45, attended: 40 },
            { name: 'Hydraulic Engineering', total: 42, attended: 38 },
            { name: 'Analysis and Design of Concrete Structure', total: 40, attended: 35 },
            { name: 'Geotechnical Engineering -I', total: 38, attended: 30 },
            { name: 'Hydrology & Water Resources Engineering', total: 36, attended: 32 },
            { name: 'Environmental Engineering -I', total: 34, attended: 30 },
            { name: 'Transportation Engineering', total: 30, attended: 28 }
        ],
        'EE': [
            { name: 'Power Systems-I', total: 45, attended: 40 },
            { name: 'Control Systems', total: 42, attended: 38 },
            { name: 'Microprocessors', total: 40, attended: 35 },
            { name: 'Power Electronics', total: 38, attended: 30 },
            { name: 'Program Elective - 1', total: 36, attended: 32 }
        ],
        'default': [
            { name: 'Constitution of India', total: 20, attended: 18 }
        ]
    },
    '2024-28': { // 3rd Semester
        'CSE': [
            { name: 'Digital Electronics', total: 50, attended: 45 },
            { name: 'Data Structure and Algorithms', total: 48, attended: 42 },
            { name: 'OOP using JAVA', total: 45, attended: 40 },
            { name: 'Discrete Mathematics', total: 40, attended: 35 },
            { name: 'Operating System', total: 40, attended: 35 },
            { name: 'Universal Human Values', total: 30, attended: 28 },
            { name: 'Indian Knowledge System', total: 20, attended: 18 }
        ],
        'ECE': [
            { name: 'Electronic Devices and Circuit Theory', total: 48, attended: 42 },
            { name: 'Object Oriented Programming', total: 45, attended: 40 },
            { name: 'Network Theory', total: 45, attended: 38 },
            { name: 'Signal & System', total: 42, attended: 39 },
            { name: 'Engineering Mathematics-III', total: 40, attended: 35 },
            { name: 'Universal Human Values', total: 30, attended: 28 },
            { name: 'Indian Knowledge System', total: 20, attended: 18 }
        ],
        'ME': [
            { name: 'Engineering Mechanics', total: 48, attended: 42 },
            { name: 'Material Science and Engineering', total: 45, attended: 40 },
            { name: 'Engineering Mathematics-III', total: 45, attended: 38 },
            { name: 'Thermodynamics', total: 42, attended: 39 },
            { name: 'Basic Electronics Engineering', total: 40, attended: 35 },
            { name: 'Universal Human Values', total: 30, attended: 28 },
            { name: 'Indian Knowledge System', total: 20, attended: 18 }
        ],
        'CE': [
            { name: 'Solid Mechanics', total: 48, attended: 42 },
            { name: 'Engineering Mathematics-III', total: 45, attended: 40 },
            { name: 'Universal Human Values', total: 45, attended: 38 },
            { name: 'Surveying and Geomatics', total: 42, attended: 39 },
            { name: 'Fluid Mechanics', total: 40, attended: 35 },
            { name: 'Materials, Testing & Evaluation', total: 30, attended: 28 },
            { name: 'Indian Knowledge System', total: 20, attended: 18 }
        ],
        'EE': [
            { name: 'Electrical Circuit Analysis', total: 48, attended: 42 },
            { name: 'Analog Electronics', total: 45, attended: 40 },
            { name: 'Electrical Machine-I', total: 45, attended: 38 },
            { name: 'Engineering Mathematics-III', total: 42, attended: 39 },
            { name: 'Engineering Mechanics', total: 40, attended: 35 },
            { name: 'Universal Human Values', total: 30, attended: 28 },
            { name: 'Indian Knowledge System', total: 20, attended: 18 }
        ],
        'default': [
            { name: 'Universal Human Values', total: 30, attended: 28 },
            { name: 'Indian Knowledge System', total: 20, attended: 18 }
        ]
    },
    '2025-29': { // 1st Semester
        'CSE': [
            { name: 'Engineering Mathematics-I', total: 45, attended: 42 },
            { name: 'Engineering Physics', total: 40, attended: 38 },
            { name: 'Programming for Problem Solving', total: 42, attended: 39 },
            { name: 'IT Workshop', total: 38, attended: 35 },
            { name: 'Basic Electronics Engineering', total: 30, attended: 28 }
        ],
        'ECE': [
            { name: 'Engineering Mathematics-I', total: 45, attended: 42 },
            { name: 'Engineering Physics', total: 40, attended: 38 },
            { name: 'Programming for Problem Solving', total: 42, attended: 39 },
            { name: 'Basic Electrical Engineering', total: 38, attended: 35 },
            { name: 'Workshop Practices', total: 30, attended: 28 }
        ],
        'EE': [
            { name: 'Engineering Mathematics-I', total: 45, attended: 42 },
            { name: 'Engineering Physics', total: 40, attended: 38 },
            { name: 'Programming for Problem Solving', total: 42, attended: 39 },
            { name: 'Basic Electrical Engineering', total: 38, attended: 35 },
            { name: 'Workshop Practices', total: 30, attended: 28 }
        ],
        'ME': [
            { name: 'Engineering Chemistry', total: 45, attended: 42 },
            { name: 'Engineering Mathematics-I', total: 40, attended: 38 },
            { name: 'Communicative English', total: 42, attended: 39 },
            { name: 'Engineering Graphics and Design', total: 38, attended: 35 },
            { name: 'Basic Electrical Engineering', total: 30, attended: 28 }
        ],
        'CE': [
            { name: 'Engineering Chemistry', total: 45, attended: 42 },
            { name: 'Engineering Mathematics-I', total: 40, attended: 38 },
            { name: 'Communicative English', total: 42, attended: 39 },
            { name: 'Engineering Graphics and Design', total: 38, attended: 35 },
            { name: 'Engineering Mechanics', total: 30, attended: 28 }
        ],
        'default': [
            { name: 'Engineering Mathematics-I', total: 45, attended: 42 },
            { name: 'Engineering Physics', total: 40, attended: 38 },
            { name: 'Programming for Problem Solving', total: 42, attended: 39 }
        ]
    }
};

export const registerStudent = async (req, res) => {
    const { fullName, studentId, email, branch, session, password } = req.body;

    try {
        const studentExists = await Student.findOne({ studentId });

        if (studentExists) {
            return res.status(400).json({ message: 'Student ID already registered' });
        }

        const sessionData = BRANCH_SESSION_SUBJECTS[session] || BRANCH_SESSION_SUBJECTS['2025-29'];
        const subjectList = (sessionData && sessionData[branch]) || (sessionData && sessionData['default']) || [];

        const academicAttendance = subjectList.map(sub => ({
            subjectName: sub.name,
            totalLectures: sub.total,
            attendedLectures: 0,
            lastAttended: new Date()
        }));

        const student = await Student.create({
            fullName,
            studentId,
            email,
            branch,
            session,
            password,
            academicAttendance,
            biometricLogs: []
        });

        if (student) {
            res.status(201).json({
                _id: student._id,
                fullName: student.fullName,
                studentId: student.studentId,
                branch: student.branch,
                session: student.session,
                token: generateToken(student._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid student data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginStudent = async (req, res) => {
    const { studentId, password } = req.body;

    try {
        const student = await Student.findOne({ studentId });

        if (student && (await student.matchPassword(password))) {
            res.json({
                _id: student._id,
                fullName: student.fullName,
                studentId: student.studentId,
                branch: student.branch,
                token: generateToken(student._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid Student ID or Password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getStudentProfile = async (req, res) => {
    const student = await Student.findById(req.user._id);

    if (student) {
        res.json({
            _id: student._id,
            fullName: student.fullName,
            studentId: student.studentId,
            branch: student.branch,
            email: student.email,
        });
    } else {
        res.status(404).json({ message: 'Student not found' });
    }
};

export const getStudentDashboard = async (req, res) => {
    try {
        const student = await Student.findById(req.user._id).select('-password');
        const announcements = await Announcement.find({ isActive: true }).sort({ date: -1 }).limit(5);

        if (student) {
            res.json({
                profile: {
                    fullName: student.fullName,
                    studentId: student.studentId,
                    branch: student.branch,
                    email: student.email,
                    profilePhoto: student.profilePhoto,
                },
                biometricLogs: student.biometricLogs,
                academicAttendance: student.academicAttendance,
                examAttempts: student.examAttempts || [],
                announcements: announcements
            });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const markBiometricAttendance = async (req, res) => {
    return res.status(403).json({ message: "Access denied. Student self-attendance marking is disabled." });
};

const old_markBiometricAttendance = async (req, res) => {
    const { location, deviceId } = req.body;

    try {
        const student = await Student.findById(req.user._id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Robust check: Ensure array exists and is usable.
        const logs = student.biometricLogs ? student.biometricLogs : [];

        // Use standard array logic on a plain array copy to check for dupes
        const logsArray = Array.isArray(logs) ? logs : [];
        if (!student.biometricLogs) student.biometricLogs = []; // ensure initialized in doc

        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const existingLog = logsArray.find(log => {
            const logTime = new Date(log.timestamp);
            return logTime >= startOfDay && logTime <= endOfDay;
        });

        if (existingLog) {
            return res.status(400).json({ message: 'Attendance already marked for today' });
        }

        const newLog = {
            timestamp: new Date(),
            device: deviceId || 'WEB-SIMULATOR',
            status: 'Success'
        };

        // Use atomic update to avoid Mongoose array issues
        const updatedStudent = await Student.findByIdAndUpdate(
            req.user._id,
            { $push: { biometricLogs: newLog } },
            { new: true }
        );

        res.status(200).json({
            message: 'Biometric Attendance Marked Successfully',
            log: newLog
        });

    } catch (error) {
        console.error("Biometric Error:", error);
        res.status(500).json({ message: error.message });
    }
};
