"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDDSystem = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
const types_1 = require("./types");
class PDDSystem extends fabric_contract_api_1.Contract {
    initLedger(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("======--------------Ledger initialize----------------=====");
            const users = [
                {
                    login: "1",
                    password: "1",
                    isDPS: true,
                    fio: "Иванов Иван Иванович",
                    balancePC: "50",
                    skillYears: "2",
                },
                {
                    login: "2",
                    password: "2",
                    isDPS: false,
                    fio: "Семенов Семен Семенович",
                    balancePC: "50",
                    skillYears: "5",
                },
                {
                    login: "3",
                    password: "3",
                    isDPS: false,
                    fio: "Петров Петр Петрович",
                    balancePC: "50",
                    skillYears: (10).toString(),
                }
            ];
            for (let i = 0; i < users.length; i++) {
                yield ctx.stub.putState('USER-' + users[i].login, Buffer.from(JSON.stringify(users[i])));
                console.info("Added <--->", users[i]);
            }
            const licences = [{
                    id: "000",
                    validity: "11.01.2021",
                    category: "A",
                    fines: "0"
                },
                {
                    id: "111",
                    validity: "2026-05-12T00:00:00.000Z",
                    category: "B",
                    fines: "0"
                },
                {
                    id: "222",
                    validity: "2020-09-09T00:00:00.000Z",
                    category: "C",
                    fines: "0"
                },
                {
                    id: "333",
                    validity: "2027-02-13T00:00:00.000Z",
                    category: "A",
                    fines: "0"
                },
                {
                    id: "444",
                    validity: "2020-09-10T00:00:00.000Z",
                    category: "B",
                    fines: "0"
                },
                {
                    id: "555",
                    validity: "2029-06-26T00:00:00.000Z",
                    category: "C",
                    fines: "0"
                }, {
                    id: "666",
                    validity: "2030-03-31T00:00:00.000Z",
                    category: "A",
                    fines: "0"
                }
            ];
            for (let i = 0; i < licences.length; i++) {
                yield ctx.stub.putState('LICENCE-' + licences[i].id, Buffer.from(JSON.stringify(licences[i])));
                console.info("Added <--->", licences[i]);
            }
            yield this.initBank(ctx);
            PDDSystem.DEPLOYED_TIME = Math.floor(Date.now() / 1000);
            console.info("======--------------END: Ledger initialize----------------=====");
        });
    }
    setFine(ctx, login, password, licenceNum) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const user = (yield this.getUser(ctx, login, password));
            if (!user.isDPS) {
                return false;
            }
            const licence = yield this.getLicence(ctx, licenceNum);
            if (!licence) {
                return false;
            }
            const fine = new types_1.Fine();
            let licenceFines = +licence.fines;
            fine.id = (licenceFines + 1).toString();
            fine.licence = licence.id;
            fine.data = (yield this.getData(ctx));
            fine.isActive = true;
            licence.fines = (licenceFines + 1).toString();
            try {
                if (licence.owner) {
                    const owner = (yield this.getUser(ctx, licence.owner, licence.owner));
                    if (((_a = owner.licence) === null || _a === void 0 ? void 0 : _a.id) == licence.id) {
                        owner.licence = licence;
                    }
                    else if (((_b = owner.licence2) === null || _b === void 0 ? void 0 : _b.id) == licence.id) {
                        owner.licence2 = licence;
                    }
                    yield ctx.stub.putState('USER-' + owner.login, Buffer.from(JSON.stringify(owner)));
                    yield ctx.stub.putState('FINE-' + licence.id + (+fine.id), Buffer.from(JSON.stringify(fine)));
                    yield ctx.stub.putState('LICENCE-' + licence.id, Buffer.from(JSON.stringify(licence)));
                    return true;
                }
            }
            catch (error) {
                console.log(error);
            }
            yield ctx.stub.putState('FINE-' + licence.id + (+fine.id), Buffer.from(JSON.stringify(fine)));
            yield ctx.stub.putState('LICENCE-' + licence.id, Buffer.from(JSON.stringify(licence)));
            return true;
        });
    }
    setLicence(ctx, login, password, licenceNum) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = (yield this.getUser(ctx, login, password));
            let licence;
            licence = (yield this.getLicence(ctx, licenceNum));
            if (user.licence == undefined) {
                if (licence.owner == undefined) {
                    licence.owner = user.login;
                    user.licence = licence;
                    yield ctx.stub.putState('USER-' + login, Buffer.from(JSON.stringify(user)));
                    yield ctx.stub.putState('LICENCE-' + licence.id, Buffer.from(JSON.stringify(licence)));
                    return true;
                }
            }
            else if (user.licence2 == undefined) {
                if (licence.owner == undefined && licence.id != user.licence.id) {
                    licence.owner = user.login;
                    user.licence2 = licence;
                    yield ctx.stub.putState('USER-' + login, Buffer.from(JSON.stringify(user)));
                    yield ctx.stub.putState('LICENCE-' + licence.id, Buffer.from(JSON.stringify(licence)));
                    return true;
                }
            }
            return false;
        });
    }
    licenceDataAdd(ctx, login, password, licenceNum) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = (yield this.getUser(ctx, login, password));
            let licence;
            if (user.licence && licenceNum === user.licence.id) {
                licence = (yield this.getLicence(ctx, user.licence.id));
            }
            else if (user.licence2 && licenceNum === user.licence2.id) {
                licence = (yield this.getLicence(ctx, user.licence2.id));
            }
            else {
                console.log("у пользователя нет лицензии");
                return false;
            }
            if (licence.fines === "0") {
                const correctTime = new Date(yield this.getData(ctx));
                const licenceExitTime = Date.parse(licence.validity);
                const betweenData = licenceExitTime - correctTime.getTime();
                if ((Math.floor(betweenData / 1000 / 60)) > 30) {
                    licence.validity = "2111-11-11T11:11:11.111Z";
                    user.licence = licence;
                    yield ctx.stub.putState('LICENCE-' + licence.id, Buffer.from(JSON.stringify(licence)));
                    yield ctx.stub.putState('USER-' + login, Buffer.from(JSON.stringify(user)));
                    return true;
                }
            }
            return false;
        });
    }
    setCar(ctx, login, password, carCategory, carCostPC, howManyYearsUsed) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = (yield this.getUser(ctx, login, password));
            if (user.licence) {
                const licence = (yield this.getLicence(ctx, user.licence.id));
                let licence2;
                if (user.licence2) {
                    licence2 = (yield this.getLicence(ctx, user.licence2.id));
                }
                if (licence.category == carCategory
                    || licence.category2 && licence.category2 == carCategory
                    || licence2 !== undefined && licence2.category == carCategory) {
                    const car = new types_1.Car();
                    car.category = carCategory;
                    car.costPC = carCostPC;
                    car.howManyYearsUsed = howManyYearsUsed;
                    user.car = car;
                    yield ctx.stub.putState('USER-' + login, Buffer.from(JSON.stringify(user)));
                    return true;
                }
            }
            return false;
        });
    }
    licenceCategoryAdd(ctx, login, password, category) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = (yield this.getUser(ctx, login, password));
            if (user.licence) {
                const licence = user.licence;
                if (licence.category != category) {
                    licence.category2 = category;
                    user.licence = licence;
                    yield ctx.stub.putState('LICENCE-' + licence.id, Buffer.from(JSON.stringify(licence)));
                    yield ctx.stub.putState('USER-' + login, Buffer.from(JSON.stringify(user)));
                    return true;
                }
            }
            return false;
        });
    }
    payFine(ctx, login, password, licenceNum, fineID) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const user = (yield this.getUser(ctx, login, password));
            let licence = (yield this.getLicence(ctx, licenceNum));
            if (!licence || +licence.fines === 0 || licence.fines === undefined || !user.balancePC) {
                return false;
            }
            const fine = (yield this.getFine(ctx, licence.id, (+fineID)));
            console.log(fine);
            if (!fine || !fine.isActive || !fine.data) {
                return false;
            }
            const correctData = Math.floor(Date.now() / 1000);
            const betweenData = correctData - Date.parse(fine.data);
            const correctAmm = Math.floor(betweenData / 60) <= 5 ? 5 : 10;
            console.log(betweenData);
            console.log(correctAmm);
            const bank = yield this.getBank(ctx);
            let bankBalance = +bank.balancePC;
            let userBalanceNum = +user.balancePC;
            let licenceFines = +licence.fines;
            if (userBalanceNum < correctAmm) {
                console.error("Not enough balancePC");
                return false;
            }
            userBalanceNum -= correctAmm;
            licenceFines -= 1;
            bankBalance += correctAmm;
            user.balancePC = (userBalanceNum.toString());
            licence.fines = (licenceFines.toString());
            if (((_a = user.licence) === null || _a === void 0 ? void 0 : _a.id) == licence.id) {
                user.licence = licence;
            }
            else if (((_b = user.licence2) === null || _b === void 0 ? void 0 : _b.id) == licence.id) {
                user.licence2 = licence;
            }
            bank.balancePC = (bankBalance.toString());
            fine.isActive = false;
            yield ctx.stub.putState('FINE-' + licence.id + (+fineID), Buffer.from(JSON.stringify(fine)));
            yield ctx.stub.putState('LICENCE-' + licence.id, Buffer.from(JSON.stringify(licence)));
            yield ctx.stub.putState('BANK-', Buffer.from(JSON.stringify(bank)));
            yield ctx.stub.putState('USER-' + login, Buffer.from(JSON.stringify(user)));
            return true;
        });
    }
    regUser(ctx, login, password, fio, skillYears) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = (yield this.getUser(ctx, login, password));
                return false;
            }
            catch (error) {
                const user = {
                    login: login,
                    password: password,
                    balancePC: "50",
                    skillYears: skillYears,
                    fio: fio,
                    isDPS: false
                };
                yield ctx.stub.putState('USER-' + login, Buffer.from(JSON.stringify(user)));
                return true;
            }
        });
    }
    initBank(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const bank = new types_1.Bank();
            yield ctx.stub.putState('BANK-', Buffer.from(JSON.stringify(bank)));
        });
    }
    getData(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const correctTime = Math.floor(Date.now() / 1000);
            const timeDiff = correctTime - PDDSystem.DEPLOYED_TIME;
            const virtualDate = PDDSystem.DEPLOYED_TIME + (timeDiff * 60 * 24);
            return new Date(virtualDate * 1000).toISOString();
        });
    }
    getFine(ctx, licenceNum, fineID) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.queryAll(ctx, 'FINE-' + licenceNum + fineID))[0];
        });
    }
    getUser(ctx, login, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = (yield this.queryAll(ctx, 'USER-' + login))[0];
            if (user && user.password === password) {
                return user;
            }
            throw new Error("User not found");
        });
    }
    getUserBalance(ctx, login, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = (yield this.getUser(ctx, login, password));
            if (user.balancePC) {
                return user.balancePC;
            }
            throw new Error("Cant find user");
        });
    }
    getBankBalance(ctx, login, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const bank = (yield this.getBank(ctx));
            if (login == bank.login && password == bank.password) {
                return bank.balancePC;
            }
            throw new Error("User not found");
        });
    }
    getLicence(ctx, licenceID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return (yield this.queryAll(ctx, 'LICENCE-' + licenceID))[0];
            }
            catch (e) {
                throw new Error("You did not have licence");
            }
        });
    }
    getBank(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.queryAll(ctx, 'BANK-'))[0];
        });
    }
    queryAll(ctx, prefix) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            const allResults = [];
            try {
                for (var _d = true, _e = __asyncValues(ctx.stub.getStateByRange('', '')), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const { key, value } = _c;
                    const strValue = Buffer.from(value).toString('utf-8');
                    let record;
                    try {
                        record = JSON.parse(strValue);
                    }
                    catch (error) {
                        console.log(error);
                        record = strValue;
                    }
                    if (key.startsWith(prefix)) {
                        allResults.push(record);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
            console.info(allResults);
            return allResults;
        });
    }
}
exports.PDDSystem = PDDSystem;
PDDSystem.DEPLOYED_TIME = 0;
