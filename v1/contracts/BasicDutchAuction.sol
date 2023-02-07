// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Auction {
    uint256 public blocknumber;
    uint256 public offerprice = 0 ether;
    uint256 public initialPrice = 5 ether;
    uint256 public immutable startAt;
    uint256 public immutable endsAt;
    uint256 public immutable reservePrice = 1.5 ether;
    uint256 public immutable offerPriceDecrement = 0.01 ether;
    uint256 public immutable numBlocksAuctionOpen = 10;
    address public donor;
    uint256 public finalPrice;

    constructor() {
        startAt = block.number;
        endsAt = 10;
        initialPrice = reservePrice + numBlocksAuctionOpen*offerPriceDecrement;
        blocknumber = block.number;
    }

    function price() public view returns (uint256) {
        if (endsAt < blocknumber) {
            return reservePrice;
        }

        return initialPrice  - (block.number * offerPriceDecrement);

    }

    function receiveMoney() public payable {
        require(donor == address(0), "Someone has already donated");
        require(msg.value >= price(), "Not enough ether sent.");

        donor = msg.sender;
        finalPrice = price();
    }

      function modifyBlockNumber() public {
    blocknumber = 15;
  }
}