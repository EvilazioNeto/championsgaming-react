import axios from "axios";
import { errorInterceptor, responseInterceptor } from "./interceptors";
import { getUserLocalStorage } from "../../../contexts/AuthProvider/util";

const Api = axios.create({
    baseURL: 'http://localhost:3333'
});

Api.interceptors.request.use(
    (config) => {
        const {token} = getUserLocalStorage() || {}; 
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

Api.interceptors.response.use(
    (response) => responseInterceptor(response),
    (error) => errorInterceptor(error)
);

export { Api };
