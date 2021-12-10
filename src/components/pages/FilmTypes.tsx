import {AgeLimitType} from "./AgeLimitPage";
import {CountryType} from "./CountryTypes";

export type FilmType = {
    id: number,
    name: string,
    worldPremiere: Date,
    localPremiere: Date,
    ageLimit: AgeLimitType,
    countries: Array<CountryType>
    plot: string,
    active: boolean
}