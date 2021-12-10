import $api from "../http/config";
import {IPage} from "../models/response/IPage";
import IFilm from "../models/response/IFilm";
import IPageable from "../models/request/IPageable";
import {AxiosResponse} from "axios";

export default class FilmService {
    static getAllFilms(page: IPageable): Promise<AxiosResponse<IPage<IFilm>>> {
        return $api.get<IPage<IFilm>>(`/admin/films?size=${page.size}&page=${page.number}`);
    }
}