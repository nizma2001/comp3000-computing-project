// src/utils/blockchainUtils.js
import { ethers } from "ethers";
import contractABI from '../abi/storeHash.json';

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS; // deployed contract addr

export const getStoredHash = async (hash) => {
    if (!window.ethereum) {
        throw new Error("MetaMask is not installed"); //debug 
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

    try {
        const isStored = await contract.hashes(hash);
        return isStored;
    } catch (error) {
        console.error("Error verifying hash from blockchain:", error);
        return false;
    }
};


