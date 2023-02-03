const { network } = require("hardhat")
const {
    networkConfig,
    developmentChain,
    INITIAL,
    DECIMAL
} = require("../helper-hardhat-config")
//if (developmentChain[network.name])
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    if (developmentChain.includes(network.name)) {
        console.log("Local Network Detected! Deploying Mock....")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMAL, INITIAL]
        })
        log("Deployment to Mock done! Thank you......................")
    }
}

module.exports.tags = ["mock", "all"]
