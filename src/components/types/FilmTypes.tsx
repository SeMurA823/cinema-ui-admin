import {AgeLimitType} from "./AgeLimitTypes";
import {CountryType} from "./CountryTypes";

export type FilmType = {
    id: number,
    name: string,
    duration: number,
    worldPremiere: Date,
    localPremiere: Date,
    ageLimit: AgeLimitType,
    countries: Array<CountryType>
    plot: string,
    active: boolean
}