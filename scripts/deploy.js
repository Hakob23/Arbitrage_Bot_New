

// const { computePoolAddress, FeeAmount } = require('@uniswap/v3-sdk')
// const { Token } = require('@uniswap/sdk-core')
// const IUniswapV3PoolABI = require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json')
// const { Pool } = require('@uniswap/v3-sdk')
const { ethers } = require('hardhat')

const erc20Abi = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "symbol",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "allowance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        }
      ],
      "name": "ERC20InsufficientAllowance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "balance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        }
      ],
      "name": "ERC20InsufficientBalance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidSpender",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]

const arbConAbi = [
    {
      "inputs": [
        {
          "internalType": "contract ISwapRouter",
          "name": "_swapRouter",
          "type": "address"
        },
        {
          "internalType": "contract IUniswapV3Factory",
          "name": "_factory",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_token0",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_token1",
          "type": "address"
        },
        {
          "internalType": "uint24",
          "name": "_feeTier1",
          "type": "uint24"
        },
        {
          "internalType": "uint24",
          "name": "_feeTier2",
          "type": "uint24"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "checkForArbitrage",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "factory",
      "outputs": [
        {
          "internalType": "contract IUniswapV3Factory",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "feeTier1",
      "outputs": [
        {
          "internalType": "uint24",
          "name": "",
          "type": "uint24"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "feeTier2",
      "outputs": [
        {
          "internalType": "uint24",
          "name": "",
          "type": "uint24"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint24",
          "name": "fee",
          "type": "uint24"
        }
      ],
      "name": "getPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "swapRouter",
      "outputs": [
        {
          "internalType": "contract ISwapRouter",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        }
      ],
      "name": "swapToken1forToken0",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "token0",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "token1",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

const swapConAbi = [
  {
    "inputs": [
      {
        "internalType": "contract ISwapRouter",
        "name": "_swapRouter",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "TOKEN0",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "TOKEN1",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "poolFee",
    "outputs": [
      {
        "internalType": "uint24",
        "name": "",
        "type": "uint24"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      }
    ],
    "name": "swapExactInputSingle",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountInMaximum",
        "type": "uint256"
      }
    ],
    "name": "swapExactOutputSingle",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "swapRouter",
    "outputs": [
      {
        "internalType": "contract ISwapRouter",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

async function main() {
    const [deployer] = await ethers.getSigners();

    const TOKEN0_ADDRESS = "0x07Af94D5bD598Ae45E162eb2D0A5F7bb71C3F77C"
    const TOKEN1_ADDRESS = "0x775C93773d366D4aA3c2Ad760D1206C89F680e94"
    const ARB_CONTRACT_ADDRESS = "0xbbe7e4189E334bBb95cbca51E8dAa65f3215E83C"
    const POOL_ADDRESS = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"

    const FACTORY_ADDRESS = "0x1F98431c8aD98523631AE4a59f267346ea31F984"
    const ROUTER_ADDRESS = "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD"

    const FEE_TIER1 = 500 // 0.05
    const FEE_TIER2 = 3000 // 0.3
    const FEE_TIER3 = 10000 // 1


    // Deploying Test Tokens and Arbirtrage Contract
    // const token0 = await ethers.deployContract("TestToken", ["TestToken0", "TT0", 15000000])
    // let tt0Address = await token0.getAddress();
    // console.log(tt0Address);
    // const token1 = await ethers.deployContract("TestToken", ["TestToken1", "TT1", 60000000])
    // let tt1Address = await token1.getAddress();
    // console.log(tt1Address);
    const arbContract = await ethers.deployContract("ArbitrageBot",  [TOKEN0_ADDRESS, TOKEN1_ADDRESS, FEE_TIER2, FEE_TIER3, ROUTER_ADDRESS, FACTORY_ADDRESS])
    let arbConAddress = await arbContract.getAddress();
    console.log(arbConAddress)

   

















    // console.log(await tt0.balanceOf(deployer));
    // console.log(await tt0.balanceOf(ARB_CONTRACT_ADDRESS));

    // let amount = parseUnits("50", 18)
    // let x = await tt0.transfer(ARB_CONTRACT_ADDRESS, 50*10^18)
    // await x.wait()

    // console.log(await tt0.balanceOf(deployer));
    // console.log(await tt0.balanceOf(ARB_CONTRACT_ADDRESS));
    
    

    

    

}
  

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});