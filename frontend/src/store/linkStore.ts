import { create } from "zustand";
import { linkService } from "../services/linkService";
import type { CreateLinkPayload, Linki } from "../types/link";

interface LinkStore {
  links: Linki[];
  selectedLink: Linki | null;
  redirectLink: Linki | null;
  loading: boolean;
  error: string | null;

  fetchLinks: () => Promise<void>;
  fetchLinkStats: (code: string) => Promise<void>;
  createLink: (payload: CreateLinkPayload) => Promise<Linki>;
  deleteLink: (code: string) => Promise<void>;
  redirectTotarget : (code:string) =>Promise<void>;
}
export const useLinkStore = create<LinkStore>((set, get)=>({
    links: [],
    selectedLink: null,
    redirectLink:null,
    loading: false,
    error: null,

    fetchLinks: async() =>{
        try {
            set({loading: true, error:null});
            const data = await linkService.getAllLinks();
            set({ links:data, loading:false});
        } catch (error) {
            set({ loading: false, error:"Failed to fetch links."})
        }
    },
    
    fetchLinkStats: async(code: string)=>{
        try {
            set({ loading: true, error:null});
            const data = await linkService.getLinkStats(code);
            set({ loading: false, selectedLink: data});
        } catch (error) {
            set({ loading: false, error:"Failed to fetch stats."});
        }
    },

    createLink: async(payload: CreateLinkPayload)=>{
        try {
            set({ loading: true, error:null});
            const newLink = await linkService.createLink(payload);
            set({ links:[...get().links, newLink]});
            return newLink;
        } catch (err: any) {
            set({ loading: false, error:err?.response?.data?.message || "Failed to create link."});
            throw err;
        }
    },

    deleteLink: async(code: string)=>{
        try {
            set({ loading: true, error: null});
            await linkService.deleteLinks(code);
            set({
                links:get().links.filter((l)=>l.code !== code),
                loading: false,
            });
        } catch (error) {
            set({ loading: false, error:"Failed to delete link."});
        }
    },

    redirectTotarget : async(code: string)=>{
        try {
            // set({ loading: true, error:null});
            const res =  await linkService.redirectToTarget(code);
            // set({
            //     redirectLink: res,
            //     loading:false,
            // })
            // window.location.href =`${process.env.NEXT_PUBLIC_API_URL}/${code}`;
        } catch (error) {
            set({loading: false, error:"Failed to fetch redirect link."});
        }
    },

}));