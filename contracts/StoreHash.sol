// SPDX-License-Identifier: MIT 

pragma solidity >= 0.7.3;

contract storeHash {

    address public owner;

modifier onlyOwner() {
    // to restrict access to the storeFileHash function
    require(msg.sender == owner, "Not authorized");
    _;
  }

     constructor() {
    owner = msg.sender;
   }
    //to map the file name to the relevant file hash 

    mapping(string => bytes32) private fileHashes;

    //event to listen for changes or actions in the contract 

    event HashStored(string fileName, bytes32 fileHash); // log message gets recorded when something important happens inside the smart contract 

    // function to store the file hash on the blockchain

    function storeFileHash (string memory fileName, bytes32 fileHash) public onlyOwner {
           require(fileHashes[fileName] == 0, "Hash already exists");  //to check if hash already exists & to prevent overwriting
        fileHashes[fileName] = fileHash;
        emit HashStored(fileName, fileHash); //this will be emitted when a hash is stored
    }

    // function to get hash and compare 

    function getHash(string memory fileName) public view returns (bytes32) {
        return fileHashes[fileName];
    }
}