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
app.use(express.json());

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
