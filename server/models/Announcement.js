import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['General', 'Exam', 'Holiday', 'Urgent'],
        default: 'General'
    },
    date: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;
