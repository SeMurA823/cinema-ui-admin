export type RoleType = {
    active: boolean,
    entityStatus: 'ACTIVE' | 'NOT_ACTIVE',
    id: number,
    role: 'CUSTOMER' | 'ADMIN' | 'EMPLOYEE'
}