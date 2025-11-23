import { pool } from "../config/db";


export type LinkRow = {
  code: string;
  target_url: string;
  clicks: number;
  last_clicked: string | null;
  created_at: string | null;
};


export  const LinkModel = {
    async create(code: string, target_url:string): Promise<LinkRow>{
        const q =`INSERT INTO links(code, target_url, created_at, clicks)
                  VALUES ($1, $2, now(),0)
                  RETURNING code, target_url, clicks, last_clicked, created_at`;
        const res = await pool.query(q, [code, target_url]);
        return res.rows[0];
    },

    async findAll(): Promise<LinkRow[]>{
        const res = await pool.query(`SELECT code, target_url, clicks, last_clicked, created_at FROM links ORDER BY created_at DESC;`);
        return res.rows;
    },

    async findByCode(code: string): Promise<LinkRow | null>{
        const res = await pool.query(`SELECT code, target_url, clicks, last_clicked, created_at FROM links WHERE code=$1;`,[code]);
        return res.rows[0] ?? null;
    },

    async deleteByCode(code: string): Promise<boolean>{
        const res = await pool.query(`DELETE FROM links WHERE code = $1;`,[code]);
        return res.rowCount>0;
    },

    async incrementClicks(code: string): Promise<LinkRow | null>{
        const q =`UPDATE links
                  SET clicks = clicks + 1, last_clicked = now()
                  WHERE code = $1
                  RETURNING code, target_url, clicks, last_clicked, created_at;`;
        const res = await pool.query(q, [code]);
        return res.rows[0] ?? null;
    }
}
