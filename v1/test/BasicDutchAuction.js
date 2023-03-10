const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect, assert } = require("chai");

describe("Lock", function () {
  async function BasicDutchAuctiondeploy() {

    const [owner, otherAccount] = await ethers.getSigners();

    const BasicDutchAuction = await ethers.getContractFactory("Auction");
    const basicdutchauction = await BasicDutchAuction.deploy();
    // get default signer, in Signer abstraction form
    signer = ethers.provider.getSigner(0);

    // get default signer, but just the address!
    [signerAddress] = await ethers.provider.listAccounts();
    return { basicdutchauction, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Check if the starting block is 0", async function () {
      const { basicdutchauction, owner } = await loadFixture(BasicDutchAuctiondeploy);
      expect(await basicdutchauction.blocknumber()).to.equal(1);
    });

    it("Check if the initialPrice is 1600000000000000000 wei", async function () {
      var bigNum = BigInt("1600000000000000000");
      const { basicdutchauction, owner } = await loadFixture(BasicDutchAuctiondeploy);
      expect(await basicdutchauction.initialPrice()).to.equal(bigNum);
    });

    it("Accepts higher bid ", async function () {
      var bigNum = BigInt("1600000000000000000");
      const { basicdutchauction, owner } = await loadFixture(BasicDutchAuctiondeploy);
      await expect(basicdutchauction.receiveMoney({ value: bigNum })).eventually.to.ok;
    });

    it("Rejects lower bid", async function () {
      var bigNum = BigInt("1400000000000000000");
      const { basicdutchauction, owner } = await loadFixture(BasicDutchAuctiondeploy);
      await expect(basicdutchauction.receiveMoney({ value: bigNum })).to.be.revertedWith('Not enough ether sent.');
    });

    it("Rejects second bid ", async function () {
      var bigNum = BigInt("1600000000000000000");
      const { basicdutchauction, owner } = await loadFixture(BasicDutchAuctiondeploy);
      await expect(basicdutchauction.receiveMoney({ value: bigNum })).eventually.to.ok;
      await expect(basicdutchauction.receiveMoney({ value: bigNum })).to.be.revertedWith('Someone has already donated');
    });

    it("After block 10, price should be 1.5 ETH. Here, block number is 15", async function () {
      var priceBigNum = BigInt("1500000000000000000");
      const ModifyVariable = await ethers.getContractFactory("Auction");
      const contract = await ModifyVariable.deploy();
      await contract.deployed();
      await contract.modifyBlockNumber();
      const newX = await contract.blocknumber();
      assert.equal(newX.toNumber(), 15);
      expect(await contract.price()).to.equal(priceBigNum);
    });

  });


});
