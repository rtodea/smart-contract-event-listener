# 📑 🛰 📡 Smart Contract Events Indexer 

Implement a mechanism that can index events for a certain smart contract.

Suggestions:

1. [Infura](https://www.infura.io/) account created for externalizing node calls
2. [_CareBear_ ERC-20 smart contract](https://polygonscan.com/address/0x6709660a6237723f278188bcae9e21b21eff8aab) deployed to Polygon main net


## 👨‍💻 Study Notes

- [x] crash course on web3 concepts (block, smart contract)
- [x] install MetaMask
- [x] play around with Remix
- [x] different types of chains (main vs test) (Ethereum vs Polygon)
- [x] what is ERC-20 (`Transfer` event)
- [x] code using `web3.js` and `ethers.js`
- [x] set up `Infura` account (cannot use Polygon with free account)
- [x] code solution


## 💡 Inspiration

In the following video from [Moralis Dashboard overview](https://www.youtube.com/watch?v=LMqqxkuo7b0):

1. create a server / sync service
2. input the contract address and ABI
3. input event name you want to listen to
4. input table name where the events will be stored


## 🏗️ Solution Overview

<img src="./docs/images/components.png" alt="components">

Main Parts:

1. `infura` websocket connection for listening to ethereum main net
2. message broker (`kafka`) for decoupling the event listener and the event processor
3. [`listener`](./listener/listener.js) --- event listener connects to chain and broadcasts
4. [`indexer`](./indexer/indexer.js) --- event processor listens to the message broker and adds to storage

Sequence Diagram:

```mermaid
sequenceDiagram
    participant Infura as Infura 🌩️
    participant Listener as Listener 📡
    participant Broker as Broker 📬
    participant Indexer as Indexer 💱
    participant Storage as Storage 📦
    Listener->> Broker: connect(topic)
    Note right of Listener: {topic: "0xA..."}
    Indexer->>Broker: subscribe(topic)
    Note left of Indexer: listen({topic: "0xA..."})  
    Listener->>Infura: init()
    Note left of Listener: {blockChain, contractAddress: "0xA..."}
    Infura->>Listener: ⚡ SmartContractEvent_1
    Note right of Infura: {contractAddress: "0xA...", event: "Transfer", ...} 
    Listener->>Broker: send(topic, 📧 Message_21)
    Note right of Listener: {topic: "0xA...", key: "Transaction", value: ...})
    Infura->>Listener: ⚡ SmartContractEvent_2
    Infura->>Listener: ⚡ SmartContractEvent_3
    Broker->>Indexer: receive(📧 Message_21)
    Indexer->>Storage: save(💾)
    Note right of Indexer: {contractAddress: "0xA...", event: "Transfer", ...}
```

## 🚀 Quick Installation

Pre-requisites:

1. Docker
2. docker-compose

```bash
export HOST_IP=<your host ip> # limitation due to Kafka setup
docker-compose up
```

Sample output:

```
listener     |   Listening for 📑321258511947401074729696687054851469812961617360 smart contract events
listener     |   From Infura WebSocket: ⫘ wss://mainnet.infura.io/ws/v3 ...
listener     |   Broadcasting them to 🛰 192.168.64.20:9092 ᯤ ...
```

```
indexer      |  Listening on topic 📑0x3845badAde8e6dFF049820680d1F14bD3903a5d0 for broad casted events
indexer      |  Broadcast available at 📡 192.168.64.20:9092 ...
```


## ⚛️ Developer Notes

1. `indexer` and `listener` are NodeJS projects (`nvm use` / `npm ci` / `npm start`)
2. `mocha/chai` for unit tests --- `*.spec.js` have been used to better understand `web3.js` and `ethers.js`
3. `docker-compose.yml` for wrapping everything
4. `.env` for environment variables when outside of `Docker`
5. `kafka` for message broker 
6. contract we are listening to: [_Sand Token_](https://etherscan.io/token/0x3845badAde8e6dFF049820680d1F14bD3903a5d0) 
   and not _CareBear_ as suggested in the assignment due to `infura` limitations for free account


## 📝 TODOs

- [ ] integrate `Storage` with `MongoDB`
- [ ] remove hard-coded contract address and ABI
- [ ] fix `docker-compose` start-up (currently `reset` on failure makes everything work eventually)
- [ ] add specs (unit tests) --- with `hardhat`
- [ ] add dApp interface
