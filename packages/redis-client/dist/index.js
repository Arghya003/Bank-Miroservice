"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = require("@bank_microservices/logger");
const logger = (0, logger_1.getLogger)("@bank_microservices/redis-client", "info");
class RedisClient {
    instance;
    isConnected = false;
    REDIS_URL;
    options;
    constructor(REDIS_URL, options) {
        this.REDIS_URL = REDIS_URL;
        this.options = options || {
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            maxRetriesPerRequest: 3,
        };
        this.instance = new ioredis_1.default(this.REDIS_URL, this.options);
        this.setupEventListeners();
    }
    getInstance() {
        return this.instance;
    }
    setupEventListeners() {
        this.instance.on("connect", () => {
            this.isConnected = true;
            logger.info("Connected to Redis");
        });
        this.instance.on("error", (error) => {
            this.isConnected = false;
            logger.error("Redis connection error:", error);
        });
        this.instance.on("close", () => {
            this.isConnected = false;
            logger.warn("Redis connection closed");
        });
        this.instance.on("reconnecting", () => {
            logger.info("Reconnecting to Redis...");
        });
    }
    isReady() {
        return this.isConnected;
    }
    async closeConnection() {
        if (this.instance) {
            try {
                await this.instance.quit();
                logger.info('Redis connection closed');
            }
            catch (error) {
                logger.error('Error closing Redis connection:', error);
            }
        }
    }
}
exports.default = RedisClient;
