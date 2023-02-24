import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, assert } from "chai";
import { ethers } from "hardhat";
import { getContractAddress } from "@ethersproject/address";


describe("NFTDutchAuction", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployNFTDutchAuctionSmartContract() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    const NFTDutchAuction = await ethers.getContractFactory("NFTDutchAuction");

    //Mint NFT on the owner's account
    const TechnoCleverNFT = await ethers.getContractFactory("TechnoCleverNFT");
    const technoclevernft = await TechnoCleverNFT.deploy();

    //Mint NFT on the owner's account
    await technoclevernft.safeMint(owner.getAddress(), { gasLimit: 250000, value: ethers.utils.parseEther("1.0") });

    // const deployedTCNFT = await ethers.getContractAt("TechnoCleverNFT", "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266").;

    // const deployedTCNFT = await (TechnoCleverNFT.attach(otherAccount.address));
    const transactionCount = await owner.getTransactionCount();
    const technoclevertokenaddress = getContractAddress({
      from: owner.address,
      nonce: transactionCount
    })

    const nftdutchauction = await NFTDutchAuction.deploy(technoclevertokenaddress, 1, ethers.utils.parseEther("1.0"), 10, ethers.utils.parseEther("0.01"));
    // await technoclevernft.approve(technoclevertokenaddress, 1);
    return { technoclevernft, owner, otherAccount, technoclevertokenaddress, nftdutchauction };
  }

  describe("Deployment", function () {
    it("Creates TCNFT NFT Token Collection", async function () {
      const { owner, technoclevernft, technoclevertokenaddress, otherAccount, nftdutchauction } = await loadFixture(deployNFTDutchAuctionSmartContract);
      expect(await technoclevernft.name()).to.exist;
      expect(await technoclevernft.name()).to.equal('TechnoCleverNFT');
      console.log("Contract address is", technoclevertokenaddress);
      console.log("Owner account address is", owner.address);
      console.log("Other account address is", otherAccount.address);
      expect(await technoclevernft.balanceOf(owner.getAddress())).to.equal(1);
      // expect (await nftdutchauction.receiveMoney({gasLimit: 250000, value:ethers.utils.parseEther("2")})).to.eventually.ok;
    });

    it("TCNFT Token is minted to owner", async function () {
      const { technoclevernft, owner } = await loadFixture(deployNFTDutchAuctionSmartContract);
      expect(await technoclevernft.ownerOf(1)).to.equal(owner.address);
    });

    it("Balance of owner is 1", async function () {
      const { technoclevernft, owner } = await loadFixture(deployNFTDutchAuctionSmartContract);
      expect(await technoclevernft.balanceOf(owner.getAddress())).to.equal(1);
    });


    it("NFTDutchAuction is deployed and initial price is 1.07ETH", async function () {
      const { nftdutchauction } = await loadFixture(deployNFTDutchAuctionSmartContract);
      expect(await nftdutchauction.price()).to.equal("1070000000000000000");
    });


    it("Check if the starting block is 0 & current block is 3 since we've deployed NFT, minted & now deployed current contract", async function () {
      const { nftdutchauction, owner } = await loadFixture(deployNFTDutchAuctionSmartContract);
      expect(await nftdutchauction.blocknumber()).to.equal(3);
    });


    it("Accepts higher bid ", async function () {
      var bigNum = BigInt("20000000000000000000");
      const { nftdutchauction } = await loadFixture(deployNFTDutchAuctionSmartContract);
      await expect(nftdutchauction.receiveMoney({ value: bigNum })).to.exist;
    });

    it("Rejects lower bid", async function () {
      var bigNum = BigInt("100000000000000000");
      const { nftdutchauction, owner } = await loadFixture(deployNFTDutchAuctionSmartContract);
      await expect(nftdutchauction.receiveMoney({ value: bigNum })).to.be.revertedWith('Not enough ether sent.');
    });

    it("Rejects second bid ", async function () {
      var bigNum = BigInt("1600000000000000000");
      const { nftdutchauction, owner } = await loadFixture(deployNFTDutchAuctionSmartContract);
      await expect(nftdutchauction.receiveMoney({ value: bigNum })).to.be.reverted;
    });


    it("After block 10, price should be 1.5 ETH. Here, block number is 15", async function () {
      const { technoclevertokenaddress, owner } = await loadFixture(deployNFTDutchAuctionSmartContract);
      var priceBigNum = BigInt("1000000000000000000");
      const ModifyVariable = await ethers.getContractFactory("NFTDutchAuction");
      const contract = await ModifyVariable.deploy(technoclevertokenaddress, 1, ethers.utils.parseEther("1.0"), 10, ethers.utils.parseEther("0.01")); await contract.deployed();
      await contract.modifyBlockNumber();
      const newX = await contract.blocknumber();
      assert.equal(newX.toNumber(), 15);
      expect(await contract.price()).to.equal(priceBigNum);
    });


    it("Approve technoclevernft for transfer function", async function () {
      const { technoclevernft, otherAccount, nftdutchauction, technoclevertokenaddress } = await loadFixture(deployNFTDutchAuctionSmartContract);

      expect (await technoclevernft.approve(technoclevertokenaddress, 1)).to.exist;

    });


    // it("Call Receive Money", async function () {
    //   const { otherAccount, nftdutchauction } = await loadFixture(deployNFTDutchAuctionSmartContract);
    //   // await technoclevernft.approve(technoclevertokenaddress, 1)
    //   // expect(await technoclevernft.approve(technoclevertokenaddress, 1)).to.reverted;
    //   // expect(await nftdutchauction.receiveMoney({gasLimit: 250000, value:ethers.utils.parseEther("2")})).to.be.reverted;
    //   const contract = await (await ethers.getContractFactory("NFTDutchAuction")).attach(otherAccount.address);
    //   expect (await contract.receiveMoney({gasLimit: 250000, value:ethers.utils.parseEther("2")})).to.eventually.ok;
    // });

    // it("Balance of other account is 1", async function () {
    //   const { technoclevernft, owner, otherAccount } = await loadFixture(deployNFTDutchAuctionSmartContract);
    //   expect(await technoclevernft.balanceOf(otherAccount.getAddress())).to.equal(1);
    // });
  });

});
