export type Users = {
    login:string
    password: string
    balancePC: string
    isDPS: boolean
    fio?: string
    licence?: DriverLicence
    licence2?: DriverLicence
    skillYears: string
    car?: Car
}

export type Car = {
    category: "A" | "B" | "C"
    costPC: string
    howManyYearsUsed: string
}

export type Bank = {
    login: 'bank'
    password: "bank"
    balancePC: string | undefined
}

export type DriverLicence = {
    id: string
    validity: string
    category: "A" | "B" | "C"
    category2?: "A" | "B" | "C"
    fines: string
    owner?: string
}

export type Fine = {
    id: string
    licence: string
    data: string
}