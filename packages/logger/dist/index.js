"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const getLogger = (service, level = "debug") => {
    return winston_1.default.createLogger({
        level: level,
        defaultMeta: { service },
        format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.printf(({ level, message, timestamp, service }) => {
            return `[${timestamp}] [${level}] [${service}]: ${message}`;
        })),
        transports: [new winston_1.default.transports.Console()],
    });
};
exports.getLogger = getLogger;
