import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Student from './models/Student.js';
import Faculty from './models/Faculty.js';
import Result from './models/Result.js';
import Exam from './models/Exam.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const BRANCH_SUBJECTS = {
    'CSE': [
        { name: 'Biology for Engineers', total: 30, attended: 28 },
        { name: 'Advanced Computer Architecture', total: 42, attended: 35 },
        { name: 'Cyber Security', total: 38, attended: 32 },
        { name: 'Virtual Reality', total: 40, attended: 36 },
        { name: 'Induction Program', total: 45, attended: 39 }
    ],
    'ECE': [
        { name: 'Wireless Communication', total: 45, attended: 40 },
        { name: 'Business Analytics', total: 42, attended: 28 },
        { name: 'Cost Management', total: 30, attended: 25 },
        { name: 'Graduate Employability Skills', total: 38, attended: 34 },
        { name: 'VLSI Technology', total: 40, attended: 37 }
    ],
    'CE': [
        { name: 'Graduate Employability Skills', total: 44, attended: 41 },
        { name: 'Professional Practice, Law & Ethics', total: 40, attended: 30 },
        { name: 'Repair & Rehab of Structures', total: 28, attended: 20 },
        { name: 'Concrete Materials', total: 36, attended: 34 },
        { name: 'Cyber Security', total: 42, attended: 39 }
    ],
    'ME': [
        { name: 'Internal Combustion Engines', total: 46, attended: 42 },
        { name: 'Induction Program', total: 40, attended: 35 },
        { name: 'Renewable Energy Systems', total: 32, attended: 29 },
        { name: 'Automation in Manufacturing', total: 44, attended: 38 },
        { name: 'Operations Research', total: 38, attended: 30 }
    ],
    'EE': [
        { name: 'Power System Protection', total: 45, attended: 41 },
        { name: 'Human Values & Ethics', total: 42, attended: 33 },
        { name: 'Cyber Security', total: 30, attended: 27 },
        { name: 'Virtual Reality', total: 38, attended: 35 },
        { name: 'Electrical Drives', total: 40, attended: 38 }
    ]
};

const seedData = async () => {
    try {
        await Faculty.deleteMany(); // Clear existing data
        await Student.deleteMany(); // Clear existing data
        await Result.deleteMany(); // Clear existing results
        await Exam.deleteMany(); // Clear existing exams

        const students = [
            {
                id: 'PEC/CSE/22/045',
                name: 'Bhaskar Jha',
                branch: 'CSE',
                subjects: BRANCH_SUBJECTS['CSE'],
                profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
            },
            {
                id: 'PEC/ECE/22/101',
                name: 'Rohan Verma',
                branch: 'ECE',
                subjects: BRANCH_SUBJECTS['ECE'],
                profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
            },
            {
                id: 'PEC/ME/22/205',
                name: 'Amit Kumar',
                branch: 'ME',
                subjects: BRANCH_SUBJECTS['ME'],
                profilePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200'
            },
            {
                id: 'PEC/CE/22/312',
                name: 'Priya Singh',
                branch: 'CE',
                subjects: BRANCH_SUBJECTS['CE'],
                profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
            },
            {
                id: 'PEC/EE/22/408',
                name: 'Neha Gupta',
                branch: 'EE',
                subjects: BRANCH_SUBJECTS['EE'],
                profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200'
            }
        ];

        for (const s of students) {
            const student = new Student({
                fullName: s.name,
                studentId: s.id,
                email: `${s.id.toLowerCase().replace(/\//g, '.')}@pce.edu`,
                branch: s.branch,
                profilePhoto: s.profilePhoto,
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
            isAdmin: true,
            subjects: ["Advanced Computer Architecture", "Cyber Security"]
        });
        await faculty.save();
        console.log(`Created Faculty: ${faculty.fullName}`);

        const faculty2 = new Faculty({
            fullName: "Dr. Ravi Kumar",
            email: "faculty2@pce.edu",
            password: "password123",
            department: "CSE",
            designation: "Associate Professor",
            isAdmin: false,
            subjects: ["Virtual Reality", "Biology for Engineers"]
        });
        await faculty2.save();
        console.log(`Created Faculty: ${faculty2.fullName}`);

        // Seed Mock Exams
        const sampleExams = [
            {
                title: "Advanced Computer Architecture",
                branch: "CSE",
                duration: 300,
                questions: [
                    {
                        question: "Which of the following is a primary type of computer memory?",
                        options: ["RAM", "CPU", "GPU", "ALU"],
                        correct: 0,
                        explanation: "RAM (Random Access Memory) is a primary type of computer memory used to store active data."
                    },
                    {
                        question: "What does CPU stand for?",
                        options: ["Central Processing Unit", "Computer Personal Unit", "Central Process Utility", "Control Power Unit"],
                        correct: 0,
                        explanation: "CPU stands for Central Processing Unit, the primary component that performs instruction processing."
                    },
                    {
                        question: "Cache memory operates at a higher speed than main memory (RAM).",
                        options: ["True", "False"],
                        correct: 0,
                        explanation: "True. Cache memory is located directly on or near the processor chip and runs much faster than RAM."
                    }
                ]
            },
            {
                title: "Cyber Security",
                branch: "CSE",
                duration: 300,
                questions: [
                    {
                        question: "What does AES stand for in cryptography?",
                        options: ["Advanced Encryption Standard", "Algorithmic Encryption System", "Automated Escrow Service", "Advanced Escrow System"],
                        correct: 0,
                        explanation: "AES stands for Advanced Encryption Standard, a symmetric block cipher standard."
                    },
                    {
                        question: "Which key is used to decrypt a message in asymmetric public-key cryptography?",
                        options: ["Private Key", "Public Key", "Shared Key", "Session Key"],
                        correct: 0,
                        explanation: "In public-key cryptography, a private key is kept secret and used to decrypt messages encrypted with the public key."
                    },
                    {
                        question: "What is the primary function of a Network Firewall?",
                        options: ["Filter incoming/outgoing traffic", "Speed up internet connection", "Generate system backups", "Scan local files for viruses"],
                        correct: 0,
                        explanation: "A firewall monitors and filters network traffic based on established security rules."
                    }
                ]
            },
            {
                title: "Engineering Mathematics Basic Quiz",
                branch: "default",
                duration: 300,
                questions: [
                    {
                        question: "What is the derivative of x^2 with respect to x?",
                        options: ["2x", "x", "2", "x/2"],
                        correct: 0,
                        explanation: "Using the power rule, d/dx (x^n) = n * x^(n-1), so d/dx (x^2) = 2x."
                    },
                    {
                        question: "What is the value of cos(0)?",
                        options: ["1", "0", "-1", "0.5"],
                        correct: 0,
                        explanation: "The cosine of 0 degrees or radians is equal to 1."
                    }
                ]
            }
        ];

        for (const examData of sampleExams) {
            const exam = new Exam(examData);
            await exam.save();
        }
        console.log("Seeded default practice exams!");

        console.log('✅ Data Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
