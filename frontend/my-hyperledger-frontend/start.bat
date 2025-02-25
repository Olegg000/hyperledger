@echo off
wsl bash /mnt/c/Users/Admin/Desktop/2025_B2/HyperLedgerFabric/tests/test1/try/fabric-samples/test-network/network.sh up -ca
wsl bash /mnt/c/Users/Admin/Desktop/2025_B2/HyperLedgerFabric/tests/test1/try/fabric-samples/test-network/network.sh up createChannel -ca -c blockchain2025
wsl bash /mnt/c/Users/Admin/Desktop/2025_B2/HyperLedgerFabric/tests/test1/try/fabric-samples/test-network/network.sh deployCC -ccn blockchain -ccl typescript -ccv 1.0 -ccs 1 -ccp ../chaincode/typescript -cci initLedger
start cmd /k "cd /d C:\Users\Admin\Desktop\2025_B2\HyperledgerFabric\tests\test1\try\frontend\my-hyperledger-frontend && npm start"
cd C:\Users\Admin\Desktop\2025_B2\HyperledgerFabric\tests\test1\try\fabric-samples\app-typescript
npm start
