"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseProducer = void 0;
const kafkajs_1 = require("kafkajs");
const logger_1 = require("@bank_microservices/logger");
const logger = (0, logger_1.getLogger)("@bank_microservices/kafka-client", "info");
class KafkaClient {
    producer;
    isConnected = false;
    kafka;
    constructor(clientId, brokers, options = {
        allowAutoTopicCreation: true,
        createPartitioner: kafkajs_1.Partitioners.DefaultPartitioner,
    }) {
        this.kafka = new kafkajs_1.Kafka({
            clientId,
            brokers,
        });
        this.producer = this.kafka.producer(options);
        this.setupEventListeners();
    }
    setupEventListeners() {
        this.producer.on("producer.connect", () => {
            this.isConnected = true;
            logger.info("Kafka producer connected");
        });
        this.producer.on("producer.disconnect", () => {
            this.isConnected = false;
            logger.info("Kafka producer disconnected");
        });
        this.producer.on("producer.network.request_timeout", (payload) => {
            logger.error("Kafka producer network request timeout", payload);
        });
    }
    getProducer() {
        return this.producer;
    }
    createConsumer(groupId) {
        return this.kafka.consumer({ groupId });
    }
    isReady() {
        return this.isConnected;
    }
    async connect() {
        try {
            await this.producer.connect();
        }
        catch (error) {
            logger.error("Failed to connect Kafka producer", error);
            throw error;
        }
    }
    async disconnect() {
        try {
            await this.producer.disconnect();
            this.isConnected = false;
        }
        catch (error) {
            logger.error("Failed to disconnect Kafka producer", error);
        }
    }
}
exports.default = KafkaClient;
class BaseProducer {
    producer;
    constructor(producer) {
        this.producer = producer;
    }
    async publish(data) {
        try {
            logger.info(`publishing message to topic: ${this.topic} with message: ${JSON.stringify(data)}`);
            const headers = {
                ...data.headers,
            };
            if (data.correlationId) {
                headers["x-correlation-id"] = data.correlationId;
            }
            await this.producer.send({
                topic: this.topic,
                messages: [
                    {
                        key: data.key,
                        value: JSON.stringify(data.value),
                        headers: Object.keys(headers).length > 0 ? headers : undefined,
                    },
                ],
            });
            logger.debug(`message published successfully to topic: ${this.topic}`);
        }
        catch (error) {
            logger.error(`failed to publish message to topic ${this.topic}: ${error}`);
            throw error;
        }
    }
}
exports.BaseProducer = BaseProducer;
