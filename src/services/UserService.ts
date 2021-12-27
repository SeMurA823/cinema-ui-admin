import {IUser} from "../models/response/IUser";
import {AxiosResponse} from "axios";
import $api from "../http/config";

export default class UserService {
    static async getUser(): Promise<AxiosResponse<IUser>> {
        return $api.get<IUser>("/users/profile");
    }
}