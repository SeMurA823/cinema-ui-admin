import {SeatType} from "./HallTypes";
import {ScreeningType} from "./ScreeningTypes";
import {IUser} from "../../models/response/IUser";

export type TicketType = {
    id: number,
    seat: SeatType,
    price: number,
    filmScreening: ScreeningType,
    isActive: boolean
}

export type PurchaseType = {
    id: number,
    user: IUser
}