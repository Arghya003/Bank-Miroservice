import Redis from "ioredis";
declare class RedisClient {
    private instance;
    private isConnected;
    private REDIS_URL;
    private options;
    constructor(REDIS_URL: string, options?: Record<string, unknown>);
    getInstance(): Redis;
    private setupEventListeners;
    isReady(): boolean;
    closeConnection(): Promise<void>;
}
export default RedisClient;
