
import {Context,Contract} from "fabric-contract-api"
import {Car, Users, DriverLicence, Fine, Bank} from "./types";

export class PDDSystem extends Contract {

    private static DEPLOYED_TIME: number = 0;

    public async initLedger(ctx:Context): Promise<void> {
        console.log("======--------------Ledger initialize----------------=====");
        const users: Users[] = [
            {
                login:"1",
                password:"1",
                isDPS:true,
                fio:"Иванов Иван Иванович",
                balancePC:"50",
                skillYears:"2",
            },
            {
                login:"2",
                password:"2",
                isDPS:false,
                fio:"Семенов Семен Семенович",
                balancePC:"50",
                skillYears:"5",
            },
            {
                login:"3",
                password:"3",
                isDPS:false,
                fio:"Петров Петр Петрович",
                balancePC:"50",
                skillYears:(10).toString(),
            }
        ]
        for (let i = 0; i < users.length; i++) {
            await ctx.stub.putState('USER-' + users[i].login,Buffer.from(JSON.stringify(users[i])));
            console.info("Added <--->", users[i]);
        }

        const licences: DriverLicence[] = [{
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
            },{
                id: "666",
                validity: "2030-03-31T00:00:00.000Z",
                category: "A",
                fines: "0"
            }
        ]
        for (let i = 0; i < licences.length; i++) {
            await ctx.stub.putState('LICENCE-' + licences[i].id,Buffer.from(JSON.stringify(licences[i])));

            console.info("Added <--->", licences[i]);
        }

        await this.initBank(ctx)

        PDDSystem.DEPLOYED_TIME = Math.floor(Date.now()/1000)
        console.info("======--------------END: Ledger initialize----------------=====")
    }

    public async setFine(ctx:Context,login:string,password:string,licenceNum:string): Promise<boolean> {
        const user = (await this.getUser(ctx,login,password))
        if (!user.isDPS) {return false;}
        const licence = await this.getLicence(ctx,licenceNum)
        if (!licence) {return false;}

        const fine = new Fine()
        let licenceFines = +licence.fines
        fine.id = (licenceFines + 1).toString()
        fine.licence = licence.id
        fine.data = (await this.getData(ctx))
        fine.isActive = true
        licence.fines = (licenceFines + 1).toString()

        try {
            if (licence.owner) {
                const owner = (await this.getUser(ctx, licence.owner, licence.owner))

                if (owner.licence?.id == licence.id) {
                    owner.licence = licence
                } else if (owner.licence2?.id == licence.id) {
                    owner.licence2 = licence
                }

                await ctx.stub.putState('USER-' + owner.login, Buffer.from(JSON.stringify(owner)));
                await ctx.stub.putState('FINE-' + licence.id + (+fine.id), Buffer.from(JSON.stringify(fine)));
                await ctx.stub.putState('LICENCE-' + licence.id, Buffer.from(JSON.stringify(licence)));
                return true
            }
        } catch (error) {
            console.log(error);
        }
        await ctx.stub.putState('FINE-' + licence.id + (+fine.id), Buffer.from(JSON.stringify(fine)));
        await ctx.stub.putState('LICENCE-' + licence.id, Buffer.from(JSON.stringify(licence)));

        return true
    }

    public async setLicence(ctx:Context,login:string,password:string,licenceNum:string): Promise<boolean> {
        const user = (await this.getUser(ctx,login,password))
            let licence
            licence = (await this.getLicence(ctx,licenceNum))

            if (user.licence == undefined) {
                if (licence.owner == undefined ) {
                    licence.owner = user.login
                    user.licence = licence
                    await ctx.stub.putState('USER-' + login, Buffer.from(JSON.stringify(user)));
                    await ctx.stub.putState('LICENCE-' + licence.id, Buffer.from(JSON.stringify(licence)));
                    return true
                }
            } else if (user.licence2 == undefined) {
                if (licence.owner == undefined && licence.id != user.licence.id) {
                    licence.owner = user.login
                    user.licence2 = licence
                    await ctx.stub.putState('USER-' + login, Buffer.from(JSON.stringify(user)));
                    await ctx.stub.putState('LICENCE-' + licence.id, Buffer.from(JSON.stringify(licence)));
                    return true
                }
            }
            return false
    }

    public async licenceDataAdd(ctx:Context,login:string,password:string, licenceNum:string): Promise<boolean> {
            const user = (await this.getUser(ctx,login,password))
            let licence

            if (user.licence && licenceNum === user.licence.id) {
                licence = (await this.getLicence(ctx,user.licence.id))
            } else if (user.licence2 && licenceNum === user.licence2.id) {
                licence = (await this.getLicence(ctx,user.licence2.id))
            } else {
                console.log("у пользователя нет лицензии")
                return false;
            }

            if (licence.fines === "0") {
                const correctTime = new Date(await this.getData(ctx))
                const licenceExitTime = Date.parse(licence.validity)
                const betweenData =  licenceExitTime - correctTime.getTime();
                if ((Math.floor(betweenData/1000/60)) > 30) {
                    licence.validity = "2111-11-11T11:11:11.111Z"
                    user.licence = licence
                    await ctx.stub.putState('LICENCE-' + licence.id, Buffer.from(JSON.stringify(licence)));
                    await ctx.stub.putState('USER-' + login, Buffer.from(JSON.stringify(user)));
                    return true;
                }
            }
        return false;
    }

    public async setCar(ctx:Context,login:string,password:string,carCategory: "A" | "B" |"C", carCostPC:string,howManyYearsUsed:string){
        const user = (await this.getUser(ctx,login,password))

        if (user.licence) {
            const licence = (await this.getLicence(ctx, user.licence.id))
            let licence2
            if (user.licence2) {
                licence2 = (await this.getLicence(ctx, user.licence2.id))
            }

            if (licence.category == carCategory
                || licence.category2 && licence.category2 == carCategory
                || licence2 !== undefined && licence2.category == carCategory) {

                const car = new Car()
                car.category = carCategory
                car.costPC = carCostPC
                car.howManyYearsUsed = howManyYearsUsed
                user.car = car

                await ctx.stub.putState('USER-' + login, Buffer.from(JSON.stringify(user)));
                return true
            }
        }
        return false;
    }

    public async licenceCategoryAdd(ctx:Context,login:string,password:string,category: "A"|"B"|"C"):Promise<boolean> {
        const user = (await this.getUser(ctx,login,password))
        if (user.licence) {
            const licence = user.licence
            if (licence.category != category) {
                licence.category2 = category
                user.licence = licence
                await ctx.stub.putState('LICENCE-' + licence.id, Buffer.from(JSON.stringify(licence)));
                await ctx.stub.putState('USER-' + login, Buffer.from(JSON.stringify(user)));
                return true;
            }
        }
        return false;
    }

    public async payFine(ctx:Context,login:string,password:string, licenceNum:string,fineID:string): Promise<boolean> {
        const user = (await this.getUser(ctx,login,password))
            let licence = (await this.getLicence(ctx,licenceNum))
            if (!licence || +licence.fines === 0 || licence.fines === undefined || !user.balancePC) {return false}

            const fine = (await this.getFine(ctx,licence.id,(+fineID)))
            console.log(fine)
            if (!fine || !fine.isActive || !fine.data) {return false}

            const correctData = Math.floor(Date.now() / 1000)
            const betweenData = correctData - Date.parse(fine.data);
            const correctAmm = Math.floor(betweenData/60) <= 5 ? 5 : 10
            console.log(betweenData)
            console.log(correctAmm)

            const bank = await this.getBank(ctx)

            let bankBalance = +bank.balancePC
            let userBalanceNum = +user.balancePC
            let licenceFines = +licence.fines

            if (userBalanceNum < correctAmm) {
                console.error("Not enough balancePC")
                return false
            }

            userBalanceNum -= correctAmm
            licenceFines -= 1
            bankBalance += correctAmm

            user.balancePC = (userBalanceNum.toString())

            licence.fines = (licenceFines.toString())
            if (user.licence?.id == licence.id) {
                user.licence = licence
            } else if (user.licence2?.id == licence.id) {
                user.licence2 = licence
            }

            bank.balancePC = (bankBalance.toString())
            fine.isActive = false

            await ctx.stub.putState('FINE-' + licence.id + (+fineID), Buffer.from(JSON.stringify(fine)));
            await ctx.stub.putState('LICENCE-' + licence.id, Buffer.from(JSON.stringify(licence)));
            await ctx.stub.putState('BANK-', Buffer.from(JSON.stringify(bank)));
            await ctx.stub.putState('USER-' + login, Buffer.from(JSON.stringify(user)));

            return true
    }

    public async regUser(ctx:Context,login:string,password:string,fio:string,skillYears:string):Promise<boolean> {
        try {
            const user = (await this.getUser(ctx, login, password))
            return false;
        } catch (error) {
                const user = {
                    login: login,
                    password: password,
                    balancePC: "50",
                    skillYears: skillYears,
                    fio: fio,
                    isDPS: false
                }
                await ctx.stub.putState('USER-' + login, Buffer.from(JSON.stringify(user)));
                return true;
        }
    }

    public async initBank(ctx:Context):Promise<void> {
        const bank = new Bank()
        await ctx.stub.putState('BANK-',Buffer.from(JSON.stringify(bank)));
    }

    public async getData(ctx:Context): Promise<string> {
        const correctTime = Math.floor(Date.now()/1000)
        const timeDiff = correctTime - PDDSystem.DEPLOYED_TIME
        const virtualDate =  PDDSystem.DEPLOYED_TIME + (timeDiff * 60 * 24)
        return new Date(virtualDate * 1000).toISOString();
    }

    public async getFine(ctx:Context,licenceNum:string,fineID:number):Promise<Fine> {
        return (await this.queryAll<Fine>(ctx,'FINE-' + licenceNum + fineID))[0];
    }

    public async getUser(ctx:Context,login:string,password:string): Promise<Users> {
        const user = (await this.queryAll<Users>(ctx,'USER-'+login))[0];
        if (user && user.password === password){
            return user;
    }
        throw new Error("User not found");
    }

    public async getUserBalance(ctx:Context,login:string,password:string):Promise<string> {
        const user = (await this.getUser(ctx,login,password));
        if (user.balancePC) {
            return user.balancePC;
        }
        throw new Error("Cant find user");
    }

    public async getBankBalance(ctx:Context,login:string,password:string):Promise<string> {
        const bank = (await this.getBank(ctx));
        if (login == bank.login && password == bank.password) {
            return bank.balancePC;
        }
        throw new Error("User not found");
    }

    public async getLicence(ctx:Context,licenceID:string): Promise<DriverLicence> {
        try {
            return (await this.queryAll<DriverLicence>(ctx, 'LICENCE-' + licenceID))[0];
        } catch (e) {
            throw new Error("You did not have licence");
        }
    }

    public async getBank(ctx:Context): Promise<Bank> {
        return (await this.queryAll<Bank>(ctx,'BANK-'))[0];
    }

    public async queryAll<T = string>(ctx:Context, prefix:string): Promise<T[]> {
        const allResults = [];
        for await(const{key,value} of ctx.stub.getStateByRange('','')){
            const strValue = Buffer.from(value).toString('utf-8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (error) {
                console.log(error);
                record = strValue;
            }
            if (key.startsWith(prefix)){
                allResults.push(record as T);
            }
        }
        console.info(allResults);
        return allResults;
    }
}
