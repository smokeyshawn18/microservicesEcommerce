import { Partitioners, type Kafka, type Producer } from "kafkajs";

export const createProducer = (kafka: Kafka) => {
  // Keep producer partitioning behavior stable across KafkaJS major updates.
  const producer: Producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
  });

  const connect = async () => {
    await producer.connect();
  };

  const send = async (topic: string, message: object) => {
    await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(message),
        },
      ],
    });
  };

  const disconnect = async () => {
    await producer.disconnect();
  };

  return {
    connect,
    send,
    disconnect,
  };
};
