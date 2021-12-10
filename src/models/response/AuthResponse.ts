export interface AuthResponse {
    clientId: string,
    accessToken: string,
    refreshToken: string,
    tokenType: string,
    expiresIn: number
}