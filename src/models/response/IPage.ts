export interface IPage<T> {
    content: Array<T>,
    number: number,
    sort: {
        sorted: boolean,
        unsorted: boolean,
        empty: false
    },
    first: boolean,
    empty: boolean,
    last: boolean,
    totalPages: number,
    totalElements: number,
    numberOfElements: number,
    size: number,
}

export interface IPageInfo {
    last: boolean,
    totalPages: number,
    totalElements: number,
    numberOfElements: number,
    size: number,
    number: number
}