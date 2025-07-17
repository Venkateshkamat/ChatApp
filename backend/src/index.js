import express from "express";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import cors from "cors"

import dotenv from "dotenv"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser"
import { app, server } from "./lib/socket.js";

dotenv.config()

const PORT = process.env.PORT

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

app.use((err,req,res,next)=>{
    if(err){
        res.status(500).json({
            msg:"Caught by global catch",
            err:err
        })
    }
})

server.listen(PORT,()=>{
    console.log("server is running on PORT:" +PORT);
    connectDB();
})