// SPDX-License-Identifier: MIT
import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

// pragma solidity ^0.8.17;
interface IERC20 {
    function transferFrom(address _from, address _to, uint _nftId) external;
    function balanceOf(address account) external;
}
contract NFTDutchAuctionv2 is Initializable, ERC20Upgradeable, OwnableUpgradeable, UUPSUpgradeable{
    uint256 public blocknumber;
    // uint256 public initialPrice = 5 ether;
    uint256 public initialPrice;
    uint256 public startAt;
    uint256 public endsAt;
    // uint256 public reservePrice = 1.5 ether;
    // uint256 public offerPriceDecrement = 0.01 ether;
    // uint256 public numBlocksAuctionOpen = 10;
    uint256 public reservePrice;
    uint256 public offerPriceDecrement;
    uint256 public numBlocksAuctionOpen;
    uint256 public finalPrice;
    uint256 public ethersent;
    IERC20 public nft;
    uint public nftTokenId;
    address payable public seller;
    address payable public sender;
    uint refund;
    // uint256 public balanceOfSender;

    
    // constructor() {
    //     // startAt = block.number;
    //     // endsAt = _numBlocksAuctionOpen;
    //     // reservePrice = _reservePrice;
    //     // numBlocksAuctionOpen = _numBlocksAuctionOpen;
    //     // offerPriceDecrement = _offerPriceDecrement;
    //     // initialPrice = reservePrice + numBlocksAuctionOpen*offerPriceDecrement;
    //     // blocknumber = block.number;
    //     // seller = payable(msg.sender);
    //     // nft = IERC20(erc20TokenAddress);
    //     // nftTokenId = _nftTokenId;
    //      _disableInitializers();
    // }


    function initialize(address erc20TokenAddress, uint256 _nftTokenId, uint256 _reservePrice, uint256 _numBlocksAuctionOpen, uint256 _offerPriceDecrement) initializer public {
        __ERC20_init("NEW COIN", "NC");
        __Ownable_init();
        __UUPSUpgradeable_init();
        startAt = block.number;
        endsAt = _numBlocksAuctionOpen;
        reservePrice = _reservePrice;
        numBlocksAuctionOpen = _numBlocksAuctionOpen;
        offerPriceDecrement = _offerPriceDecrement;
        initialPrice = reservePrice + numBlocksAuctionOpen*offerPriceDecrement;
        blocknumber = block.number;
        seller = payable(msg.sender);
        nft = IERC20(erc20TokenAddress);
        nftTokenId = _nftTokenId;
    }
    

    function price() public view returns (uint256) {
        if (endsAt < blocknumber) {
            return reservePrice;
        }

        return initialPrice  - (block.number * offerPriceDecrement);

    }

    function receiveMoney() public payable {
        finalPrice = price();
         console.log("seller: ", seller);
         console.log("sender: ", msg.sender);
         console.log("Token ID: ", nftTokenId);
         console.log("address 1: ", address(1));
        require(msg.value >= finalPrice, "Not enough ether sent.");
        refund = msg.value - finalPrice;
        console.log("refund: ", refund);
        console.log("finalprice: ", finalPrice);
        nft.transferFrom(seller, msg.sender, nftTokenId);
        // if (refund > 0) {
        //     payable(msg.sender).transfer(refund);
        // }
        // selfdestruct(seller);


    }
      function modifyBlockNumber() public {
    blocknumber = 15;
  }
    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}

             function getMessage()public pure returns(string memory){
 return "In v2";
 }
}

