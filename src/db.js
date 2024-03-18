import { connect } from 'mongoose';

export const connectDB = async () => {
    try{
        await connect("mongodb://127.0.0.1:27017/ecommerce?retryWrites=true&w=majority")
        console.log("Connected to MongoDB");
    } catch(error) {
        console.error("Error connecting to MongoDB", error);
        process.exit();
    }
}