import axios from "axios";
import moment from "moment";
import AuthService, {TOKEN_KEY} from "../services/AuthService";

// export const SERVER_URL = "http://semura.eastus.cloudapp.azure.com"
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
});

type AccessTokenPayment = {
    sub: string,
    exp: number,
    iat: number
}; 

export const isTokenExpired = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return true;
    const strToken = token as string;
    const payment = atob(strToken.split('.')[1]);
    const paymentObj = JSON.parse(payment) as AccessTokenPayment;
    const exp = paymentObj.exp;
    return moment(new Date(exp * 1000)).isBefore(moment());
}

$api.interceptors.request.use(async (config) => {
    if (localStorage.getItem(TOKEN_KEY)) {
        if (isTokenExpired()) {
            if (refreshing && refreshRequest) {
                await refreshRequest;
            } else {
                refreshing = true;
                refreshRequest = AuthService.refresh();
                const response = await refreshRequest;
                localStorage.setItem(TOKEN_KEY, response.data.accessToken);
                refreshing = false;
            }
        }
        // @ts-ignore
        config.headers.Authorization = `Bearer ${localStorage.getItem(TOKEN_KEY)}`;
    }
    return config;
})




$api.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    const originalRequest = error.config;
    if (!localStorage.getItem(TOKEN_KEY))
        return ;
    if (error.response.status === 401 || error.response.status === 403) {
        // if (error.config && !error.config._isRetry && !refreshing) {
        //     refreshing = true;
        //     refreshRequest = AuthService.refresh();
        //     const response = await refreshRequest;
        //     localStorage.setItem(TOKEN_KEY, response.data.accessToken);
        //     originalRequest._isRetry = true;
        //     refreshing = false;
        //     return $api.request(originalRequest);
        // }
        if (refreshing) {
            await refreshRequest;
            return $api.request(originalRequest);
        }
    }
    throw error;
})

export default $api;
