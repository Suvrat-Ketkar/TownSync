import 'dotenv/config';
import express from 'express'
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from './routes/users.routes.js';
import { PORT, NODE_ENV } from './constants/env.js';
import { connectToDB } from './config/db.js'
const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use('/api/v1', userRouter);

app.listen(PORT, async () => {
    console.log(`listening on PORT ${PORT} in ${NODE_ENV} environment`);
    await connectToDB();
    } 
);
export default app;