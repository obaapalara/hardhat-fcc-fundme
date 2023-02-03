const { networkConfig, developmentChain } = require("../helper-hardhat-config")
const chainId = network.config.chainId
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    if (chainId == 31337) {
        const mockV3AggregatorContract = await deployments.get(
            "MockV3Aggregator"
        )
        ethUSFeedAddress = mockV3AggregatorContract.address
    } else {
        ethUSFeedAddress = networkConfig[chainId]["ethUSDAddress"]
    }
    const { deploy, log } = hre.deployments
    const { deployer } = await getNamedAccounts()
    console.log("deploymentment on-going......................")
    let FundMe = await deploy("FundMe", {
        contract: "FundMe",
        from: deployer,
        log: true,
        args: [ethUSFeedAddress],
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    console.log(`${FundMe.address}`)
    console.log("deploymentment on-going......................")

    //Verify
    if (!developmentChain.includes(network.name) && process.env.ETHERSCAN_KEY)
        await verify(FundMe.address, [ethUSFeedAddress])
}

module.exports.tags = ["fundme", "all"]
