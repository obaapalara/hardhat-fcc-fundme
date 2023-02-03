const { deployments, network, ethers } = require("hardhat") //@nomiclabs/hardhat-ethers
const { assert, expect } = require("chai")
const { developmentChain } = require("../../helper-hardhat-config")
require("./FundMe.test.js")

!developmentChain.includes(network.name)
    ? describe.skip
    : describe("FundMe", function() {
          //Arrange
          let fundMe
          let mockV3Aggregator
          let deployer
          let sendValue = ethers.utils.parseUnits("1", 18)

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              fundMe = await ethers.getContract("FundMe", deployer)
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
              //Act
              //Assert
          })

          describe("Constructor", function() {
              it("sets the aggregator address corectly", async () => {
                  const response = await fundMe.gets_priceFeedAddress()
                  assert.equal(response, mockV3Aggregator.address)
              })
          })

          describe("fund", function() {
              it("test the fund function, should fail if not enough ETH supplied", async () => {
                  // const transactionResponse = await fundMe.fund(0.1)
                  //await transactionResponse.wait(1)
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "You need to spend more ETH!"
                  )
              })

              it("Get address to amount funded", async () => {
                  //Arrange
                  await fundMe.fund({ value: sendValue })
                  const fundedAmount = await fundMe.getAddressToAmount(deployer)
                  assert.equal(fundedAmount.toString(), sendValue.toString())
              })

              it("Add funder to array of funders", async () => {
                  //Arrange:
                  await fundMe.fund({ value: sendValue })
                  const funders = await getNamedAccounts().deployer

                  assert.equal(funders, fundMe.funders[0])

                  //Act

                  //Assert
              })

              describe("withdraw", function() {
                  beforeEach(async () => {
                      await fundMe.fund({ value: sendValue })
                  })
                  it("testing withdraw from a single funder", async () => {
                      const startingFundmeBalance = await fundMe.provider.getBalance(
                          fundMe.address
                      )
                      const startingDeployerBalance = await fundMe.provider.getBalance(
                          deployer
                      )

                      const transactionResponse = await fundMe.withdraw()

                      const transactionReceipt = await transactionResponse.wait(
                          1
                      )
                      const { gasUsed, effectiveGasPrice } = transactionReceipt
                      const gasCost = gasUsed.mul(effectiveGasPrice)
                      const endingFundMeBalance = await fundMe.provider.getBalance(
                          fundMe.address
                      )
                      const endingDeployerBalance = await fundMe.provider.getBalance(
                          deployer
                      )

                      // Assert

                      assert.equal(endingFundMeBalance.toString(), 0)
                      assert.equal(
                          startingFundmeBalance
                              .add(startingDeployerBalance)
                              .toString(),
                          endingDeployerBalance.add(gasCost).toString()
                      )
                  })

                  it("Allow withdraw with multiple funders", async () => {
                      const accounts = await ethers.getSigners()
                      for (i = 0; i < 6; i++) {
                          const fundMeConnectContract = await fundMe.connect(
                              accounts[i]
                          )
                      }

                      const startingFundmeBalance = await fundMe.provider.getBalance(
                          fundMe.address
                      )
                      const startingDeployerBalance = await fundMe.provider.getBalance(
                          deployer
                      )

                      const transactionResponse = await fundMe.withdraw()
                      const transactionReceipt = await transactionResponse.wait(
                          1
                      )
                      const { gasUsed, effectiveGasPrice } = transactionReceipt
                      const gasCost = gasUsed.mul(effectiveGasPrice)
                      const endingDeployerBalance = await fundMe.provider.getBalance(
                          deployer
                      )
                      const endingFundMeBalance = await fundMe.provider.getBalance(
                          fundMe.address
                      )
                      assert.equal(endingFundMeBalance.toString(), 0)
                      assert.equal(
                          startingFundmeBalance
                              .add(startingDeployerBalance)
                              .toString(),
                          endingDeployerBalance.add(gasCost).toString()
                      )
                      await expect(fundMe.getFunder(0)).to.be.reverted

                      for (i = 0; i < 6; i++) {
                          assert.equal(
                              await fundMe.getAddressToAmount(
                                  accounts[i].address
                              ),
                              0
                          )
                      }
                  })
                  it("Only allow the owner to withdraw", async () => {
                      //Arrange
                      const intruder = await ethers.getSigners()
                      const intruderContractConnect = await fundMe.connect(
                          intruder[0]
                      )
                      await expect(intruderContractConnect.withdraw()).to.be
                          .reverted

                      //Act
                      //Assert
                  })
              })
          })
      })
