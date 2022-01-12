export type HallType = {
    id: number,
    name: string,
    active: boolean
}

export type SeatType = {
    id?: number,
    row: number,
    number: number,
    unUsed: boolean
}