import type { IUser } from "../interfaces/auth";

export function decodeToken(token: string): IUser | null {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);
        return {
            userId: payload.sub,
            email: payload.email,
            role: payload.role,
            tenantId: payload.tenantId
        };
    } catch (e) {
        return null;
    }
}
