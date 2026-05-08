import type { Kafka } from "kafkajs";
export declare const createConsumer: (kafka: Kafka, groupId: string) => {
    connect: () => Promise<void>;
    subscribe: (topic: string, handler: (message: any) => Promise<void>) => Promise<void>;
    disconnect: () => Promise<void>;
};
//# sourceMappingURL=consumer.d.ts.map