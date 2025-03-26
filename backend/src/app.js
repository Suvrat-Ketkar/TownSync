import express from 'express';
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from './routes/users.routes.js';
import complaintRouter from './routes/complaint.routes.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';

const app = express();

// Configure CORS with specific origin and credentials
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"], // Allow multiple frontend URLs
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use('/api/v1', userRouter);
app.use('/api/v1/complaints', complaintRouter);

// Error handler (should be the last middleware)
app.use(errorHandler);

export default app;