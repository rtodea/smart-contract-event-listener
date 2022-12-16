import dotenv from 'dotenv';
import { EventConsumer } from "./broker/index.js";
import { Storage } from "./storage/index.js";

async function main() {
  const eventConsumer = new EventConsumer();
  await eventConsumer.init();

  const contractAddress = process.env.SAMPLE_CONTRACT_ADDRESS;

  const storage = new Storage();
  await storage.init();

  await eventConsumer.subscribe(contractAddress, (contractEvent) => {
    console.log(contractAddress, "indexing", contractEvent);
    storage.save(contractEvent.transactionHash, contractEvent);
  });
}

dotenv.config();
await main();
