Project: Dutch Auction

This project asks you to build a decentralized application for a Dutch Auction. The project has multiple milestones, one due every week until the last class of the semester. Each milestone will build upon the work of previous milestones. As noted in the syllabus, you have seven late-days across all homeworks throughout the semester.

  
Each milestone is due on the date specified in the table below. Submit each completed milestone to canvas as a link to a github repo and a tagged commit with the version #.

# Reading

1.  [Ethereum smart contract security](https://consensys.github.io/smart-contract-best-practices/). Note that your score on the homework will be reduced if you submit insecure code.
    
2.  [Hardhat](https://hardhat.org/). Go through their tutorials.
    
3.  [Solidity test coverage reporting](https://github.com/sc-forks/solidity-coverage). You must generate coverage reports for your tests.
    
4.  [Dutch auctions](https://en.wikipedia.org/wiki/Dutch_auction)
    
5.  [BasicDutchAuction.sol](https://drive.google.com/file/d/1X_kxWjEU-I7ZHxY2TX90_QP7xC94YqY0/view?usp=sharing): an incomplete, skeletal implementation of a Dutch auction that you’ll use for v1.0
    
6.  [Dutch Auction sample tests](https://drive.google.com/drive/folders/1cfIyRj8Qh3JtRXln85Qm7pPIWTpPAeZT?usp=sharing): Read through these old tests for the Du2tchAuction contract. You may use them to check your implementation, but you’ll likely need to rewrite them to work with hardhat. They were previously written for truffle.
    
7.  [OpenZeppellin contracts](https://docs.openzeppelin.com/)
    

1.  Use the ERC20, ERC721, and upgrade proxy from OpenZeppellin. Do not implement your own.
    

9.  [ReactJS](https://reactjs.org/): ReactJs is a large framework: you probably only need to know <5% of the framework to successfully do this assignment. Use Typescript instead of Javascript as much as you can. It will make development easier as your app gets more complicated.
    
10.  [Metamask](https://metamask.io/)
    
11.  [IPFS](https://docs.ipfs.tech/)
    

# Version 1.0

  

-   Create a new directory in your Github repo called v1.0 and initialize a new hardhat project.
    
-   Create a new contract called BasicDutchAuction.sol that implements a Dutch auction called as described below.
    
-   Write test cases to thoroughly test your contracts. Generate a Solidity coverage report and commit it to your repository.
    

  

The BasicDutchAuction.sol contract works as follows:

1.  The seller instantiates a DutchAuction contract to manage the auction of a single, physical item at a single auction event. The contract is initialized with the following parameters:
    

1.  reservePrice: the minimum amount of wei that the seller is willing to accept for the item
    
2.  numBlocksAuctionOpen: the number of blockchain blocks that the auction is open for
    
3.  offerPriceDecrement: the amount of wei that the auction price should decrease by during each subsequent block.
    

3.  The seller is the owner of the contract.
    
4.  The auction begins at the block in which the contract is created.
    
5.  The initial price of the item is derived from reservePrice, numBlocksAuctionOpen, and offerPriceDecrement: initialPrice = reservePrice + numBlocksAuctionOpen*offerPriceDecrement
    
6.  A bid can be submitted by any Ethereum externally-owned account.
    
7.  The first bid processed by the contract that sends wei greater than or equal to the current price is the winner. The wei should be transferred immediately to the seller and the contract should not accept any more bids. All bids besides the winning bid should be refunded immediately.
    

# Version 2.0

-   Create a new directory in your Github repo called v2.0 and initialize a new hardhat project.
    
-   Copy over any files you can reuse from the previous versions of this project into the directory for this version.
    
-   Understand how the [ERC721](https://docs.openzeppelin.com/contracts/4.x/erc721) contract works by downloading an off-the-shelf version from OpenZeppellin, and write test cases so you understand how to create NFT contracts, how to mint NFTs, and how to transfer them. ERC721 is the official name for Ethereum’s NFT contract specification.
    
-   To add contracts from OpenZeppellin into your project, definitely use npm to download them. The OpenZeppellin contracts have a lot of dependencies, and thus copying and pasting them will 1) take a lot of time, 2) will make it hard to upgrade to newer versions, 3) increase the vulnerability scope of your project, and 4) make it more likely for those contracts to get changed by you or your team.
    
-   Create a new contract called NFTDutchAuction.sol. It should have the same functionality as BasicDutchAuction.sol but it sells an NFT instead of a physical item. The constructor for the NFTDutchAuction.sol should be:
    

constructor(address erc721TokenAddress, uint256 _nftTokenId, uint256 _reservePrice, uint256 _numBlocksAuctionOpen, uint256 _offerPriceDecrement)

-   Add an upgrade proxy to make your NFTDutchAuction.sol upgradeable.
    

-   Read the documentation on [upgradeable contracts](https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable)
    

-   Write test cases to thoroughly test your contracts. Generate a Solidity coverage report and commit it to your repository under this version’s directory.
    

  

# Version 3.0

-   Create a new directory in your Github repo called v3.0 and initialize a new hardhat project.
    
-   Copy over any files you can reuse from the previous versions of this project into the directory for this version.
    
-   Create a new contract called NFTDutchAuction_ERC20Bids.sol. It should have the same functionality as NFTDutchAuction.sol but accepts only ERC20 bids instead of Ether.
    

-   The constructor for the NFTDutchAuction_ERC20Bids.sol should be: constructor(address erc20TokenAddress, address erc721TokenAddress, uint256 _nftTokenId, uint256 _reservePrice, uint256 _numBlocksAuctionOpen, uint256 _offerPriceDecrement)
    

-   Write test cases to thoroughly test your contracts. Generate a Solidity coverage report and commit it to your repository under this version’s directory.
    

  

# Version 4.0

-   Create a new directory in your Github repo called v4.0 and initialize a new hardhat project.
    
-   Implement a ReactJS user interface for your BasicDutchAuction.sol. The UI should enable a user to:
    

-   Deploy a new BasicDutchAuction and specify all the parameters for its constructor.
    
-   Look up a specific BasicDutchAuction by its address, view important information about the contract, and
    
-   Submit a bid
    

-   The UI should have three sections. Feel free to use the following layouts in your app, or something similar.
    

-   Section 1: Deployment
    

-   Inputs:
    

-   A textbox for each parameter in the constructor
    
-   A button called “Deploy”
    

-   Outputs:
    

-   A label with the address of the newly created BasicDutchAuction
    

-   Section 2: Look up info on an auction
    

-   Inputs:
    

-   A textbox for the address of a BasicDutchAction.
    
-   A button called “Show Info”
    

-   Outputs:
    

-   A label for each property of the BasicDutchAction:
    

-   Winner, if one already exists
    
-   Constructor parameters
    
-   Current price
    

-   Section 3: Submit a bid
    

-   Input:
    

-   A textbox for the address of a BasicDutchAction.
    
-   A textbox for the bid
    
-   A button called “Bid”
    

-   Outputs:
    

-   A label indicating whether the bid was accepted as the winner or not
    

-   Suggestions:
    

-   You’ll not be evaluated on user experience, performance, or aesthetics. Just functionality.
    
-   Note that this project is a web3 application, and thus should not need a server.
    
-   You may use the following links as starting points for your implementation, but note that their ReactJS code is a lot more than what’s needed for this assignment. We suggest that you use it as an example to learn from, but that you actually implement your UI from scratch and only include the code you need from the example.
    

-   Read: [https://support.chainstack.com/hc/en-us/articles/4408642503449-Using-MetaMask-with-a-Hardhat-node](https://support.chainstack.com/hc/en-us/articles/4408642503449-Using-MetaMask-with-a-Hardhat-node)
    
-   Read: [https://www.web3.university/article/how-to-build-a-react-dapp-with-hardhat-and-metamask](https://www.web3.university/article/how-to-build-a-react-dapp-with-hardhat-and-metamask)
    

-   You may use this starter repo:
    

-   [https://github.com/ChainShot/hardhat-ethers-react-ts-starter](https://github.com/ChainShot/hardhat-ethers-react-ts-starter)
    

  

# Version 5.0

-   Deploy your Version 4.0 smart contracts (BasicDutchAuction.sol) on [Goerli](https://www.alchemy.com/overviews/migrate-from-rinkeby-to-goerli), the Ethereum testnet.
    

-   This step will require getting test eth from a faucet.
    

-   Some faucets to try:
    

-   [https://goerlifaucet.com/](https://goerlifaucet.com/)
    

-   Sometimes these faucets can be unreliable so you’ll have to keep searching online for a faucet that gives you enough eth to successfully deploy your contract.
    
-   Hardhat can deploy your contracts for you: [https://hardhat.org/tutorial/deploying-to-a-live-network](https://hardhat.org/tutorial/deploying-to-a-live-network)
    

-   Host your UI through IPFS.
    

-   You will host your UI on your own machine, and you will use IPFS to enable others to access it through an ipfs:// url.
    

-   Get the CID of your build directory that contains your built UI, and prefix the CID with “ipfs://”.
    

-   For example if your CID is QmRgCTtKd91QkgoTiJQky57pCRda2drKEvTyFkUznaoKm3, the URL to access the content is ipfs://QmRgCTtKd91QkgoTiJQky57pCRda2drKEvTyFkUznaoKm3
    

-   Steps:
    

-   Generate build files for your UI
    
-   Install IPFS desktop and IPFS browser plugin.
    
-   Pin your UI build files to your IPFS Desktop node.
    
-   Add the IPFS url to your README.md file in your repo.
    

-   Present your fully functioning Version 5.0 during class on which this assignment is due:
    

-   Show that your contracts are deployed on a testnet
    
-   Show that your UI accessible by anyone through IPFS url
    
-   Show that users can interact with your UI through IPFS and the Metamask plugin by:
    

-   deploying a new BasicDutchAuction
    
-   submitting a winning bid
    

-   [Extra Credit] Use IPNS to generate a fixed name for your UI: [https://docs.ipfs.tech/concepts/ipns/#mutability-in-ipfs](https://docs.ipfs.tech/concepts/ipns/#mutability-in-ipfs)
    

  
  

TODO: Add more versions based on these solidity patterns:  
[https://github.com/dragonfly-xyz/useful-solidity-patterns](https://github.com/dragonfly-xyz/useful-solidity-patterns)