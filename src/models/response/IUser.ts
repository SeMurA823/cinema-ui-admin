export interface IUser {
    firstName: string,
    lastName: string,
    patronymic: string,
    username: string,
    gender: string,
    id: number,
    birthSate: Date
}


export type NotificationType = {
    id: number,
    message: string
}