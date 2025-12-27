import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
    try{
        const con = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDb connected: ${con.connection.host}`);
    }
    catch(err: unknown){
        const errorMessage  = err instanceof Error ? err.message : String(err);
        console.log("Mongodb connection error:", errorMessage );
    }
}