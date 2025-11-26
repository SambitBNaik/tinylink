
import type { CreateLinkPayload, Linki } from "../types/link";
import axiosInstance from "../utils/axiosInstance";


export const linkService ={
    async getAllLinks():Promise<Linki[]>{
        const res = await axiosInstance.get<Linki[]>("/links");
        return res.data;
    },

    async  getLinkStats(code: string):Promise<Linki>{
        const res = await axiosInstance.get<Linki>(`/links/${code}`);
        return res.data;
    },

    async createLink(payload: CreateLinkPayload):Promise<Linki>{
        const res = await axiosInstance.post<Linki>("/links",payload);
        return res.data;
    },

    async deleteLinks(code: string): Promise<void>{
        await axiosInstance.delete(`/links/${code}`);
    },

    async redirectToTarget(code:string):Promise<Linki>{
        const res =await axiosInstance.get<Linki>(`/${code}`);
        return res.data;
    }
}