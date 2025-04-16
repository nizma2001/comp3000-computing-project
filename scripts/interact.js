const { ethers } = require("hardhat");
require("dotenv").config();

const contractABI = require("../artifacts/contracts/StoreHash.sol/storeHash.json").abi;

const contractAddress = process.env.CONTRACT_ADDRESS;
const privateKey = process.env.METAMASK_KEY;
const apiKey = process.env.API_KEY;

// node provider  - ALCHEMY
const alchemyProvider = new ethers.providers.AlchemyProvider("sepolia", apiKey); 

// signer - me 
const signer = new ethers.Wallet(privateKey, alchemyProvider);

// contract instance
const storeHashContract = new ethers.Contract(contractAddress, contractABI, signer);

// Example: Store a file hash
async function storeHash() {
    const fileName = "testFile.txt";
    const fileHash = "0x8b1a9953c4611296a827abf8c47804d78b1a9953c4611296a827abf8c47804d7";
    const trans = await storeHashContract.storeFileHash(fileName, fileHash);
    await trans.wait();
    console.log("Hash stored!");
}

// Example: Get a file hash
async function getHash(fileName) {
    const hash = await storeHashContract.getHash(fileName);
    console.log("Stored hash:", hash);
}

async function main() {
    await storeHash();
    await getHash("testFile.txt");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

