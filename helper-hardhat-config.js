const DECIMAL = 8
const INITIAL = 20000000000
const developmentChain = ["localhost", "hardhat"]
const networkConfig = {
    5: {
        name: "goerli",
        ethUSDAddress: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },

    31337: {
        name: "localhost",
        ethUSDAddress: "ethUSFeedAddress",
    },
}

module.exports = {
    networkConfig,
    developmentChain,
    INITIAL,
    DECIMAL,
}
