import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';

const verifyToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
};

// Protect routes for Students
const protectStudent = async (req, res, next) => {
    let token = verifyToken(req);

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
            req.user = await Student.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, student not found' });
            }
            req.role = 'Student';
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Protect routes for Faculty
const protectFaculty = async (req, res, next) => {
    let token = verifyToken(req);

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
            req.user = await Faculty.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, faculty not found' });
            }
            req.role = 'Faculty';
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Protect routes for Both (e.g., viewing announcements)
const protectAny = async (req, res, next) => {
    let token = verifyToken(req);

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

            // Try matching Student
            const student = await Student.findById(decoded.id).select('-password');
            if (student) {
                req.user = student;
                req.role = 'Student';
                return next();
            }

            // Try matching Faculty
            const faculty = await Faculty.findById(decoded.id).select('-password');
            if (faculty) {
                req.user = faculty;
                req.role = 'Faculty';
                return next();
            }

            return res.status(401).json({ message: 'Not authorized, user not found' });

        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export { protectStudent, protectFaculty, protectAny };
