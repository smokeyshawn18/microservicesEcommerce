import { type Kafka } from "kafkajs";
export declare const createProducer: (kafka: Kafka) => {
    connect: () => Promise<void>;
    send: (topic: string, message: object) => Promise<void>;
    disconnect: () => Promise<void>;
};
//# sourceMappingURL=producer.d.ts.map