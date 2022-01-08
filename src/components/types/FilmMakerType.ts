export type FilmMakerType = {
    id: number
    firstName: string,
    lastName: string,
    patronymic: string
}

export type FilmMakerPostType = {
    id: number,
    name: string,
    filmMaker: FilmMakerType
    active: boolean
}