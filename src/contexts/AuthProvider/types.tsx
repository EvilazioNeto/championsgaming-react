export interface IUser {
    email: string;
    token: string;
    id: number;
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