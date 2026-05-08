import { Partitioners } from "kafkajs";
export const createProducer = (kafka) => {
    // Keep producer partitioning behavior stable across KafkaJS major updates.
    const producer = kafka.producer({
        createPartitioner: Partitioners.LegacyPartitioner,
    });
    const connect = async () => {
        await producer.connect();
    };
    const send = async (topic, message) => {
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
