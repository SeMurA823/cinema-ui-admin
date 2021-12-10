import axios from "axios";
import {AuthResponse} from "../models/response/AuthResponse";

export const SERVER_URL = "http://localhost:8080"

export const API_URL = `${SERVER_URL}/api`

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
    const originalRequest = error.config;
    if ((error.response.status === 401 || error.response.status === 403) && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        const response = await $api.post<AuthResponse>(`/auth?refresh`)
        localStorage.setItem('token', response.data.accessToken);
        return $api.request(originalRequest)
    }
})

export default $api;
