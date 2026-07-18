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
    profilePhoto: {
        type: String,
        default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
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
    examAttempts: [{
        examId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Exam'
        },
        examTitle: String,
        score: Number,
        totalQuestions: Number,
        timeTaken: Number,
        attemptedCount: Number,
        submittedAt: {
            type: Date,
            default: Date.now
        }
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
studentSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
