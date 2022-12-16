import { readFileSync } from "fs";
import { EthersListener } from "./provider/ethers.js";
import { EventProducer } from "./broker/index.js";
import dotenv from "dotenv";

class Listener {
  constructor({ contractAddress, contractAbi, chainProvider }) {
    this.contractAddress = contractAddress;
    this.contractAbi = contractAbi;
    this.provider = chainProvider;
  }

  init() {
    this.provider.init();
  }

  listen(callback) {
    this.provider.subscribe({
      contractAddress: this.contractAddress,
      contractAbi: this.contractAbi
    }, (event) => {
      callback(event);
    });
  }
}

const showInfo = () => {
  console.log(`
  Listening for 📑${process.env.SAMPLE_CONTRACT_ADDRESS} smart contract events
  From Infura WebSocket: ⫘ ${process.env.INFURA_WS_URL} ...
  Broadcasting them to 🛰 ${process.env.BROKER_URL} ᯤ ...`);
}

async function main() {
  showInfo();
  const contractAbi = JSON.parse(readFileSync(process.env.SAMPLE_CONTRACT_ABI, { encoding: "utf8" }));
  const sampleContract = {
    contractAddress: process.env.SAMPLE_CONTRACT_ADDRESS,
    contractAbi,
  };

  const listener = new Listener({
    ...sampleContract,
    chainProvider: new EthersListener()
  });
  listener.init();

  const eventProducer = new EventProducer();
  await eventProducer.init();

  listener.listen((event) => {
    eventProducer.emit(sampleContract.contractAddress, event);
  });
}

dotenv.config();
await main();
