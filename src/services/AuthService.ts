import axios, {AxiosResponse} from "axios";
import $api, {API_URL} from "../http/config";
import {AuthResponse} from "../models/response/AuthResponse";
import {ILogin} from "../models/request/ILogin";

export default class AuthService {
    static async login(username: string, password: string, rememberMe: boolean): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/auth?login', JSON.stringify({
            username: username,
            password: password,
            rememberMe: rememberMe
        } as ILogin))
    }

    static async logout(): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/auth/logout', JSON.stringify({}));
    }

    static async refresh(): Promise<AxiosResponse<AuthResponse>> {
        return axios.post<AuthResponse>(`${API_URL}/auth?refresh`, {}, {
            withCredentials: true
        })
    }
}