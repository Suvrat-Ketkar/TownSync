import express from 'express';
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from './routes/users.routes.js';
import complaintRouter from './routes/complaint.routes.js';
import authRouter from './routes/auth.routes.js'
import { errorHandler } from './middleware/errorHandler.middleware.js';
import cron from 'node-cron';
import { generateDailyStatistics } from './controllers/statisticsController.js';

const app = express();

// Configure CORS with specific origin and credentials
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"], // Allow multiple frontend URLs
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use('/api/v1', userRouter);
app.use('/api/v1/complaints', complaintRouter);
app.use('/api/v1/auth', authRouter);
// Schedule job to run at midnight every day
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily statistics generation job');
  try {
    await generateDailyStatistics();
    console.log('Daily statistics generated successfully');
  } catch (error) {
    console.error('Error generating daily statistics:', error);
  }
});

// Error handler (should be the last middleware)
app.use(errorHandler);

export default app;