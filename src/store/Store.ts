import {makeAutoObservable} from "mobx";
import {IUser} from "../models/response/IUser";
import AuthService, {TOKEN_KEY} from "../services/AuthService";
import UserService from "../services/UserService";

export default class Store {
    user = {} as IUser;
    isAuth = (localStorage.getItem(TOKEN_KEY) && true);
    loaded = false;
    promiseRefresh: Promise<any>|undefined;

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
            localStorage.setItem(TOKEN_KEY, response.data.accessToken);
            const responseUser = await UserService.getUser();
            console.log(responseUser.data);
            this.setUser(responseUser.data);
            this.setAuth(true);
            this.setLoaded(true);
        } catch (e) {
            this.setAuth(false);
            throw e;
        } finally {
            this.setLoaded(true);
        }
    }

    async logout() {
        try {
            this.setLoaded(false);
            const response = await AuthService.logout();
            localStorage.removeItem(TOKEN_KEY);
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch (e) {
            console.log(e);
        } finally {
            this.setLoaded(true);
        }
    }

    async refresh() {
        if (this.promiseRefresh) {
            await this.promiseRefresh;
        } else {
            try {
                this.setLoaded(false);
                if (localStorage.getItem(TOKEN_KEY)) {
                    this.promiseRefresh = UserService.getUser();
                    const responseUser = await this.promiseRefresh;
                    console.log(responseUser.data);
                    this.setUser(responseUser.data);
                    this.setAuth(true);
                }
            } catch (e) {
                this.setAuth(false);
                localStorage.removeItem(TOKEN_KEY);
                this.setUser({} as IUser);
            } finally {
                this.setLoaded(true);
                this.promiseRefresh = undefined;
            }
        }
    }
}