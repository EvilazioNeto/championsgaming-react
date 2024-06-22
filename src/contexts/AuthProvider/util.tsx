import { toast } from "react-toastify";
import { Api } from "../../services/api/axios-config";
import { IUser } from "./types";

export function getUserLocalStorage() {
    const userLogString = localStorage.getItem("u")
    const user = userLogString ? JSON.parse(userLogString) : null;
    return user
}

export function setUserLocalStorage(user: IUser | null) {
    localStorage.setItem("u", JSON.stringify(user))
}

export async function LoginRequest(email: string, senha: string) {
    const data = {
        email: email,
        senha: senha
    };

    // eslint-disable-next-line no-useless-catch
    try {
        const response = await Api.post('/entrar', data);

        if (response.status === 401) {
            toast.error("Email ou senha são inválidos");
            throw new Error("Email ou senha são inválidos");
        } else if (response.status === 404) {
            toast.error("Usuário não encontrado");
            throw new Error("Usuário não encontrado");
        }

        const responseData = await response.data;
        return responseData;
    } catch (error) {
        throw error;
    }
}