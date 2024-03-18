import { connect } from 'mongoose';

export const connectDB = async () => {
    try{
        await connect("mongodb+srv://abydapra:161199@codercluster.4dplmqx.mongodb.net/?retryWrites=true&w=majority&appName=CoderCluster")
        console.log("Connected to MongoDB");
    } catch(error) {
        console.error("Error connecting to MongoDB", error);
        process.exit();
    }
}