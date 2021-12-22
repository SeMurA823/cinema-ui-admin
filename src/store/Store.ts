import {makeAutoObservable} from "mobx";
import {IUser} from "../models/response/IUser";
import AuthService from "../services/AuthService";
import UserService from "../services/UserService";

export default class Store {
    user = {} as IUser;
    isAuth = false;
    loaded = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setLoaded(loaded: boolean) {
        this.loaded = loaded;
    }

    async login(username: string, password: string, rememberMe: boolean) {
        try {
            this.setLoaded(false);
            const response = await AuthService.login(username, password, rememberMe);
            localStorage.setItem('token', response.data.accessToken);
            const responseUser = await UserService.getUser();
            console.log(responseUser.data);
            this.setUser(responseUser.data);
            this.setAuth(true);
            this.setLoaded(true);
        } catch (e) {
            this.setAuth(false)
        } finally {
            this.setLoaded(true);
        }
    }

    async logout() {
        try {
            this.setLoaded(false);
            const response = await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch (e) {
            console.log(e);
        } finally {
            this.setLoaded(true);
        }
    }

    async refresh() {
        try {
            this.setLoaded(false);
            const responseUser = await UserService.getUser();
            console.log(responseUser.data);
            this.setUser(responseUser.data);
            this.setAuth(true);
        } catch (e) {
            this.setAuth(false);
            this.setUser({} as IUser);
        } finally {
            this.setLoaded(true);
        }

    }
}