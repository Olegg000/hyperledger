"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fine = exports.DriverLicence = exports.Users = exports.Bank = exports.BasicAccount = exports.Car = void 0;
class Car {
}
exports.Car = Car;
class BasicAccount {
}
exports.BasicAccount = BasicAccount;
class Bank extends BasicAccount {
    constructor() {
        super(...arguments);
        this.balancePC = "1000";
        this.login = "bank";
        this.password = "bank";
    }
}
exports.Bank = Bank;
class Users extends BasicAccount {
}
exports.Users = Users;
class DriverLicence {
    constructor() {
        this.id = "";
        this.validity = "";
        this.fines = "0";
    }
}
exports.DriverLicence = DriverLicence;
class Fine {
}
exports.Fine = Fine;
