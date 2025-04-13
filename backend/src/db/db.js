import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const uri=`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qcrf9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
    const connection = await mongoose.connect(uri);
    console.log(`\n MongoDB connected! Host: ${connection.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection FAILED", err);
    process.exit(1);
  }
};
export default connectDB