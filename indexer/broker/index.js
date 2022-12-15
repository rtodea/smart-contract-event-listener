import { Kafka, logLevel } from "kafkajs";

export class EventConsumer {
  constructor() {
    const kafka = new Kafka({
      logLevel: logLevel.INFO,
      brokers: [process.env.BROKER_URL],
      clientId: "event-consumer"
    });
    this.consumer = kafka.consumer({ groupId: "event-consumer-group-id" });
  }

  async init() {
    await this.connect();
  }

  async connect() {
    await this.consumer.connect();
  }

  async subscribe(topic, consumerCallback) {
    await this.consumer.subscribe({ topic, fromBeginning: true });
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        consumerCallback?.(JSON.parse(message.value.toString()));

        const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
        console.log(`- ${prefix} ${message.key}#${message.value}`);
      }
    });
  }
  async disconnect() {
    await this.consumer.disconnect();
  }
}
