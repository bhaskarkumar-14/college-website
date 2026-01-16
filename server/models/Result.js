import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    credits: { type: Number, required: true },
    grade: { type: String, required: true }
});

const resultSchema = new mongoose.Schema({
    rollNo: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    name: { type: String, required: true },
    course: { type: String, required: true },
    semester: { type: String, required: true },
    status: { type: String, required: true, default: 'PASS' },
    date: { type: String, required: true }, // Keeping as string for now to match frontend display ease, or could be Date
    sgpa: { type: Number, required: true },
    cgpa: { type: Number, required: true },
    subjects: [subjectSchema],
    createdAt: { type: Date, default: Date.now }
});

const Result = mongoose.model('Result', resultSchema);

export default Result;
