export interface IUser {
    email?: string;
    accessToken?: string;
    id?: string;
}

export interface LoginResponse {
    token: string;
    id: string;
    email: string;
}

export interface IContext extends IUser {
    authenticate: (email: string, senha: string) => Promise<LoginResponse>
    logout: () => void
}

export interface IAuthProvider {
    children: JSX.Element
}