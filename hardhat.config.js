require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    goerli: {
      url: "https://goerli.infura.io/v3/APIKEY",
      accounts: ["PrivateKey"]
    },
    sepolia: {
      url: "https://sepolia.infura.io/v3/APIKEY",
      accounts: ["PrivateKey"]
    },
    hardhat: {
      chainId: 31337,
      forking: {
        enabled: true,
        url: 'https://goerli.infura.io/v3/APIKEY',
        accounts: ["PrivateKey"]
      },

    },
  },
  
};
