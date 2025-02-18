import app from "./src/app.js";
import dotenv from 'dotenv';
import connectDB from './src/db/db.js';

dotenv.config();

console.log("MongoDB URI:", process.env.MONGODB_URI);

connectDB()
.then(()=>{
    console.log("MongoDB connected successfully");
    app.listen(process.env.PORT || 3500, ()=>{
        console.log(`Server running at http://localhost:${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("MONGODB connection FAILED", error);
    process.exit(1)
})