import Faculty from '../models/Faculty.js';
import Student from '../models/Student.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d',
    });
};

export const registerFaculty = async (req, res) => {
    const { fullName, email, password, department, designation } = req.body;

    try {
        const facultyExists = await Faculty.findOne({ email });

        if (facultyExists) {
            return res.status(400).json({ message: 'Faculty already registered' });
        }

        const faculty = await Faculty.create({
            fullName,
            email,
            password,
            department,
            designation
        });

        if (faculty) {
            res.status(201).json({
                _id: faculty._id,
                fullName: faculty.fullName,
                email: faculty.email,
                role: 'Faculty',
                token: generateToken(faculty._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid faculty data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginFaculty = async (req, res) => {
    const { email, password } = req.body;

    try {
        const faculty = await Faculty.findOne({ email });

        if (faculty && (await faculty.matchPassword(password))) {
            res.json({
                _id: faculty._id,
                fullName: faculty.fullName,
                email: faculty.email,
                department: faculty.department,
                role: 'Faculty',
                token: generateToken(faculty._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid Email or Password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Faculty Management Features ---

export const getStudentsByFilter = async (req, res) => {
    const { branch, session } = req.query;
    try {
        const query = {};
        if (branch) query.branch = branch;
        if (session) query.session = session;

        const students = await Student.find(query).select('-password');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateStudentAttendance = async (req, res) => {
    const { studentId, subjectName, incrementAttended, incrementTotal } = req.body;
    // incrementAttended/Total should be booleans, or explicit numbers to add.
    // Let's assume we pass { attended: 1, total: 1 } to add 1 to each.

    try {
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const subjectIndex = student.academicAttendance.findIndex(s => s.subjectName === subjectName);

        if (subjectIndex === -1) {
            // Add new subject if not exists (Syllabus Management)
            student.academicAttendance.push({
                subjectName,
                totalLectures: incrementTotal || 0,
                attendedLectures: incrementAttended || 0,
                lastAttended: new Date()
            });
        } else {
            if (incrementTotal) student.academicAttendance[subjectIndex].totalLectures += incrementTotal;
            if (incrementAttended) {
                student.academicAttendance[subjectIndex].attendedLectures += incrementAttended;
                student.academicAttendance[subjectIndex].lastAttended = new Date();
            }
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            studentId,
            { academicAttendance: student.academicAttendance },
            { new: true }
        );

        res.json(updatedStudent);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const modifyStudentSubject = async (req, res) => {
    const { studentId, subjectName, action, totalLectures } = req.body;
    // action: 'add' or 'remove'

    try {
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        if (action === 'remove') {
            student.academicAttendance = student.academicAttendance.filter(sub => sub.subjectName !== subjectName);
        } else if (action === 'add') {
            // Check if exists
            const exists = student.academicAttendance.find(sub => sub.subjectName === subjectName);
            if (exists) return res.status(400).json({ message: 'Subject already exists' });

            student.academicAttendance.push({
                subjectName,
                totalLectures: totalLectures || 40,
                attendedLectures: 0,
                lastAttended: new Date()
            });
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            studentId,
            { academicAttendance: student.academicAttendance },
            { new: true }
        );

        res.json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
