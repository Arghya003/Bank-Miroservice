interface Config{
    SERVICE_NAME:string;
    PORT:number|string;
    DEFAULT_TIMEOUT:number|string;
    AUTH_JWT_SECRET:string;
    GATEWAY_JWT_SECRET:string;
    GATEWAY_JWT_EXPIRES_IN:string;
    RATE_LIMIT_WINDOW:number|string;
    RATE_LIMIT_MAX_REQUESTS:number|string;
    LOG_LEVEL:string;
    REDIS_URL:string;
    AUTH_SERVICE_URL:string;
    ACCOUNTS_SERVICE_URL:string;
    TRANSACTION_SERVICE_URL:string;
    
}

export const config:Config = {
    SERVICE_NAME:require('../../package.json').name || "api-gateway",
    PORT:process.env.PORT || 3000,
    DEFAULT_TIMEOUT:process.env.DEFAULT_TIMEOUT || '30000',
    AUTH_JWT_SECRET:process.env.AUTH_JWT_SECRET || "your-defualt-auth-service",
    GATEWAY_JWT_SECRET:process.env.GATEWAY_JWT_SECRET || "your-defualt-gateway-service",
    GATEWAY_JWT_EXPIRES_IN:process.env.GATEWAY_JWT_EXPIRES_IN || "1m",
    RATE_LIMIT_WINDOW:process.env.RATE_LIMIT_WINDOW || 15,
    RATE_LIMIT_MAX_REQUESTS:process.env.RATE_LIMIT_MAX_REQUESTS || 100,
    LOG_LEVEL:process.env.LOG_LEVEL || "info",
    REDIS_URL:process.env.REDIS_URL || "redis://localhost:6379",
    AUTH_SERVICE_URL:process.env.AUTH_SERVICE_URL || "http://localhost:3001",
    ACCOUNTS_SERVICE_URL:process.env.ACCOUNTS_SERVICE_URL || "http://localhost:3002",
    TRANSACTION_SERVICE_URL:process.env.TRANSACTION_SERVICE_URL || "http://localhost:3003",
    
}