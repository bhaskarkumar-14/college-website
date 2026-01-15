import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const studentSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    studentId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    branch: {
        type: String,
        required: true
    },
    session: {
        type: String,
        required: true,
        enum: ['2022-26', '2023-27', '2024-28', '2025-29']
    },
    password: {
        type: String,
        required: true
    },
    biometricLogs: [{
        timestamp: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['Success', 'Failed'],
            default: 'Success'
        },
        device: {
            type: String,
            default: 'Biometric Scanner A-1'
        }
    }],
    academicAttendance: [{
        subjectName: String,
        totalLectures: Number,
        attendedLectures: Number,
        lastAttended: Date
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Match user entered password to hashed password in database
studentSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
studentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
