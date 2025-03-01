export class Car {
    public category: "A" | "B" | "C" | undefined
    public costPC: string | undefined;
    public howManyYearsUsed: string | undefined;
}

export class BasicAccount {
    public login: string | undefined;
    public password: string | undefined;
    public balancePC: string | undefined;
}

export class Bank extends BasicAccount {
    public balancePC = "1000"
    public login = "bank"
    public password = "bank"
}

export class Users extends BasicAccount {
    public isDPS: boolean | undefined;
    public fio?: string;
    public licence?: DriverLicence;
    public licence2?: DriverLicence;
    public skillYears?: string;
    public car?: Car;
}

export class DriverLicence {
    public id: string = "";
    public validity: string = "";
    public category: "A" | "B" | "C" | undefined
    public category2?: "A" | "B" | "C";
    public fines: string = "0"
    public owner?: string;
}

export class Fine {
    public id: string | undefined;
    public licence: string | undefined;
    public data: string | undefined;
    public isActive: boolean | undefined;
}
