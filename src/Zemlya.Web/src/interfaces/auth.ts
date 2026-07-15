export interface IUser {
    userId: string;
    email: string;
    role: string;
    tenantId: string;
}

export interface ILoginResponse {
    accessToken: string;
    refreshToken: string;
}

export interface IRegisterResponse {
    accessToken: string;
    refreshToken: string;
}

export interface IAuthInitialState {
    token: string | null;
    user: IUser | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}
