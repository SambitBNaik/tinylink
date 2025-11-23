import { Request, Response } from "express";
import { LinkModel } from "../models/linkModel";
import { generateCode, isValidCode } from "../utils/codeGen";


const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

export const createLink = async(req:Request, res:Response)=>{
    try {
        const {target_url, code:rawCode} = req.body ?? {};
        if(!target_url || typeof target_url !=="string"){
            return res.status(400).json({ error:"target_url is requird"});
        }
        try {
            const u = new URL(target_url);
            if(u.protocol!=='http:' && u.protocol!=='https:'){
                throw new Error("Invalid protocol");
            }

        } catch (error) {
            return res.status(400).json({error:"Invalid URL"}); 
        }

        let code = rawCode ? String(rawCode).trim() : null;
        if(code){
            if(!CODE_REGEX.test(code)){
                return res.status(400).json({ error:"Code must match [A-Za-z0-9]{6,8}"});
            }
            const existing = await LinkModel.findByCode(code);
            if(existing){
                return res.status(409).json({error:"Code already exists"});
            }
        }else{
            let attempts=0;
            do{
                code = generateCode(6);
                const exists = await LinkModel.findByCode(code);
                if(!exists) break;
                attempts++;
            }while(attempts < 5);
            if(!code) return res.status(500).json({error:"Failed to generate code."});
        }
        const created = await LinkModel.create(code, target_url);
        const base = process.env.BASE_URL ?? `${req.protocol}://${req.get("host")}`;
        return res.status(201).json({
            code:created.code,
            target_url:created.target_url,
            clicks:Number(created.clicks),
            last_clicked:created.last_clicked,
            short_url:`${base}/${created.code}`
        });
    } catch (error) {
        console.error("CreateLink error",error);
        return res.status(500).json({error:"Internal Server Error."});
    }
}

export const listLinks = async(_req: Request, res: Response)=>{
    try {
        const rows = await LinkModel.findAll();
        return res.json(rows);
    } catch (error) {
        console.error("listLinks error:", error);
        return res.status(500).json({ error:"Internal server error"});
    }
}

export const getLink = async(req:Request, res:Response)=>{
    try {
        const code = String(req.params.code);
        if(!isValidCode(code)) return res.status(404).json({ error:"Not found"});
        const row = await LinkModel.findByCode(code);
        if(!row) return res.status(404).json({ error:"Not found"});
        return res.json(row); 
    } catch (error) {
        console.error("getLink error:",error);
        return res.status(500).json({ error:"Internal server error"});
    }
}

export const deleteLink = async(req:Request, res:Response)=>{
    try {
        const code = String(req.params.code);
        const ok = await LinkModel.deleteByCode(code);
        if(!ok) return res.status(404).json({ error:"Not found"});
        return res.status(204).send();
    } catch (error) {
        console.error("deleteLink error:",error);
        res.status(500).json({ error:"Internal server errror"});
    }
}

export const redirectToTarget = async(req:Request, res:Response)=>{
    try {
        const code = String(req.params.code);
        if(!isValidCode(code)) return res.status(404).send("Not found");

        const updated = await LinkModel.incrementClicks(code);
        if(!updated) return res.status(404).send("Not found");

        return res.redirect(302,updated.target_url);
        // return res.status(302).json(updated);
    } catch (error) {
        console.error("redirectToTarget error:",error);
        res.status(500).send("Internal server errror");
    }
}