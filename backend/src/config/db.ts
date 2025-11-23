import { Pool } from 'pg';
import dotenv from "dotenv";
dotenv.config();


const ConnStr = process.env.DATABASE_URL;

export const pool = new Pool({
    connectionString:ConnStr,
    ssl:{
        rejectUnauthorized: false 
    }
});

export async function testConnection(): Promise<void>{
    try {
        const client = await pool.connect();
        await client.query('SELECT 1');
        client.release();
        console.log("Connected to Postgrase (Neon)");
    } catch (error) {
        console.error("Data connection error",error);
        throw error;
    }
}