import mongoose from 'mongoose';

const DB_URL = process.env.DB_URI || "mongodb://127.0.0.1:27017/ecommerce?retryWrites=true&w=majority";

export const connectDB = async () => {
    try{
        await mongoose.connect(DB_URL);
        console.log("Connected to MongoDB");
    } catch(error) {
        console.error("Error connecting to MongoDB", error);
        process.exit();
    }
}