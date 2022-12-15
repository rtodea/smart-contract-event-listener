import ethers from "ethers";
import dotenv from "dotenv";
import { expect } from "chai";
import { describe, it } from "mocha";
import { readFileSync } from "fs";

describe("ethers.js integration", () => {
  let provider;
  let contract;
  before(async () => {
    dotenv.config();
    const { INFURA_WS_URL, INFURA_API_KEY } = process.env;
    const webSocketProviderUrl = [INFURA_WS_URL, INFURA_API_KEY].join("/");
    provider = new ethers.providers.WebSocketProvider(webSocketProviderUrl);

    const { SAMPLE_CONTRACT_ADDRESS, SAMPLE_CONTRACT_ABI } = process.env;
    // read JSON from SAMPLE_CONTRACT_ABI path with fs.readFileSync
    const sampleContractABI = JSON.parse(readFileSync(SAMPLE_CONTRACT_ABI, { encoding: "utf8" }));

    // const abi
    contract = new ethers.Contract(SAMPLE_CONTRACT_ADDRESS, sampleContractABI, provider);
  });

  it("should listen to contract events", (done) => {
    contract.once("*", (...args) => {
      expect(args).to.not.be.undefined;
      console.log(args);
      done();
    });
  }).timeout("10m");

  it("should listen to eth events", (done) => {
    const filter = {
      // this is not the same as the contract address
      address: "",
      topics: [
        ethers.utils.id("Transfer(address,address,uint256)"),
      ]
    }
    provider.once(filter, (log, event) => {
      console.log(log, event);
      expect(log).to.not.be.undefined;
      done();
    })
  }).timeout("1m");
});
