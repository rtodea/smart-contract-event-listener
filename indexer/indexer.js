import dotenv from 'dotenv';
import { EventConsumer } from "./broker/index.js";
import { Storage } from "./storage/index.js";

const showInfo = () => {
  console.log(`
  Listening on topic 📑${process.env.SAMPLE_CONTRACT_ADDRESS} for broad casted events
  Broadcast available at 📡 ${process.env.BROKER_URL} ...`);
}

async function main() {
  showInfo();

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
