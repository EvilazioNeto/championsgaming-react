import { createContext, useEffect, useState } from "react";
import { IAuthProvider, IContext, IUser, LoginResponse } from "./types";
import { LoginRequest, getUserLocalStorage, setUserLocalStorage } from "./util";

export const AuthContext = createContext<IContext>({} as IContext);

export function AuthProvider({ children }: IAuthProvider) {
    const [user, setUser] = useState<IUser | null>(getUserLocalStorage());

    useEffect(() => {
        const userLog = getUserLocalStorage()
        if (userLog) {
            setUser(userLog)
        }
    }, []);

    async function authenticate(email: string, senha: string): Promise<LoginResponse> {
        const response = await LoginRequest(email, senha)
        const { user } = response
        const payload = { token: response.accessToken, id: user.id, email: user.email }

        setUser(payload)
        setUserLocalStorage(payload)

        return payload;
    }


    async function logout() {
        const sair = confirm("Desejar sair da sua conta?")
        if (sair) {
            setUser(null)
            setUserLocalStorage(null)
        }
    }

    return (
        <AuthContext.Provider value={{ ...user, authenticate, logout }}>
            {children}
        </AuthContext.Provider>
    )


}