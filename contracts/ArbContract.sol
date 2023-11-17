// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';

contract ArbitrageBot {
    using SafeERC20 for IERC20;

    // State variables
    ISwapRouter public swapRouter;
    IUniswapV3Factory public swapFactory;
    address public owner;
    uint24 public lowFeeTier;
    uint24 public highFeeTier;
    IERC20 public tokenIn;
    IERC20 public tokenOut;

    // Constructor initializes the ArbitrageBot contract.
    // @param _tokenIn Address of the input token.
    // @param _tokenOut Address of the output token.
    // @param _lowFeeTier Fee tier for the low fee pool.
    // @param _highFeeTier Fee tier for the high fee pool.
    // @param _swapRouterAddress Address of the Uniswap V3 SwapRouter contract.
    // @param _swapFactory Address of the Uniswap V3 Factory contract.
    constructor(
        IERC20 _tokenIn,
        IERC20 _tokenOut,
        uint24 _lowFeeTier,
        uint24 _highFeeTier,
        address _swapRouterAddress,
        address _swapFactory
    ) {
        tokenIn = _tokenIn;
        tokenOut = _tokenOut;
        lowFeeTier = _lowFeeTier;
        highFeeTier = _highFeeTier;
        swapRouter = ISwapRouter(_swapRouterAddress);
        swapFactory = IUniswapV3Factory(_swapFactory);
        owner = msg.sender;
    }

    // Modifier to restrict function access to the owner only.
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    // Executes an arbitrage between Uniswap V3 pools with different fee tiers.
    // @param amountIn The amount of input tokens to be used for the arbitrage.
    // @return The amount of output tokens received after the arbitrage.
    function executeArbitrage(uint256 amountIn) external onlyOwner returns(uint256) {
        // Step 1: Check the price difference between the two fee tiers
        uint256 priceLowFee = getPrice(lowFeeTier);
        uint256 priceHighFee = getPrice(highFeeTier);

        // Arbitrage is profitable if priceLowFee is significantly lower than priceHighFee
        if (priceLowFee < priceHighFee) {
            // Step 2: Perform the arbitrage
            uint256 amountOut = swapBetweenFeeTiers(amountIn);

            // Step 3: Transfer the proceeds to the contract owner
            tokenOut.safeTransfer(owner, amountOut);
            return amountOut;
        }
        
        return 0;
    }

    // Gets the current price of the Uniswap V3 pool for a given fee tier.
    // @param feeTier The fee tier of the Uniswap V3 pool.
    // @return The price of the Uniswap V3 pool for the given fee tier.
    function getPrice(uint24 feeTier) public view returns (uint256) {
        IUniswapV3Pool pool = IUniswapV3Pool(
            IUniswapV3Factory(swapFactory).getPool(address(tokenIn), address(tokenOut), feeTier)
        );
        (uint160 sqrtPriceX96, , , , , , ) = pool.slot0();
        return uint256(sqrtPriceX96) * uint256(sqrtPriceX96) * 1e18 / (2**192);
    }

    // Executes swaps between Uniswap V3 pools with different fee tiers.
    // @param amountIn The amount of input tokens to be used for the swaps.
    // @return The amount of output tokens received after the swaps.
    function swapBetweenFeeTiers(uint256 amountIn)
        private
        returns (uint256)
    {
        // Step 2.1: Swap from low fee tier to high fee tier
        TransferHelper.safeTransferFrom(address(tokenIn), msg.sender, address(this), amountIn);
        TransferHelper.safeApprove(address(tokenIn), address(swapRouter), amountIn);

        uint256 amountOut = swapRouter.exactInputSingle(
            ISwapRouter.ExactInputSingleParams({
                tokenIn: address(tokenIn),
                tokenOut: address(tokenOut),
                fee: lowFeeTier,
                recipient: address(this),
                deadline: block.timestamp + 300,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            })
        );

        TransferHelper.safeApprove(address(tokenIn), address(swapRouter), amountOut);

        // Step 2.2: Swap back from high fee tier to low fee tier
        amountOut = swapRouter.exactInputSingle(
            ISwapRouter.ExactInputSingleParams({
                tokenIn: address(tokenOut),
                tokenOut: address(tokenIn),
                fee: highFeeTier,
                recipient: address(this),
                deadline: block.timestamp + 300,
                amountIn: amountOut,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            })
        );

        return amountOut;
    }
}
