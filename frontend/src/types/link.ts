export interface Linki{
    code: string,
    target_url: string,
    clicks: number,
    last_clicked: string | null,
    created_at: string | null,
}

export interface CreateLinkPayload{
    target_url: string,
    code?: string,
}

export interface ApiResponse<T>{
    success: boolean,
    data: T,
    message?: string
}