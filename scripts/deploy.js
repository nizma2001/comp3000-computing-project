const { ethers } = require("hardhat");

async function main () {
    //load the smart contract & deploy a new instance of the contract to the blockchain

    const storeHash = await ethers.getContractFactory("storeHash")

    const store_Hash = await storeHash.deploy("Hello World!");
    console.log("Contract deployed to address: ", store_Hash.address)

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });