// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Auction {
    uint256 public initialPrice = 5 ether;
    uint256 public immutable startAt;
    uint256 public immutable endsAt;
    uint256 public immutable reservePrice = 2 ether;
    uint256 public immutable offerPriceDecrement = 0.01 ether;
    uint256 public immutable numBlocksAuctionOpen = 10;
    address public donor;
    uint256 public finalPrice;

    constructor() {
        startAt = block.timestamp;
        endsAt = block.timestamp + 300 minutes;
        initialPrice = reservePrice + numBlocksAuctionOpen*offerPriceDecrement;
    }

    function price() public view returns (uint256) {
        if (endsAt < block.timestamp) {
            return reservePrice;
        }

        uint256 minutesElapsed = (block.timestamp - startAt) / 60;

        return initialPrice  - (minutesElapsed * offerPriceDecrement);
    }

    function receiveMoney() public payable {
        require(donor == address(0), "Someone has already donated");
        require(msg.value >= price(), "Not enough ether sent.");

        donor = msg.sender;
        finalPrice = price();
    }
}