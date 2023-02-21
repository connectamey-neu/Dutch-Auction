import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

describe("TechnoCleverNFT", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployTechnoCleverNFTSmartContract() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    const TechnoCleverNFT = await ethers.getContractFactory("TechnoCleverNFT");
    const technoclevernft = await TechnoCleverNFT.deploy();
    //Mint NFT on the owner's account
    await technoclevernft.safeMint(owner.getAddress(), {gasLimit: 250000, value:ethers.utils.parseEther("1.0")});
    return { technoclevernft, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Creates a token collection with a name", async function () {
      const { technoclevernft } = await loadFixture(deployTechnoCleverNFTSmartContract);
      expect(await technoclevernft.name()).to.exist;
      expect(await technoclevernft.name()).to.equal('TechnoCleverNFT');
    });

    it("Creates a token collection with a symbol", async function () {
      const { technoclevernft } = await loadFixture(deployTechnoCleverNFTSmartContract);
      expect(await technoclevernft.symbol()).to.equal('TC');
    });

    it("Token is minted to owner", async function () {
      const { technoclevernft, owner } = await loadFixture(deployTechnoCleverNFTSmartContract);
      expect(await technoclevernft.ownerOf(1)).to.equal(owner.address);
    });

    it("Owner only has 1 token", async function () {
      const { technoclevernft, owner } = await loadFixture(deployTechnoCleverNFTSmartContract);
      expect(await technoclevernft.balanceOf(owner.getAddress())).to.equal(1);
    });

    it("Owner can transfer token to other address. Owner balance = 0, otherAccount balance = 1", async function () {
      const { technoclevernft, owner, otherAccount } = await loadFixture(deployTechnoCleverNFTSmartContract);
      expect(await technoclevernft.transferFrom(owner.address, otherAccount.address, 1)).to.exist;
      expect(await technoclevernft.balanceOf(owner.getAddress())).to.equal(0);
      expect(await technoclevernft.balanceOf(otherAccount.getAddress())).to.equal(1);
    });

  });

});
