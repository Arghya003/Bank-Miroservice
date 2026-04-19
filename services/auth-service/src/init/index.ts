import { connectKafka } from "../events/kafka"
import redis from "../config/redis";
import logger from "../config/logger";

export default async () => {
    // Wait for Redis to be ready before proceeding
    await new Promise<void>((resolve) => {
        if (redis.status === 'ready') {
            logger.info('Connected to Redis');
            return resolve();
        }
        redis.once('ready', () => {
            logger.info('Connected to Redis');
            resolve();
        });
        redis.once('error', (err: Error) => {
            logger.error('Redis connection failed:', err);
            resolve(); // still proceed even if Redis fails
        });
    });

    await connectKafka();
}