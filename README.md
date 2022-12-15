# smart-contract-event-listener

Implement a mechanism that can index events for a certain contract.

> _Note_
> 
> Inspiration from [Moralis Dashboard](https://www.youtube.com/watch?v=LMqqxkuo7b0)

## Suggestions 

1. [Infura]() account created for `web3.spec.js` integration
2. [_CareBear_ ERC-20 smart contract](https://polygonscan.com/address/0x6709660a6237723f278188bcae9e21b21eff8aab) deployed to Polygon main net
3. [Web3.js](https://web3js.readthedocs.io/en/v1.5.2/) installed

> _Note_
> 
> For testing purposes, we can only use the Polygon test net

> Note_
> 
> With my current Infura account I cannot listen to Polygon events
> so I am switching to mainnet Ethereum

## Open Questions

Q1. How are [proxy contracts](https://docs.openzeppelin.com/contracts/4.x/api/proxy) useful here? 

???

## References

1. https://blog.infura.io/post/getting-started-with-infuras-ethereum-api
2. https://docs.openzeppelin.com/contracts/4.x/api/proxy
3. [ERC-20 spec](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md)
> `event Transfer(address indexed _from, address indexed _to, uint256 _value)`


## Useful Links (remove after)

1. [Smart Contract Events · Web3.js · #6 Ethereum Blockchain Development Crash Course](https://www.youtube.com/watch?v=CX2QOE0FcEo)
2. [Web3.js Tutorial - Check all transactions to an Ethereum address in Node.js (in real-time)](https://www.youtube.com/watch?v=GSLEz-XxGY8)
3. [Hard hat](https://hardhat.org/tutorial/deploying-to-a-live-network)

### Web3.js tutorials

1. https://www.coinclarified.com/p/3-ways-to-subscribe-to-events-with-web3-js/
2. 