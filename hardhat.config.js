/** @type import('hardhat/config').HardhatUserConfig */

//const { network } = require('hardhat');

require('dotenv').config();
require('@nomiclabs/hardhat-ethers');
module.exports = {
  solidity: "0.8.28",
};


const{ALCHEMY_API_KEY, METAMASK_KEY} = process.env;

module.exports = {
    solidity: "0.7.3",
    defaultNetwork: "sepolia",
    networks : {
      hardhat: {},
      sepolia: {
        url: ALCHEMY_API_KEY,
        accounts: [`0x${METAMASK_KEY}`]  //ethereum identityyh
      }
    },
}

//api key of alchemy

//wallet password

