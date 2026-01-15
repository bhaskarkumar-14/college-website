import Announcement from '../models/Announcement.js';

export const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find({ isActive: true }).sort({ date: -1 });
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createAnnouncement = async (req, res) => {
    const { title, message, type } = req.body;
    try {
        const announcement = await Announcement.create({
            title,
            message,
            type
        });
        res.status(201).json(announcement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Announcement.findByIdAndDelete(id);
        if (!result) return res.status(404).json({ message: 'Announcement not found' });
        res.json({ message: 'Announcement removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const seedAnnouncements = async () => {
    const count = await Announcement.countDocuments();
    if (count === 0) {
        const dummyData = [
            {
                title: "Mid-Semester Exams Rescheduled",
                message: "The mid-semester examinations for 5th semester have been rescheduled to start from 15th October.",
                type: "Exam"
            },
            {
                title: "Tech Alegria 2025 Registration",
                message: "Registration for the annual technical fest 'Tech Alegria' is now open. Visit the student council office.",
                type: "General"
            },
            {
                title: "Library Maintenance",
                message: "The central library will remain closed this Saturday for maintenance purposes.",
                type: "General"
            }
        ];
        await Announcement.insertMany(dummyData);
        console.log("Announcements seeded");
    }
};
