import { AxiosError } from "axios";

export const errorInterceptor = (error: AxiosError) => {
    if(error.message === 'Network Error'){
        return Promise.reject(new Error('Erro de conexão'))
    }

    if(error.response?.status === 401){
        localStorage.removeItem('u');
        window.location.href = '/login';
        return Promise.reject(new Error('Sua sessão expirou. Faça login novamente.'));
    }

    return Promise.reject(error);
}