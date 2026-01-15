import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Student from './models/Student.js';
import Faculty from './models/Faculty.js';
import Result from './models/Result.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const BRANCH_SUBJECTS = {
    'CSE': [
        { name: 'Adv. Computer Architecture', total: 42, attended: 35 },
        { name: 'Network Security & Cryptography', total: 38, attended: 32 },
        { name: 'Biology for Engineers', total: 30, attended: 28 },
        { name: 'Cloud Computing', total: 40, attended: 36 },
        { name: 'Internet of Things', total: 45, attended: 39 }
    ],
    'ECE': [
        { name: 'Wireless Communication', total: 45, attended: 40 },
        { name: 'VLSI Technology', total: 42, attended: 28 }, // Low attendance example
        { name: 'Biology for Engineers', total: 30, attended: 25 },
        { name: 'Optical Fibre Communication', total: 38, attended: 34 },
        { name: 'Information Theory & Coding', total: 40, attended: 37 }
    ],
    'CE': [
        { name: 'Environmental Engineering II', total: 44, attended: 41 },
        { name: 'Foundation Engineering', total: 40, attended: 30 },
        { name: 'Biology for Engineers', total: 28, attended: 20 },
        { name: 'Metro Systems & Engineering', total: 36, attended: 34 },
        { name: 'Pavement Design', total: 42, attended: 39 }
    ],
    'ME': [
        { name: 'Internal Combustion Engines', total: 46, attended: 42 },
        { name: 'Automation in Manufacturing', total: 40, attended: 35 },
        { name: 'Biology for Engineers', total: 32, attended: 29 },
        { name: 'Power Plant Engineering', total: 44, attended: 38 },
        { name: 'Operations Research', total: 38, attended: 30 }
    ],
    'EE': [
        { name: 'Electrical Drives', total: 45, attended: 41 },
        { name: 'Power System III', total: 42, attended: 33 },
        { name: 'Biology for Engineers', total: 30, attended: 27 },
        { name: 'High Voltage Engineering', total: 38, attended: 35 },
        { name: 'Digital Control System', total: 40, attended: 38 }
    ]
};

const seedData = async () => {
    try {
        await Faculty.deleteMany(); // Clear existing data
        await Student.deleteMany(); // Clear existing data
        await Result.deleteMany(); // Clear existing results

        const students = [
            {
                id: 'PEC/CSE/22/045',
                name: 'Bhaskar Jha',
                branch: 'CSE',
                subjects: BRANCH_SUBJECTS['CSE']
            },
            {
                id: 'PEC/ECE/22/101',
                name: 'Rohan Verma',
                branch: 'ECE',
                subjects: BRANCH_SUBJECTS['ECE']
            },
            {
                id: 'PEC/ME/22/205',
                name: 'Amit Kumar',
                branch: 'ME',
                subjects: BRANCH_SUBJECTS['ME']
            },
            {
                id: 'PEC/CE/22/312',
                name: 'Priya Singh',
                branch: 'CE',
                subjects: BRANCH_SUBJECTS['CE']
            },
            {
                id: 'PEC/EE/22/408',
                name: 'Neha Gupta',
                branch: 'EE',
                subjects: BRANCH_SUBJECTS['EE']
            }
        ];

        for (const s of students) {
            const student = new Student({
                fullName: s.name,
                studentId: s.id,
                email: `${s.id.toLowerCase().replace(/\//g, '.')}@pce.edu`,
                branch: s.branch,
                session: '2022-26',
                password: 'password123',
                biometricLogs: [
                    { timestamp: new Date(), status: 'Success' },
                    { timestamp: new Date(Date.now() - 86400000), status: 'Success' },
                    { timestamp: new Date(Date.now() - 172800000), status: 'Success' },
                ],
                academicAttendance: s.subjects.map(sub => ({
                    subjectName: sub.name,
                    attendedLectures: sub.attended,
                    totalLectures: sub.total,
                    lastAttended: new Date()
                }))
            });
            await student.save();

            // Create Result for student
            const result = new Result({
                rollNo: s.id,
                name: s.name,
                course: `B.Tech (${s.branch})`,
                semester: 'Semester V',
                sgpa: (Math.random() * (9.5 - 7.0) + 7.0).toFixed(2),
                cgpa: (Math.random() * (9.5 - 7.0) + 7.0).toFixed(2),
                status: 'PASS',
                date: '2024-12-15',
                subjects: s.subjects.map(sub => ({
                    code: sub.name.substring(0, 3).toUpperCase() + '101', // Mock code
                    name: sub.name,
                    credits: 3, // Mock credits
                    grade: ['O', 'A+', 'A', 'B+', 'B'][Math.floor(Math.random() * 5)]
                }))
            });
            await result.save();

            console.log(`Created student & result: ${s.name} (${s.branch})`);
        }

        // Seed Faculty
        const faculty = new Faculty({
            fullName: "Dr. Anjali Sharma",
            email: "faculty@pce.edu",
            password: "password123",
            department: "CSE",
            designation: "Assistant Professor",
            isAdmin: true
        });
        await faculty.save();
        console.log(`Created Faculty: ${faculty.fullName}`);

        console.log('✅ Data Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
