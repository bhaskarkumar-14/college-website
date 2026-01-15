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
            { name: 'Adv. Computer Architecture', total: 42, attended: 35 },
            { name: 'Network Security', total: 38, attended: 32 },
            { name: 'Biology for Engineers', total: 30, attended: 28 },
            { name: 'Cloud Computing', total: 40, attended: 36 },
            { name: 'IoT', total: 45, attended: 39 }
        ],
        'ECE': [
            { name: 'Wireless Communication', total: 45, attended: 40 },
            { name: 'VLSI Technology', total: 42, attended: 28 },
            { name: 'Biology for Engineers', total: 30, attended: 25 },
            { name: 'Optical Fibre Comm', total: 38, attended: 34 },
            { name: 'Info Theory & Coding', total: 40, attended: 37 }
        ],
        'CE': [
            { name: 'Environmental Engg II', total: 44, attended: 41 },
            { name: 'Foundation Engg', total: 40, attended: 30 },
            { name: 'Biology for Engineers', total: 28, attended: 20 },
            { name: 'Metro Systems', total: 36, attended: 34 },
            { name: 'Pavement Design', total: 42, attended: 39 }
        ],
        'ME': [
            { name: 'IC Engines', total: 46, attended: 42 },
            { name: 'Automation in Mfg', total: 40, attended: 35 },
            { name: 'Biology for Engineers', total: 32, attended: 29 },
            { name: 'Power Plant Engg', total: 44, attended: 38 },
            { name: 'Operations Research', total: 38, attended: 30 }
        ],
        'EE': [
            { name: 'Electrical Drives', total: 45, attended: 41 },
            { name: 'Power System III', total: 42, attended: 33 },
            { name: 'Biology for Engineers', total: 30, attended: 27 },
            { name: 'High Voltage Engg', total: 38, attended: 35 },
            { name: 'Digital Control Sys', total: 40, attended: 38 }
        ],
        'default': [
            { name: 'Biology for Engineers', total: 30, attended: 25 },
            { name: 'Open Elective I', total: 40, attended: 35 }
        ]
    },
    '2023-27': { // 5th Semester
        'CSE': [
            { name: 'DBMS', total: 45, attended: 40 },
            { name: 'Formal Language & Automata', total: 42, attended: 38 },
            { name: 'Computer Networks', total: 40, attended: 35 },
            { name: 'Software Engineering', total: 38, attended: 30 },
            { name: 'Microprocessors', total: 36, attended: 32 },
            { name: 'Python Programming', total: 30, attended: 28 }
        ],
        'ECE': [
            { name: 'Digital Signal Processing', total: 45, attended: 40 },
            { name: 'Microprocessors & Microcontrollers', total: 42, attended: 38 },
            { name: 'Control Systems', total: 40, attended: 35 },
            { name: 'Electromagnetic Waves', total: 36, attended: 32 },
            { name: 'Antenna & Wave Prop', total: 38, attended: 33 }
        ],
        'ME': [
            { name: 'Heat & Mass Transfer', total: 45, attended: 40 },
            { name: 'Theory of Machines', total: 42, attended: 38 },
            { name: 'Design of Machine Elements', total: 40, attended: 35 },
            { name: 'Manufacturing Processes', total: 38, attended: 30 },
            { name: 'IC Engines', total: 36, attended: 32 }
        ],
        'CE': [
            { name: 'Geotechnical Engg I', total: 45, attended: 40 },
            { name: 'Structural Analysis', total: 42, attended: 38 },
            { name: 'Design of Concrete Structures', total: 40, attended: 35 },
            { name: 'Environmental Engg', total: 38, attended: 30 },
            { name: 'Transportation Engg', total: 36, attended: 32 }
        ],
        'EE': [
            { name: 'Power Systems I', total: 45, attended: 40 },
            { name: 'Control Systems', total: 42, attended: 38 },
            { name: 'Microprocessors', total: 40, attended: 35 },
            { name: 'Electrical Machines II', total: 38, attended: 30 },
            { name: 'Power Electronics', total: 36, attended: 32 }
        ],
        'default': [
            { name: 'Constitution of India', total: 20, attended: 18 }
        ]
    },
    '2024-28': { // 3rd Semester
        'CSE': [
            { name: 'Data Structures & Algo', total: 50, attended: 45 },
            { name: 'Object Oriented Prog (C++)', total: 48, attended: 42 },
            { name: 'Digital Electronics', total: 45, attended: 40 },
            { name: 'Analog Electronic Circuits', total: 40, attended: 35 },
            { name: 'Mathematics III', total: 40, attended: 35 }
        ],
        'ECE': [
            { name: 'Network Theory', total: 48, attended: 42 },
            { name: 'Signals & Systems', total: 45, attended: 40 },
            { name: 'Digital Electronics', total: 45, attended: 38 },
            { name: 'Electronic Devices', total: 42, attended: 39 },
            { name: 'Mathematics III', total: 40, attended: 35 }
        ],
        'ME': [
            { name: 'Thermodynamics', total: 48, attended: 42 },
            { name: 'Strength of Materials', total: 45, attended: 40 },
            { name: 'Engineering Materials', total: 45, attended: 38 },
            { name: 'Kinematics of Machinery', total: 42, attended: 39 },
            { name: 'Mathematics III', total: 40, attended: 35 }
        ],
        'CE': [
            { name: 'Surveying & Geomatics', total: 48, attended: 42 },
            { name: 'Fluid Mechanics', total: 45, attended: 40 },
            { name: 'Basic Electronics', total: 45, attended: 38 },
            { name: 'Engineering Geology', total: 42, attended: 39 },
            { name: 'Mathematics III', total: 40, attended: 35 }
        ],
        'EE': [
            { name: 'Circuit Analysis', total: 48, attended: 42 },
            { name: 'Electrical Machines I', total: 45, attended: 40 },
            { name: 'Digital Electronics', total: 45, attended: 38 },
            { name: 'Analog Electronics', total: 42, attended: 39 },
            { name: 'Mathematics III', total: 40, attended: 35 }
        ],
        'default': [
            { name: 'Mathematics III', total: 40, attended: 35 },
            { name: 'Technical Writing', total: 30, attended: 28 }
        ]
    },
    '2025-29': { // 1st Semester (Common)
        'default': [
            { name: 'Engineering Mathematics I', total: 45, attended: 42 },
            { name: 'Engineering Physics', total: 40, attended: 38 },
            { name: 'Basic Electrical Engg', total: 42, attended: 39 },
            { name: 'Engineering Graphics', total: 38, attended: 35 },
            { name: 'Environmental Studies', total: 30, attended: 28 }
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
                },
                biometricLogs: student.biometricLogs,
                academicAttendance: student.academicAttendance,
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
