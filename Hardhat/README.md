# Hardhat Project

Please include a .env file which have your mnemonic/SECRET_RECOVERY backup phase. 
To learn more: [Hardhat HD Wallet Config](https://hardhat.org/hardhat-runner/docs/config#hd-wallet-config)

This will allow you to use the Metamask or any other Provider. Do not use this on your main account. 

Try running some of the following tasks:

```shell
// Start the local etheruem network
npx hardhat node

// Run Test scripts
npx hardhat test

// Deploy the Campaign contracts and the profile Contracts(for future usage)
npx hardhat run --network localhost scripts/deploy.js
```
