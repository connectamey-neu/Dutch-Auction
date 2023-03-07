import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, assert } from "chai";
import { ethers, upgrades} from "hardhat";
import { getContractAddress } from "@ethersproject/address";


describe("NFTDutchAuction", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployNFTDutchAuctionSmartContract() {

    // Contracts are deployed using the first signer/account by default
    const [owner, contractaccount, otherAccount] = await ethers.getSigners();
    const NFTDutchAuction = await ethers.getContractFactory("NFTDutchAuction");
    const NFTDutchAuctionv2 = await ethers.getContractFactory("NFTDutchAuctionv2");
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

    // const nftdutchauction_with_proxy = await NFTDutchAuction.deploy(technoclevertokenaddress, 1, ethers.utils.parseEther("1.0"), 10, ethers.utils.parseEther("0.01"));
      const nftdutchauction_without_proxy = await NFTDutchAuction.deploy();
      const tcaddress = technoclevertokenaddress.toString();
      const originalnftauctionaddress = nftdutchauction_without_proxy.address.toString();
      const tokenid = "1";
      const reserveprice = ethers.utils.parseEther("1.0").toString();
      const noofblocks = "10";
      const offerdecrement = ethers.utils.parseEther("0.01").toString();
   const nftdutchauction_with_proxy = await upgrades.deployProxy(NFTDutchAuction, [originalnftauctionaddress, tokenid, reserveprice, noofblocks, offerdecrement], {  kind: 'uups', initializer: "initialize(address, uint256, uint256, uint256, uint256)",
   timeout: 0  } );
     
   
  //  await technoclevernft.approve(nftdutchauction_with_proxy.address, 100);
  // console.log("proxy contract address ", nftdutchauction_with_proxy.address);
  //  await technoclevernft.approve(nftdutchauction_with_proxy.address, 100);
    // const nftdutchauctionv2 = await NFTDutchAuction.deploy(technoclevertokenaddress, 1, ethers.utils.parseEther("1.0"), 10, ethers.utils.parseEther("0.01"));
    // await nftdutchauction_with_proxy.connect(otherAccount).receiveMoney();
      // await expect(nftdutchauction_with_proxy.connect(owner).receiveMoney({value: bigNum}))
      // .to.emit(nftdutchauction_with_proxy, "Transfer")
      // .withArgs(owner.address, otherAccount.address);

    return { tcaddress, tokenid, reserveprice, noofblocks, offerdecrement, NFTDutchAuction, technoclevernft, upgrades, owner, otherAccount, technoclevertokenaddress, nftdutchauction_with_proxy, NFTDutchAuctionv2, contractaccount, nftdutchauction_without_proxy };
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


    it("NFTDutchAuction is deployed and initial price is 1.05ETH", async function () {
      const { nftdutchauction_with_proxy } = await loadFixture(deployNFTDutchAuctionSmartContract);
      expect(await nftdutchauction_with_proxy.price()).to.equal("1050000000000000000");
    });


    it("Check if the starting block is 0 & current block is 4 since we've deployed TC Coin Token & now deployed current contract", async function () {
      const { nftdutchauction_with_proxy, owner } = await loadFixture(deployNFTDutchAuctionSmartContract);
      expect(await nftdutchauction_with_proxy.blocknumber()).to.equal(4);
    });

    it("Accepts 1.05ETH bid ", async function () {
      var bigNum = BigInt("10400000000000000000");
      const { contractaccount, otherAccount, nftdutchauction_with_proxy, technoclevernft, owner, technoclevertokenaddress, nftdutchauction_without_proxy } = await loadFixture(deployNFTDutchAuctionSmartContract);
      // await nftdutchauction_with_proxy.connect(otherAccount.address);
      // await nftdutchauction_with_proxy.connect(otherAccount).receiveMoney({ value: bigNum, gasLimit: 250000 });
      await expect(technoclevernft.approve(nftdutchauction_with_proxy.address, 100)).eventually.to.ok;
      await expect(technoclevernft.approve(contractaccount.address, 100)).eventually.to.ok;
      await expect(technoclevernft.approve(owner.address, 100)).eventually.to.ok;
      await expect(technoclevernft.approve(otherAccount.address, 100)).eventually.to.ok;
      await expect(technoclevernft.approve(technoclevertokenaddress, 100)).eventually.to.ok;
      await expect(technoclevernft.approve(nftdutchauction_without_proxy.address, 100)).eventually.to.ok;
      await expect(technoclevernft.approve(owner.address, 100)).eventually.to.ok;

      await expect(technoclevernft.allowance(owner.address, owner.address)).to.eventually.equal("100");
      const secondAddressSigner = await ethers.getSigner(otherAccount.address)
      await expect(technoclevernft.approve(secondAddressSigner.address, 100)).eventually.to.ok;
      // await expect(nftdutchauction_with_proxy.functions.receiveMoney({ value: bigNum, gasLimit: 250000, from: owner.address })).eventually.to.ok;
      const newcontract = nftdutchauction_with_proxy.connect(secondAddressSigner);
      console.log("new address is ", newcontract.address, " ", nftdutchauction_with_proxy.address);

      await expect(technoclevernft.approve(newcontract.address, 100)).eventually.to.ok;

      await newcontract.functions.receiveMoney({ value: bigNum, gasLimit: 250000 });
      
      await expect(technoclevernft.approve(newcontract.address, 100)).eventually.to.ok;
      // await expect(nftdutchauction_with_proxy.connect(secondAddressSigner).receiveMoney({ value: bigNum, gasLimit: 250000 })).to.eventually.ok;
      // await expect(nftdutchauction_with_proxy.connect(otherAccount.address)).to.eventually.ok;
      // await nftdutchauction_with_proxy.functions.receiveMoney({ value: bigNum, gasLimit: 250000});
      // expect(await nftdutchauction_with_proxy.functions.receiveMoney({value: bigNum, gasLimit: 250000})).to.eventually.ok;
      // await nftdutchauction_with_proxy.functions.receiveMoney();
      // expect(await nftdutchauction_with_proxy.receiveMoney({ value: bigNum, gasLimit: 250000 })).to.eventually.ok;
      // expect(await technoclevernft.balanceOf(owner.address)).to.equal(99);
      // expect(await technoclevernft.balanceOf(otherAccount.address)).to.equal(0);

      

    });

    it("Rejects lower bid", async function () {
      var bigNum = BigInt("100000000000000000");
      const { nftdutchauction_with_proxy, owner } = await loadFixture(deployNFTDutchAuctionSmartContract);
      await expect(nftdutchauction_with_proxy.receiveMoney({ value: bigNum })).to.be.revertedWith('Not enough ether sent.');
    });

    it("Rejects second bid ", async function () {
      var bigNum = BigInt("1600000000000000000");
      const { nftdutchauction_with_proxy, owner } = await loadFixture(deployNFTDutchAuctionSmartContract);
      await expect(nftdutchauction_with_proxy.receiveMoney({ value: bigNum })).to.be.reverted;
    });


    it("After block 10, price should be 1.5 ETH. Here, block number is 15", async function () {
      const { nftdutchauction_with_proxy, technoclevertokenaddress, owner } = await loadFixture(deployNFTDutchAuctionSmartContract);
      var priceBigNum = BigInt("1000000000000000000");
      await nftdutchauction_with_proxy.modifyBlockNumber();
      const newX = await nftdutchauction_with_proxy.blocknumber();
      await assert.equal(newX.toNumber(), 15);
      expect(await nftdutchauction_with_proxy.price()).to.equal(priceBigNum);
    });


    it("Checking version v1", async function () {
      const { nftdutchauction_with_proxy,technoclevertokenaddress, NFTDutchAuction} = await loadFixture(deployNFTDutchAuctionSmartContract);
      expect(await nftdutchauction_with_proxy.getMessage()).to.equal('In v1');
    });

    it("Proxy upgraded. Checking version v2 & testing everything we did on v1 above on v2", async function () {
      const { tcaddress, tokenid, reserveprice, noofblocks, offerdecrement, nftdutchauction_with_proxy,otherAccount, technoclevertokenaddress, NFTDutchAuction, NFTDutchAuctionv2} = await loadFixture(deployNFTDutchAuctionSmartContract);
      const nftdutchauction_with_proxy_v2 = await upgrades.upgradeProxy(nftdutchauction_with_proxy.address, NFTDutchAuctionv2);    
      expect(await nftdutchauction_with_proxy_v2.getMessage()).to.equal('In v2');
      expect(await nftdutchauction_with_proxy_v2.price()).to.equal("1030000000000000000");
      expect(await nftdutchauction_with_proxy_v2.blocknumber()).to.equal(4);

      var bigNum = BigInt("10500000000000000000");
      // await nftdutchauction_with_proxy.connect(otherAccount.address);
      // await nftdutchauction_with_proxy.connect(otherAccount).receiveMoney({ value: bigNum, gasLimit: 250000 });
      expect(nftdutchauction_with_proxy_v2.connect(otherAccount.address)
      .receiveMoney({ value: bigNum, gasLimit: 250000 })).to.eventually.ok;

      var bigNum2 = BigInt("11100000000000000000");
      // await nftdutchauction_with_proxy.connect(otherAccount.address);
      // await nftdutchauction_with_proxy.connect(otherAccount).receiveMoney({ value: bigNum, gasLimit: 250000 });
      expect(nftdutchauction_with_proxy_v2.connect(otherAccount.address)
      .receiveMoney({ value: bigNum2, gasLimit: 250000 })).to.eventually.ok;

      // expect(await nftdutchauction_with_proxy_v2.refund).to.equal("1");
      // expect(await nftdutchauction_with_proxy.receiveMoney({ value: bigNum, gasLimit: 250000 })).to.eventually.ok;
      // expect(await technoclevernft.balanceOf(owner.address)).to.equal(100);
      // expect(await technoclevernft.balanceOf(otherAccount.address)).to.equal(0);
      var bigNum = BigInt("100000000000000000");
      await expect(nftdutchauction_with_proxy_v2.receiveMoney({ value: bigNum })).to.be.revertedWith('Not enough ether sent.');
    

      var priceBigNum = BigInt("1000000000000000000");
      await nftdutchauction_with_proxy_v2.modifyBlockNumber();
      const newX = await nftdutchauction_with_proxy_v2.blocknumber();
      await assert.equal(newX.toNumber(), 15);
      expect(await nftdutchauction_with_proxy_v2.price()).to.equal(priceBigNum);
    });

  });



});