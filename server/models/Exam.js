import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true
    },
    correct: {
        type: Number,
        required: true
    },
    explanation: {
        type: String,
        required: true
    }
});

const examSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true,
        enum: ['CSE', 'ECE', 'ME', 'CE', 'EE', 'default']
    },
    duration: {
        type: Number,
        required: true,
        default: 300 // in seconds
    },
    questions: {
        type: [questionSchema],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Exam = mongoose.model('Exam', examSchema);

export default Exam;
