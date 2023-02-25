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
    const [owner, contractaccount, otherAccount] = await ethers.getSigners();
    const NFTDutchAuction = await ethers.getContractFactory("NFTDutchAuction");

    //Mint NFT on the owner's account
    const TechnoCleverNFT = await ethers.getContractFactory("TCERC20");
    const technoclevernft = await TechnoCleverNFT.deploy();
    var bigNum = BigInt("10700000000000000000");
    //Mint NFT on the owner's account
    // await technoclevernft.safeMint(owner.getAddress(), { gasLimit: 250000, value: ethers.utils.parseEther("1.0") });

    // const deployedTCNFT = await ethers.getContractAt("TechnoCleverNFT", "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266").;

    // const deployedTCNFT = await (TechnoCleverNFT.attach(otherAccount.address));
    const transactionCount = await owner.getTransactionCount();
    const technoclevertokenaddress = getContractAddress({
      from: owner.address,
      nonce: transactionCount
    })

    const nftdutchauction = await NFTDutchAuction.deploy(technoclevertokenaddress, 1, ethers.utils.parseEther("1.0"), 10, ethers.utils.parseEther("0.01"));
    await technoclevernft.approve(technoclevertokenaddress, 1);
    // await nftdutchauction.connect(otherAccount).receiveMoney();
      // await expect(nftdutchauction.connect(owner).receiveMoney({value: bigNum}))
      // .to.emit(nftdutchauction, "Transfer")
      // .withArgs(owner.address, otherAccount.address);

    return { technoclevernft, owner, otherAccount, technoclevertokenaddress, nftdutchauction, contractaccount };
  }

  describe("Deployment", function () {
    it("Creates TCNFT NFT Token Collection", async function () {
      const { otherAccount, technoclevernft, technoclevertokenaddress
      } = await loadFixture(deployNFTDutchAuctionSmartContract);
      expect(await technoclevernft.name()).to.exist;
      expect(await technoclevernft.name()).to.equal('TC Coin');
      console.log("Contract address is", technoclevertokenaddress);
      console.log("Other account address is", otherAccount.address);
    });

    it("TCNFT Token is minted to owner", async function () {
      const { technoclevernft, owner } = await loadFixture(deployNFTDutchAuctionSmartContract);
      expect(await technoclevernft.balanceOf(owner.address)).to.equal("100");
    });


    it("NFTDutchAuction is deployed and initial price is 1.07ETH", async function () {
      const { nftdutchauction } = await loadFixture(deployNFTDutchAuctionSmartContract);
      expect(await nftdutchauction.price()).to.equal("1070000000000000000");
    });


    it("Check if the starting block is 0 & current block is 2 since we've deployed TC Coin Token & now deployed current contract", async function () {
      const { nftdutchauction, owner } = await loadFixture(deployNFTDutchAuctionSmartContract);
      expect(await nftdutchauction.blocknumber()).to.equal(2);
    });


    it("Accepts 1.07ETH bid ", async function () {
      var bigNum = BigInt("10700000000000000000");
      const { otherAccount, nftdutchauction, technoclevernft, owner } = await loadFixture(deployNFTDutchAuctionSmartContract);
      // await nftdutchauction.connect(otherAccount.address);
      await nftdutchauction.connect(otherAccount).receiveMoney({ value: bigNum, gasLimit: 250000 });
      // expect(nftdutchauction.connect(otherAccount.address).receiveMoney({ value: bigNum, gasLimit: 250000 })).to.eventually.ok;
      // expect(await nftdutchauction.receiveMoney({ value: bigNum, gasLimit: 250000 })).to.eventually.ok;

      // expect(await technoclevernft.balanceOf(owner.address)).to.equal(100);
      expect(await technoclevernft.balanceOf(otherAccount.address)).to.equal(0);

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



    // it("Balance of other account", async function () {
    //   const { owner, technoclevernft, otherAccount } = await loadFixture(deployNFTDutchAuctionSmartContract);
    //   const contract = await (await ethers.getContractFactory("NFTDutchAuction")).attach(otherAccount.address);
    //   await contract.connect(otherAccount.address);
    //   expect (await contract.receiveMoney({gasLimit: 250000, value:ethers.utils.parseEther("2")})).to.eventually.equal(''); 
    //   expect(await technoclevernft.balanceOf(otherAccount.address)).to.equal(99);

    // });

    // it("Call Receive Money", async function () {
    //   const { owner, technoclevernft, otherAccount } = await loadFixture(deployNFTDutchAuctionSmartContract);
    //   expect(await technoclevernft.balanceOf(owner.address)).to.equal(99);

    // });


    
  });

});
