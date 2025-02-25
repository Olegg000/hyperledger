import {Fine, Users} from "../Type/Types"

export const APILogin = async (login: string,password:string) => {
        const raw = await fetch('http://localhost:3002/getUser', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({login, password})
        })
        return await raw.json() as Users;
}

export const APIGetBankBalance = async (login: string, password:string) => {
    const raw = await fetch('http://localhost:3002/getBankBalance', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({login, password})
    })
    return await raw.json() as string
}

export const userReg = async (login: string, password:string, fio:string, skillYears:string) => {
    const raw = await fetch('http://localhost:3002/regUser', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({login, password, fio, skillYears})
    })
    return await raw.json() as boolean
}

export const getFine = async (licenceNum:string,fineID:string) => {
    const raw = await fetch('http://localhost:3002/getFine', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({licenceNum,fineID})
    })
    return await raw.json() as Fine
}

export const setFine = async (login: string,password:string,licenceNum:string) => {
    const raw = await fetch('http://localhost:3002/setFine', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({login, password,licenceNum})
    })
    return await raw.json() as boolean
}

export const setLicence = async (login: string,password:string, licenceNum:string) => {
    const raw = await fetch('http://localhost:3002/setLicence', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({login,password, licenceNum})
    })
    return await raw.json() as boolean
}

export const licenceCategoryAdd = async (login: string, password:string,category: "A" | "B" | "C") => {
    const raw = await fetch('http://localhost:3002/licenceCategoryAdd', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({login,password,category})
    })
    return await raw.json() as boolean
}

export const licenceDataAdd = async (login: string, password:string,licenceNum:string) => {
    const raw = await fetch('http://localhost:3002/licenceDataAdd', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({login,password,licenceNum})
    })
    return await raw.json() as boolean
}

export const setCar = async (login: string,password:string,carCategory: "A" | "B" | "C", carCostPC:string,howManyYearsUsed:string) => {
    const raw = await fetch('http://localhost:3002/setCar', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({login,password,carCategory,carCostPC,howManyYearsUsed})
    })
    return await raw.json() as boolean
}

export const payFine = async (login:string,password:string,fineID:string,licenceNum:string) => {
    const raw = await fetch('http://localhost:3002/payFine', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({login,password,fineID,licenceNum})
    })
    return await raw.json() as boolean
}