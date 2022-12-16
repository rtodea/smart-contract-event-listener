import * as ethers from "ethers";
import dotenv from "dotenv";

export class EthersListener {
  constructor() {
    dotenv.config();
  }

  init() {
    const {INFURA_WS_URL, INFURA_API_KEY} = process.env;
    const webSocketProviderUrl = [INFURA_WS_URL, INFURA_API_KEY].join("/");
    this.provider = new ethers.providers.WebSocketProvider(webSocketProviderUrl);
  }

  subscribe({contractAddress ,contractAbi}, callback) {
    const contract = new ethers.Contract(contractAddress, contractAbi, this.provider);
    this.subscription = contract.on("*", (event) => {
      console.log("[ethers.js]", event);
      callback(event);
    });

    return this.subscription;
  }
}
