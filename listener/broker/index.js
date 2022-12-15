import { CompressionTypes, Kafka, logLevel } from "kafkajs";

export class EventProducer {
  constructor() {
    const kafka = new Kafka({
      logLevel: logLevel.INFO,
      brokers: [process.env.BROKER_URL],
      clientId: "event-producer"
    });
    this.producer = kafka.producer();
  }

  async init() {
    await this.connect();
  }

  async connect() {
    await this.producer.connect();
  }

  async emit(topic, event) {
    const messages = [{ key: event.event, value: JSON.stringify(event) }];
    console.log("[event-producer] emitting", topic, messages);
    this.producer
      .send({
        topic,
        compression: CompressionTypes.GZIP,
        messages
      })
      .then(console.log)
      .catch(e => console.error(`[event-producer] ${e.message}`, e));
  }

  async disconnect() {
    await this.producer.disconnect();
  }
}
