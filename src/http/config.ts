import axios from "axios";
import AuthService from "../services/AuthService";

export const SERVER_URL = "http://localhost:8080"

export const API_URL = `${SERVER_URL}/api`

let refreshing: boolean = false;
let refreshRequest: Promise<any> | null = null;

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

$api.interceptors.request.use((config) => {
    // @ts-ignore
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
})


$api.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    console.log("ERROR");
    const originalRequest = error.config;
    if (error.response.status === 401 || error.response.status === 403) {
        if (error.config && !error.config._isRetry && !refreshing) {
            refreshing = true;
            refreshRequest = AuthService.refresh();
            const response = await refreshRequest;
            localStorage.setItem('token', response.data.accessToken);
            originalRequest._isRetry = true;
            return $api.request(originalRequest);
        }
        if (refreshing) {
            await refreshRequest;
            return $api.request(originalRequest);
        }
    }

    throw error;
})

export default $api;
