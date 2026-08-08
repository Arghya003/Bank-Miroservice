import { config } from '.';
import { getLogger } from '@bank_microservices/logger';

const logger = getLogger(config.SERVICE_NAME, config.LOG_LEVEL);

export default logger;