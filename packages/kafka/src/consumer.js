export const createConsumer = (kafka, groupId) => {
    const consumer = kafka.consumer({ groupId });
    const connect = async () => {
        await consumer.connect();
        console.log("Kafka consumer connected", groupId);
    };
    const subscribe = async (topic, handler) => {
        await consumer.subscribe({ topic: topic, fromBeginning: true });
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const value = message.value?.toString();
                    if (value) {
                        await handler(JSON.parse(value.toString()));
                    }
                }
                catch (error) {
                    console.log("Error processing message", error);
                }
            },
        });
    };
    const disconnect = async () => {
        await consumer.disconnect();
        console.log("Kafka consumer disconnected", groupId);
    };
    return {
        connect,
        subscribe,
        disconnect,
    };
};
