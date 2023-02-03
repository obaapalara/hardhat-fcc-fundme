const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    const sendValue = ethers.utils.parseEther("1")
    const deployer = (await getNamedAccounts()).deployer
    const fundMe = await ethers.getContract("FundMe", deployer)
    const transactionReceipt = await fundMe.fund({ value: sendValue })
    await transactionReceipt.wait(1)
    console.log("Funded successfully ")
}

main()
    .then(() => {
        process.exit(0)
    })
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
