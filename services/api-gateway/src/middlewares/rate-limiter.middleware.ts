import rateLimit from "express-rate-limit";
import { config } from "../config";


export const limiter=rateLimit({
    windowMs:Number(config.RATE_LIMIT_WINDOW)*60*1000,
    max:Number(config.RATE_LIMIT_MAX_REQUESTS),
    message:"Too many requests from this IP, please try again later",
 })


