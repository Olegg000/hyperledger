const {Gateway} = require('fabric-network')
const path = require('path');
const {buildCAClient,enrollAdmin,registerAndEnrollUser} = require ("./utils/CAUtil");
const {buildCCPOrg2,buildWallet} = require("./utils/AppUtil");
const express = require("express")
const {Wallets} = require("fabric-network");

const channelName = "blockchain2025"
const chaincodeName = "blockchain"
const mspOrg2 = 'Users'
const walletPath = path.join(__dirname,"wallet")
const org2UserID = 'Admin'
let contract

const app = express()

app.use(express.json())

app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next()
})

app.post('/getUser', async (req, res) => {
    try {
        const result = await contract.evaluateTransaction('getUser', req.body.login, req.body.password);
        res.send(result.toString());
    } catch (e) {
        res.status(500).send(e)
    }
})

app.post('/getUserBalance', async (req, res) => {
    try {
        const result = await contract.evaluateTransaction('getUserBalance',req.body.login,req.body.password)
        res.send(result.toString());
    } catch (e){
        res.status(500).send(e)
    }
})

app.post('/getBankBalance', async (req, res) => {
    try {
        const result = await contract.evaluateTransaction('getBankBalance',req.body.login,req.body.password)
        res.send(result.toString());
    } catch (e){
        res.status(500).send(e)
    }
})

app.post('/getFine', async (req, res) => {
    try {
        const result = await contract.evaluateTransaction('getFine',req.body.licenceNum,req.body.fineID)
        res.send(result.toString());
    } catch (e){
        res.status(500).send(e)
    }
})

app.post('/regUser', async (req, res) => {
    try {
        console.log(req.body);
        const result = await contract.submitTransaction('regUser',req.body.login,
            req.body.password,req.body.fio,req.body.skillYears);
        res.send(result.toString());
    } catch (e){
        console.error(e)
        res.status(500).send(e)
    }
})

app.post('/setFine', async (req, res) => {
    try {
        const result = await contract.submitTransaction('setFine',req.body.login,req.body.password,req.body.licenceNum);
        res.send(result.toString());
    } catch (e){
        console.error(e)
        res.status(500).send(e)
    }
})

app.post('/setLicence', async (req, res) => {
    try {
        const result = await contract.submitTransaction('setLicence',req.body.login,req.body.password,req.body.licenceNum);
        res.send(result.toString());
    } catch (e) {
        console.error(e)
        res.status(500).send(e)
    }
})

app.post('/licenceDataAdd', async (req, res) => {
    try {
        const result = await contract.submitTransaction('licenceDataAdd',req.body.login,req.body.password,req.body.licenceNum);
        res.send(result.toString());
    } catch (e) {
        console.error(e)
        res.status(500).send(e)
    }
})

app.post('/setCar', async (req, res) => {
    try {
        const result = await contract.submitTransaction('setCar',req.body.login,req.body.password,req.body.carCategory,req.body.carCostPC,req.body.howManyYearsUsed);
        res.send(result.toString());
    } catch (e) {
        console.error(e)
        res.status(500).send(e)
    }
})

app.post('/licenceCategoryAdd', async (req, res) => {
    try {
        const result = await contract.submitTransaction('licenceCategoryAdd',req.body.login,req.body.password,req.body.category);
        res.send(result.toString());
    } catch (e) {
        console.error(e)
        res.status(500).send(e)
    }
})

app.post('/payFine', async (req, res) => {
    try {
        const result = await contract.submitTransaction('payFine',req.body.login,req.body.password,req.body.licenceNum, req.body.fineID);
        res.send(result.toString());
    } catch (e) {
        console.error(e)
        res.status(500).send(e)
    }
})

async function main() {
    try{
        const ccp = buildCCPOrg2();
        const caClient = buildCAClient(require('fabric-ca-client'),ccp,'ca.org2.example.com');
        const wallet = await buildWallet(Wallets,walletPath);

        await enrollAdmin(caClient,wallet,mspOrg2)
        await registerAndEnrollUser(caClient,wallet,mspOrg2,org2UserID,'org2.department1');

        const gateway = new Gateway()
        const gatewayOpt = {
            identity: org2UserID,
            wallet,
            discovery: {
                enabled: true,
                asLocalhost: true,
            },
        };

        await gateway.connect(ccp,gatewayOpt)

        const network = await gateway.getNetwork(channelName);
        contract = network.getContract(chaincodeName);
    } catch (e) {
        console.error(`--------------FAILED TO RUN APPLICATIONS: ${e}`)
    }
}

main()

app.listen(3002, () => console.log('Listening on port 3002'))
