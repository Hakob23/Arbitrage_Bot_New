// test/ArbitrageBot.test.js
const { expect } = require('chai');
const { ethers } = require('hardhat');

const { parseEther } = ethers.utils;

describe('ArbitrageBot', function () {
    let ArbitrageBot;
    let arbitrageBot;
    let MockERC20;
    let mockTokenIn;
    let mockTokenOut;
    let MockSwapRouter;
    let mockSwapRouter;
    let MockUniswapV3Factory;
    let mockUniswapV3Factory;
    let owner;
    let addr1;

    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();

        MockERC20 = await ethers.getContractFactory('MockERC20');
        mockTokenIn = await MockERC20.deploy('TokenIn', 'TI', 18, parseEther('1000'));
        mockTokenOut = await MockERC20.deploy('TokenOut', 'TO', 18, parseEther('4000'));

        MockSwapRouter = await ethers.getContractFactory('MockSwapRouter');
        mockSwapRouter = await MockSwapRouter.deploy();

        MockUniswapV3Factory = await ethers.getContractFactory('MockUniswapV3Factory');
        mockUniswapV3Factory = await MockUniswapV3Factory.deploy();

        ArbitrageBot = await ethers.getContractFactory('ArbitrageBot');
        arbitrageBot = await ArbitrageBot.deploy(
            mockTokenIn.address,
            mockTokenOut.address,
            10000, // lowFeeTier
            3000,  // highFeeTier
            mockSwapRouter.address,
            mockUniswapV3Factory.address
        );

        // Transfer initial balances to ArbitrageBot
        await mockTokenIn.transfer(arbitrageBot.address, parseEther('1000'));
        await mockTokenOut.transfer(arbitrageBot.address, parseEther('1000'));
    });

    it('should execute arbitrage successfully', async function () {
        // Execute arbitrage with an initial amount
        const initialAmountIn = parseEther('1');
        const initialAmountOut = await arbitrageBot.executeArbitrage(initialAmountIn);

        // Check that ArbitrageBot received the correct amount of output tokens
        expect(await mockTokenOut.balanceOf(arbitrageBot.address)).to.equal(initialAmountOut);

        // Check that the ArbitrageBot's balance of tokenIn decreased
        expect(await mockTokenIn.balanceOf(arbitrageBot.address)).to.equal(
            parseEther('1000').sub(initialAmountIn)
        );

        // Check that the ArbitrageBot's balance of tokenOut increased
        expect(await mockTokenOut.balanceOf(arbitrageBot.address)).to.equal(initialAmountOut);
    });

    it('should not execute arbitrage when lowFeeTier has higher price', async function () {
        // Set a higher price for lowFeeTier than highFeeTier
        await mockUniswapV3Factory.setPoolPrice(mockTokenIn.address, mockTokenOut.address, 10000, 20000);

        // Execute arbitrage with an initial amount
        const initialAmountIn = parseEther('1');
        const initialAmountOut = await arbitrageBot.executeArbitrage(initialAmountIn);

        // Check that ArbitrageBot did not receive any output tokens
        expect(initialAmountOut).to.equal(0);
    });

    it('should not allow non-owner to execute arbitrage', async function () {
        // Execute arbitrage with an initial amount using a non-owner address
        await expect(
            arbitrageBot.connect(addr1).executeArbitrage(parseEther('1'))
        ).to.be.revertedWith('Only the owner can call this function');
    });

    it('should not execute arbitrage with insufficient balance', async function () {
        // Set ArbitrageBot's balance of tokenIn to 0
        await mockTokenIn.transfer(arbitrageBot.address, 0);

        // Execute arbitrage with an initial amount
        const initialAmountIn = parseEther('1');
        const initialAmountOut = await arbitrageBot.executeArbitrage(initialAmountIn);

        // Check that ArbitrageBot did not receive any output tokens
        expect(initialAmountOut).to.equal(0);
    });

    it('should return the correct price for a given fee tier', async function () {
        // Set a specific price for a fee tier
        await mockUniswapV3Factory.setPoolPrice(mockTokenIn.address, mockTokenOut.address, 10000, 15000);

        // Get the expected price based on the set pool price
        const expectedPrice = 15000 * 15000 * 1e18 / (2 ** 192);

        // Get the price using the ArbitrageBot contract
        const actualPrice = await arbitrageBot.getPrice(10000);

        // Check that the actual price matches the expected price
        expect(actualPrice).to.equal(expectedPrice);
    });

    it('should revert if trying to get price for non-existent pool', async function () {
        // Attempt to get the price for a non-existent pool
        await expect(arbitrageBot.getPrice(12345)).to.be.revertedWith('VM Exception while processing transaction: revert');
    });
});
