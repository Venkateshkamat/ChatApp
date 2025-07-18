import express from "express";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import cors from "cors"

import path from "path";

import dotenv from "dotenv"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser"
import { app, server } from "./lib/socket.js";

dotenv.config()

const PORT = process.env.PORT
const __dirname = path.resolve();

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

if (process.env.NODE_ENV == "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")))
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}

app.use((err, req, res, next) => {
    if (err) {
        res.status(500).json({
            msg: "Caught by global catch",
            err: err
        })
    }
})

server.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
    connectDB();
})