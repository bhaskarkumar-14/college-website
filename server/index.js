import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import { seedAnnouncements } from './controllers/announcementController.js';
import resultRoutes from './routes/result.js';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';

dotenv.config();

// Connect to MongoDB
connectDB().then(() => {
    seedAnnouncements();
});

// Custom MongoDB Sanitizer middleware (Express 5 compatible)
const sanitizeObject = (obj) => {
    if (obj && typeof obj === 'object') {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                if (key.startsWith('$') || key.includes('.')) {
                    delete obj[key];
                } else {
                    sanitizeObject(obj[key]);
                }
            }
        }
    }
};

const customMongoSanitize = (req, res, next) => {
    if (req.body) sanitizeObject(req.body);
    if (req.params) sanitizeObject(req.params);
    if (req.query) {
        for (const key in req.query) {
            if (Object.prototype.hasOwnProperty.call(req.query, key)) {
                if (key.startsWith('$') || key.includes('.')) {
                    delete req.query[key];
                } else if (req.query[key] && typeof req.query[key] === 'object') {
                    sanitizeObject(req.query[key]);
                }
            }
        }
    }
    next();
};

// Custom XSS Sanitizer middleware (Express 5 compatible)
const cleanString = (val) => {
    if (typeof val === 'string') {
        return val
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
    }
    return val;
};

const sanitizeXssObject = (obj) => {
    if (obj && typeof obj === 'object') {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                if (key === 'pdfData') continue;
                if (typeof obj[key] === 'string') {
                    obj[key] = cleanString(obj[key]);
                } else if (typeof obj[key] === 'object') {
                    sanitizeXssObject(obj[key]);
                }
            }
        }
    }
};

const customXssSanitize = (req, res, next) => {
    if (req.body) sanitizeXssObject(req.body);
    if (req.params) sanitizeXssObject(req.params);
    if (req.query) {
        for (const key in req.query) {
            if (Object.prototype.hasOwnProperty.call(req.query, key)) {
                if (typeof req.query[key] === 'string') {
                    req.query[key] = cleanString(req.query[key]);
                } else if (typeof req.query[key] === 'object') {
                    sanitizeXssObject(req.query[key]);
                }
            }
        }
    }
    next();
};

const app = express();

// Security Middleware (Headers)
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 3000,
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Standard Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Prevent NoSQL query injection (Express 5 compatible)
app.use(customMongoSanitize);

// Prevent XSS attacks (Express 5 compatible)
app.use(customXssSanitize);

// Security Middleware (Body Sanitization)
app.use(hpp());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/results', resultRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('PCE API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
