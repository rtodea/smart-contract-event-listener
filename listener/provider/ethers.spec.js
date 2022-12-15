import ethers from "ethers";
import dotenv from "dotenv";

describe("ethers.js integration", () => {
  let provider;
  let contract;
  before(async () => {
    dotenv.config();
    const {INFURA_WS_URL, INFURA_API_KEY} = process.env;
    const webSocketProviderUrl = [INFURA_WS_URL, INFURA_API_KEY].join("/");
    provider = new ethers.providers.WebSocketProvider(webSocketProviderUrl);

    const {SAMPLE_CONTRACT_ADDRESS, SAMPLE_CONTRACT_ABI} = process.env;
    // read JSON from SAMPLE_CONTRACT_ABI path
    // const abi
    contract = new ethers.Contract()
  });

  it("should listen to contract events", () => {

  })
});
