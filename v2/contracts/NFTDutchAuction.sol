// SPDX-License-Identifier: MIT
import "hardhat/console.sol";
pragma solidity >=0.7.0 <0.9.0;
interface IERC721 {
    function transferFrom(address _from, address _to, uint _nftId) external;
}
contract NFTDutchAuction {
    uint256 public blocknumber;
    uint256 public initialPrice = 5 ether;
    uint256 public immutable startAt;
    uint256 public immutable endsAt;
    uint256 public reservePrice = 1.5 ether;
    uint256 public offerPriceDecrement = 0.01 ether;
    uint256 public numBlocksAuctionOpen = 10;
    uint256 public finalPrice;
    uint256 public ethersent;
    IERC721 public immutable nft;
    uint public nftTokenId;
    address payable public immutable seller;
    address payable public  sender;

    constructor(address erc721TokenAddress, uint256 _nftTokenId, uint256 _reservePrice, uint256 _numBlocksAuctionOpen, uint256 _offerPriceDecrement) {
        startAt = block.number;
        endsAt = _numBlocksAuctionOpen;
        reservePrice = _reservePrice;
        numBlocksAuctionOpen = _numBlocksAuctionOpen;
        offerPriceDecrement = _offerPriceDecrement;
        initialPrice = reservePrice + numBlocksAuctionOpen*offerPriceDecrement;
        blocknumber = block.number;
        seller = payable(msg.sender);
        nft = IERC721(erc721TokenAddress);
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
         console.log("sender: ", sender);
         console.log("sender: ", msg.sender);
         console.log("Token ID: ", nftTokenId);
         console.log("Address 0", address(0));
         console.log("Address 1", address(1));
        // require(seller == address(0), "Someone has already bought the NFT");
        require(msg.value >= finalPrice, "Not enough ether sent.");
        nft.transferFrom(seller, msg.sender, nftTokenId);
        uint refund = msg.value - finalPrice;
        if (refund > 0) {
            payable(msg.sender).transfer(refund);
        }
        selfdestruct(seller);

    }

          function modifyBlockNumber() public {
    blocknumber = 15;
  }


}