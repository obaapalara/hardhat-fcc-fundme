const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    const deployer = (await getNamedAccounts()).deployer
    const fundMe = await ethers.getContract("FundMe", deployer)
    const transactionReceipt = await fundMe.withdraw()
    await transactionReceipt.wait(1)
    console.log("Thanks! Withdrawn!")
}

main()
    .then(() => {
        console.log("Withdraw script concluded with SUCCESS!")
        process.exit(0)
    })
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
