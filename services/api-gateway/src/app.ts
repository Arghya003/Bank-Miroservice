import dotenv from "dotenv";
dotenv.config();

import express,{NextFunction,Request,Response} from "express";
import helmet from "helmet";
import cors from "cors";
import { config } from "./config";
import logger from "./config/logger";

import { limiter } from "./middlewares/rate-limiter.middleware";
import { correlationMiddleware } from "./middlewares/correlation.middleware";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { proxyServices } from "./config/service";


const app = express();

app.use(correlationMiddleware);
app.use(helmet());
app.use(cors());
app.use(limiter);

app.use((req: Request, res: Response, next: NextFunction) => {
    logger.debug(`[${req.correlationId}] ${req.method} ${req.url}`);
    next();
});

app.get("/health", (req, res) => {
    res.status(200).json({status:"ok"});
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

proxyServices(app);

app.use((req:Request,res:Response,next:NextFunction)=>{
    logger.warn(`Resource not found ${req.method} ${req.url}`);
    res.status(404).json({message:"Resource not found"});
    
})

app.use((err:Error,req:Request,res:Response,next:NextFunction)=>{
    logger.error(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${err.message}`);
    res.status(500).json({message:"Internal server error"});
    
})




const startSever = () => {
    try {
        const server = app.listen(config.PORT, () => {
            logger.info(`${config.SERVICE_NAME} running on port ${config.PORT}`);
        });
        server.on("error", (error: any) => {
            if (error.code === "EADDRINUSE") {
                logger.error(`Port ${config.PORT} is already in use by another process.`);
            } else {
                logger.error("Failed to start server", error);
            }
            process.exit(1);
        });
    } catch (error) {
        logger.error("Failed to start server", error);
        process.exit(1);
    }
};


startSever()
