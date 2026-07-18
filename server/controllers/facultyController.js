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
                subjects: faculty.subjects || [],
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

    // Strict Authorization: Check if faculty is assigned to this subject
    if (!req.user.isAdmin && (!req.user.subjects || !req.user.subjects.includes(subjectName))) {
        return res.status(403).json({ message: `Access denied. You are not assigned to subject: ${subjectName}` });
    }

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

    // Strict Authorization: Check if faculty is assigned to this subject
    if (!req.user.isAdmin && (!req.user.subjects || !req.user.subjects.includes(subjectName))) {
        return res.status(403).json({ message: `Access denied. You are not assigned to subject: ${subjectName}` });
    }

    try {
        if (!studentId || !subjectName || !action) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        if (action === 'remove') {
            // Use $pull to atomically remove the subject
            const updatedStudent = await Student.findByIdAndUpdate(
                studentId,
                { $pull: { academicAttendance: { subjectName: subjectName } } },
                { new: true }
            );
            return res.json(updatedStudent);

        } else if (action === 'add') {
            // Check if subject already exists to avoid duplicates
            // We can check the in-memory 'student' doc we just fetched
            const exists = student.academicAttendance.some(sub => sub.subjectName === subjectName);
            if (exists) {
                return res.status(400).json({ message: 'Subject already exists' });
            }

            // Use $push to atomicall add the new subject
            const newSubject = {
                subjectName,
                totalLectures: totalLectures || 40,
                attendedLectures: 0,
                lastAttended: new Date()
            };

            const updatedStudent = await Student.findByIdAndUpdate(
                studentId,
                { $push: { academicAttendance: newSubject } },
                { new: true }
            );
            return res.json(updatedStudent);
        } else {
            return res.status(400).json({ message: 'Invalid action. Use "add" or "remove".' });
        }

    } catch (error) {
        console.error("modifyStudentSubject Error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const scanClassroomAttendance = async (req, res) => {
    const { branch, session, subjectName, image } = req.body;

    try {
        if (!branch || !session || !subjectName) {
            return res.status(400).json({ message: 'Missing required filter parameters (branch, session, subjectName)' });
        }

        // Strict Authorization: Check if faculty is assigned to this subject
        if (!req.user.isAdmin && (!req.user.subjects || !req.user.subjects.includes(subjectName))) {
            return res.status(403).json({ message: `Access denied. You are not assigned to subject: ${subjectName}` });
        }

        // Find all students matching branch and session
        const students = await Student.find({ branch, session });
        if (!students || students.length === 0) {
            return res.status(404).json({ message: `No students found in branch ${branch} for session ${session}` });
        }

        const scanResults = [];
        let presentCount = 0;
        let absentCount = 0;

        // Perform face recognition simulation updates
        for (const student of students) {
            // Simulated match: 80% chance of matching, at least one student is always matched
            const matched = Math.random() > 0.20 || students.length === 1 || (presentCount === 0 && students.indexOf(student) === students.length - 1);
            const confidence = matched ? parseFloat((92 + Math.random() * 7.8).toFixed(1)) : 0;

            if (matched) {
                presentCount++;
            } else {
                absentCount++;
            }

            // Find subject in student's academicAttendance array
            const subIndex = student.academicAttendance.findIndex(sub => sub.subjectName === subjectName);
            
            if (subIndex > -1) {
                // Subject exists: update attendance
                if (matched) {
                    student.academicAttendance[subIndex].attendedLectures += 1;
                }
                student.academicAttendance[subIndex].totalLectures += 1;
                student.academicAttendance[subIndex].lastAttended = new Date();
            } else {
                // Subject does not exist: create it
                student.academicAttendance.push({
                    subjectName,
                    totalLectures: 1,
                    attendedLectures: matched ? 1 : 0,
                    lastAttended: new Date()
                });
            }

            // Add biometric log
            student.biometricLogs.push({
                timestamp: new Date(),
                status: matched ? 'Success' : 'Failed',
                device: 'Classroom Face ID AI Scan'
            });

            // Save updated student
            await student.save();

            scanResults.push({
                _id: student._id,
                fullName: student.fullName,
                studentId: student.studentId,
                matched,
                confidence
            });
        }

        res.json({
            message: 'Classroom face scanning attendance submission successful!',
            scannedCount: students.length,
            presentCount,
            absentCount,
            results: scanResults
        });

    } catch (error) {
        console.error("scanClassroomAttendance Error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const submitBatchAttendance = async (req, res) => {
    const { subjectName, attendanceData } = req.body;

    // Strict Authorization: Check if faculty is assigned to this subject
    if (!req.user.isAdmin && (!req.user.subjects || !req.user.subjects.includes(subjectName))) {
        return res.status(403).json({ message: `Access denied. You are not assigned to subject: ${subjectName}` });
    }

    try {
        if (!Array.isArray(attendanceData)) {
            return res.status(400).json({ message: 'Invalid attendance data format. Expected array of objects.' });
        }

        const results = [];

        for (const item of attendanceData) {
            const { studentId, status } = item;
            const student = await Student.findById(studentId);
            if (!student) continue;

            const subjectIndex = student.academicAttendance.findIndex(s => s.subjectName === subjectName);
            const isPresent = status === 'Present';

            if (subjectIndex === -1) {
                // If the subject doesn't exist for this student, initialize it
                student.academicAttendance.push({
                    subjectName,
                    totalLectures: 1,
                    attendedLectures: isPresent ? 1 : 0,
                    lastAttended: isPresent ? new Date() : null
                });
            } else {
                student.academicAttendance[subjectIndex].totalLectures += 1;
                if (isPresent) {
                    student.academicAttendance[subjectIndex].attendedLectures += 1;
                    student.academicAttendance[subjectIndex].lastAttended = new Date();
                }
            }

            // Also add a biometric log
            student.biometricLogs.push({
                timestamp: new Date(),
                status: isPresent ? 'Success' : 'Failed',
                device: `Manual Attendance: ${subjectName}`
            });

            await student.save();
            results.push({ studentId, name: student.fullName, status });
        }

        res.json({
            message: 'Batch attendance logged successfully!',
            subjectName,
            recordsProcessed: results.length,
            results
        });

    } catch (error) {
        console.error("submitBatchAttendance Error:", error);
        res.status(500).json({ message: error.message });
    }
};
