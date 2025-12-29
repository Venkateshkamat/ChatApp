import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("Mongodb URI not set in environment");
    }
    const con = await mongoose.connect(mongoUri);
    console.log(`MongoDb connected: ${con.connection.host}`);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.log("Mongodb connection error:", errorMessage);
  }
};
