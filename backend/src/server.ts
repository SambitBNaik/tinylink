import express from "express";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

import { testConnection } from "./config/db";
import app from "./app";
const PORT = process.env.PORT ? Number(process.env.PORT):5000;

const frontendBuildPath = path.join(__dirname,"../../frontend/dist");
app.use(express.static(frontendBuildPath));

app.get(/.*/,(_req,res)=>{
    res.sendFile(path.join(frontendBuildPath,"index.html"));
})

async function start(){
    try {
        await testConnection();
        app.listen(PORT,()=>{
            console.log(`Listining to port ${PORT}`);
            // console.log("Serving frontend from", frontendBuildPath);
        })
    } catch (error) {
        console.error("Failed to start server", error);
        process.exit(1);
    }
}

start();

