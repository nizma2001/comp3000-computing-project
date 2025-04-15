// SPDX-License-Identifier: MIT 

pragma solidity >= 0.7.3;

contract storeHash {
    event UpdatedMessage (string oldStr, string newStr); //declare event 

    string public message; //variable that will be stored permanently on the blockchain

    //Runs only once when the SC is deployed.

    constructor (string memory initMessage) {
        message = initMessage;
    }

    function update(string memory newMessage) public {
        string memory oldMsg = message;
        message = newMessage;
        emit UpdatedMessage(oldMsg, newMessage);
    }

}