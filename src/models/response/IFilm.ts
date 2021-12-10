import IAgeLimit from "./IAgeLimit";

export default interface IFilm {
    id: number,
    name: string,
    localPremiere: Date,
    worldPremiere: Date | null,
    plot: string,
    ageLimit: IAgeLimit,
}