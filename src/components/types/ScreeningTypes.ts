import {HallType} from "./HallTypes";

export type ScreeningType = {
    id: number,
    hall: HallType,
    date: Date,
    price: number,
    active: boolean
}