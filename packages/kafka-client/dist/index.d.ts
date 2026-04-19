import { Producer } from "kafkajs";
declare class KafkaClient {
    private producer;
    private isConnected;
    private readonly kafka;
    constructor(clientId: string, brokers: string[], options?: {
        allowAutoTopicCreation: boolean;
        createPartitioner: import("kafkajs").ICustomPartitioner;
    });
    private setupEventListeners;
    getProducer(): Producer;
    createConsumer(groupId: string): import("kafkajs").Consumer;
    isReady(): boolean;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
}
export default KafkaClient;
export interface KafkaMessage<T> {
    key: string;
    value: T;
}
export declare abstract class BaseProducer<T> {
    protected abstract readonly topic: string;
    private producer;
    constructor(producer: Producer);
    publish(data: KafkaMessage<T>): Promise<void>;
}
