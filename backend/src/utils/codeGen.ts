const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generateCode(length = 6) : string{
    let s= '';
    for(let i=0;i<length;i++){
        s += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    return s;
}

export function isValidCode(code: string) : boolean{
    return /^[A-Za-z0-9]{6,8}$/.test(code);
}