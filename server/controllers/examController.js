import Exam from '../models/Exam.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');

// @desc    Get all exams for a student's branch or all exams if faculty
// @route   GET /api/auth/exams
// @access  Private (Student/Faculty)
export const getExams = async (req, res) => {
    try {
        if (req.role === 'Faculty') {
            const exams = await Exam.find({});
            return res.json(exams);
        } else {
            // Student: filter by their branch or default branch
            const exams = await Exam.find({
                $or: [
                    { branch: req.user.branch },
                    { branch: 'default' }
                ]
            });
            return res.json(exams);
        }
    } catch (error) {
        console.error("Get exams error:", error);
        return res.status(500).json({ message: "Server error fetching exams" });
    }
};

// @desc    Create a new practice exam
// @route   POST /api/auth/faculty/exams
// @access  Private (Faculty only)
export const createExam = async (req, res) => {
    const { title, branch, duration, questions } = req.body;

    if (!title || !branch || !duration || !questions || !Array.isArray(questions)) {
        return res.status(400).json({ message: "Missing required fields or invalid format" });
    }

    try {
        const exam = new Exam({
            title,
            branch,
            duration, // in seconds
            questions
        });

        const savedExam = await exam.save();
        return res.status(201).json(savedExam);
    } catch (error) {
        console.error("Create exam error:", error);
        return res.status(500).json({ message: error.message || "Server error creating exam" });
    }
};

// @desc    Delete an exam
// @route   DELETE /api/auth/faculty/exams/:id
// @access  Private (Faculty only)
export const deleteExam = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        await exam.deleteOne();
        return res.json({ message: "Exam deleted successfully" });
    } catch (error) {
        console.error("Delete exam error:", error);
        return res.status(500).json({ message: "Server error deleting exam" });
    }
};

// @desc    Submit student exam results attempt
// @route   POST /api/auth/exams/submit
// @access  Private (Student only)
export const submitExamAttempt = async (req, res) => {
    const { examId, examTitle, score, totalQuestions, timeTaken, attemptedCount } = req.body;

    if (!examId || !examTitle || score === undefined || !totalQuestions) {
        return res.status(400).json({ message: "Missing required fields for exam submission" });
    }

    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }

        // Initialize examAttempts array if not exists
        if (!req.user.examAttempts) {
            req.user.examAttempts = [];
        }

        req.user.examAttempts.push({
            examId,
            examTitle,
            score,
            totalQuestions,
            timeTaken: timeTaken || 0,
            attemptedCount: attemptedCount || 0,
            submittedAt: new Date()
        });

        await req.user.save();
        return res.status(200).json({ message: "Exam result logged successfully", examAttempts: req.user.examAttempts });
    } catch (error) {
        console.error("Submit exam error:", error);
        return res.status(500).json({ message: "Server error logging exam attempt" });
    }
};

// Helper function to parse extracted PDF text into MCQ JSON format
export const parsePdfQuestions = (text) => {
    const lines = text.split(/\r?\n/);
    const questions = [];
    
    let currentQuestion = null;
    let currentOptions = [];
    let currentCorrect = 0;
    let currentExplanation = '';
    let state = 'seeking_question';
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) continue;
        
        // Match standard question headers (e.g., 1. or Q1. or Question 1:)
        const questionMatch = line.match(/^(?:Q|Question\s*)?(\d+)[:\.\-\)]\s*(.*)/i);
        if (questionMatch) {
            if (currentQuestion && currentOptions.length >= 2) {
                while (currentOptions.length < 4) {
                    currentOptions.push(`Option ${currentOptions.length + 1}`);
                }
                currentOptions = currentOptions.slice(0, 4);
                questions.push({
                    question: currentQuestion,
                    options: currentOptions,
                    correct: currentCorrect,
                    explanation: currentExplanation || `Explanation for question ${questions.length + 1}`
                });
            }
            currentQuestion = questionMatch[2].trim();
            currentOptions = [];
            currentCorrect = 0;
            currentExplanation = '';
            state = 'reading_options';
            continue;
        }
        
        // Match option lines (e.g., A) Option text or A. Option text)
        const optionMatch = line.match(/^([A-D]|[a-d])[\)\.]\s*(.*)/);
        if (optionMatch && state === 'reading_options') {
            const optionText = optionMatch[2].trim();
            currentOptions.push(optionText);
            continue;
        }
        
        // Check for inline options on a single line (e.g. A) Option1 B) Option2)
        if (state === 'reading_options') {
            const inlineOptions = line.match(/([A-D])[\)\.]\s*([^A-D\n]+)/g);
            if (inlineOptions && inlineOptions.length >= 2) {
                inlineOptions.forEach(opt => {
                    const m = opt.match(/^([A-D])[\)\.]\s*(.*)/);
                    if (m) {
                        currentOptions.push(m[2].trim());
                    }
                });
                continue;
            }
        }
        
        // Match correct answer designators (e.g., Ans: A or Answer: B)
        const answerMatch = line.match(/^(?:Answer|Ans|Correct(?:\s*Option)?)\s*[:\-\s]\s*([A-D]|[a-d]|\d)/i);
        if (answerMatch) {
            const ansChar = answerMatch[1].toUpperCase();
            if (ansChar === 'A' || ansChar === '1') currentCorrect = 0;
            else if (ansChar === 'B' || ansChar === '2') currentCorrect = 1;
            else if (ansChar === 'C' || ansChar === '3') currentCorrect = 2;
            else if (ansChar === 'D' || ansChar === '4') currentCorrect = 3;
            state = 'reading_explanation';
            continue;
        }
        
        // Match explanation designators (e.g., Explanation: ...)
        const explanationMatch = line.match(/^(?:Explanation|Explain|Reason)\s*[:\-\s]\s*(.*)/i);
        if (explanationMatch) {
            currentExplanation = explanationMatch[1].trim();
            state = 'reading_explanation';
            continue;
        }
        
        // Appending content to state
        if (state === 'reading_explanation') {
            currentExplanation += (currentExplanation ? ' ' : '') + line;
        } else if (state === 'reading_options' && currentOptions.length > 0) {
            currentOptions[currentOptions.length - 1] += ' ' + line;
        } else if (currentQuestion) {
            currentQuestion += ' ' + line;
        }
    }
    
    // Save the last question in progress
    if (currentQuestion && currentOptions.length >= 2) {
        while (currentOptions.length < 4) {
            currentOptions.push(`Option ${currentOptions.length + 1}`);
        }
        currentOptions = currentOptions.slice(0, 4);
        questions.push({
            question: currentQuestion,
            options: currentOptions,
            correct: currentCorrect,
            explanation: currentExplanation || `Explanation for question ${questions.length + 1}`
        });
    }
    
    // Fallback: If no structured questions are found, segment paragraphs into individual question blocks
    if (questions.length === 0) {
        const paragraphs = text.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 10);
        paragraphs.forEach((para, idx) => {
            if (idx < 10) {
                questions.push({
                    question: para.substring(0, 200) + (para.length > 200 ? '...' : ''),
                    options: ["Option A (Edit me)", "Option B (Edit me)", "Option C (Edit me)", "Option D (Edit me)"],
                    correct: 0,
                    explanation: "Automatically extracted text from PDF. Please edit question text and choices."
                });
            }
        });
    }
    
    return questions;
};

// @desc    Parse uploaded question PDF into practice questions
// @route   POST /api/auth/faculty/exams/parse-pdf
// @access  Private (Faculty only)
export const parsePdfExamQuestions = async (req, res) => {
    const { pdfData } = req.body;
    if (!pdfData) {
        return res.status(400).json({ message: "No PDF binary data provided" });
    }
    
    try {
        const cleanBase64 = pdfData.replace(/^data:application\/pdf;base64,/, "");
        const buffer = Buffer.from(cleanBase64, 'base64');
        const uint8Array = new Uint8Array(buffer);
        
        const parser = new PDFParse(uint8Array);
        const result = await parser.getText();
        
        if (!result.text || !result.text.trim()) {
            return res.status(400).json({ message: "Could not extract any text from the uploaded PDF document" });
        }
        
        const parsedQuestions = parsePdfQuestions(result.text);
        
        return res.json({
            message: `Successfully parsed ${parsedQuestions.length} questions from PDF.`,
            questions: parsedQuestions
        });
    } catch (error) {
        console.error("PDF Parsing Error:", error);
        return res.status(500).json({ message: error.message || "Failed to parse PDF document" });
    }
};
