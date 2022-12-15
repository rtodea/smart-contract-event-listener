import { describe, it } from "mocha";
import { expect } from "chai";
import dotenv from "dotenv";
import Web3 from "web3";
import { readFile } from "fs/promises";

describe("web3.spec.js integration test", () => {
  let web3;
  let sampleAddress;
  let sampleABI;
  let contract;
  before(async () => {
    dotenv.config();
    const {
      INFURA_API_KEY,
      INFURA_NET_URL,
      SAMPLE_CONTRACT_ADDRESS,
      SAMPLE_CONTRACT_ABI
    } = process.env;
    web3 = new Web3([INFURA_NET_URL, INFURA_API_KEY].join("/"));
    sampleAddress = SAMPLE_CONTRACT_ADDRESS;
    expect(SAMPLE_CONTRACT_ABI).to.be.not.null;
    sampleABI = JSON.parse(await readFile(SAMPLE_CONTRACT_ABI));
    contract = new web3.eth.Contract(sampleABI, sampleAddress);
  });

  it("should create a contract instance", () => {
    expect(contract).to.be.not.null;
  });

  describe("--- events/transactions", () => {
    const EventFilter = {
      AllEvents: "AllEvents"
    };
    it("should subscribe to past events", async () => {
      const latest = await web3.eth.getBlockNumber();
      const blockNoFromPast = latest - 1000;

      const LatestBlockNo = "latest";
      const events = await contract.getPastEvents(EventFilter.AllEvents, {
        fromBlock: blockNoFromPast,
        toBlock: LatestBlockNo
      });
      expect(events).to.be.not.undefined;
      expect(events.length).to.be.greaterThan(0);
    });

    // This does not work as expected
    it("should subscribe to all events", (done) => {
      let eventCounter = {
        contract: 0,
        eth: 0
      };
      let doneIfOneEventEach = () => {
        if (eventCounter?.contract === 1 && eventCounter.eth === 1) {
          done();
        }
      };
      const subscribe = (listener, logger, counterKey) => {
        listener.on("error", logger);
        listener.on("connected", logger);
        listener.on("data", (event) => {
          expect(event).to.not.be.undefined;
          logger(event);
          eventCounter[ counterKey ] += 1;
          doneIfOneEventEach();
        });
      };

      let web3 = new Web3(new Web3.providers.WebsocketProvider([process.env.INFURA_WS_URL, process.env.INFURA_API_KEY].join("/")));
      let contract = new web3.eth.Contract(sampleABI, sampleAddress);

      const contractSubscription = contract.events.allEvents();
      subscribe(contractSubscription, (data) => console.log("contract.events", data), "contract");

      const ethSubscription = web3.eth.subscribe("logs", {
        address: [sampleAddress]
      });
      subscribe(ethSubscription, (data) => {
        console.log("eth.subscribe", data);
      }, "eth");

      // ethSubscription.on("data", (log) => {
      //   console.log("eth.subscribe", "data", web3.eth.abi.decodeParameters([
      //     { type: "string", name: "from" },
      //     { type: "string", name: "to" },
      //     { type: "uint256", name: "value" }
      //   ], log?.data));
      // });
    }).timeout(100 * 1000); // ms
  });

  it("should decode raw data", () => {
    const dataArray = [
      "0xDFd5293D8e347dFe59E90eFd55b2956a1343963d",
      "0xF3071F00E3ffd966bE952Bb08d4CA8282e2a01eF",
      "657330000000000000000"
    ];
    const typeMapping = [
      { type: "string", name: "from" },
      { type: "string", name: "to" },
      { type: "uint256", name: "value" }];
    const encoded = web3.eth.abi.encodeParameters(typeMapping, dataArray);
    console.log(encoded);
    const decoded = web3.eth.abi.decodeParameters(
      typeMapping,
      encoded);
    console.log(decoded);
    expect(decoded).to.not.be.undefined;
    expect(decoded.from).to.eql(dataArray[ 0 ]);
    expect(decoded.to).to.eql(dataArray[ 1 ]);
    expect(decoded.value).to.eql(dataArray[ 2 ]);
  });
});
