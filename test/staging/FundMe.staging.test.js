const { ethers, network, getNamedAccounts } = require("hardhat")
const { developmentChain } = require("../../helper-hardhat-config")
const { assert } = require("chai")

developmentChain.includes(network.name)
    ? describe.skip
    : describe("Staging Test", function() {
          const sendValue = ethers.utils.parseEther("0.1")
          let fundMe
          beforeEach(async () => {
              const deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("FundMe", deployer)
          })
          it("Allow people to fund and withdraw", async () => {
              const fundTxResponse = await fundMe.fund({ value: sendValue })
              const fundTxReceipt = await fundTxResponse.wait(1)
              const withdrawTxResponse = await fundMe.withdraw()
              const withdrawTxReceipt = await withdrawTxResponse.wait(1)
              const endingFundMeBalance = await fundMe.provider.getBalance(
                  fundMe.address
              )

              assert.equal(endingFundMeBalance.toString(), 0)
          })
      })
