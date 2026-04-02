import dotenv from "dotenv";
dotenv.config();


import express from "express"
import helmet from "helmet";

import logger from "./config/logger";
import { AppDataSource } from "./data-source";
import { config } from "./config"
import init from "./init";
import { indexRouter } from "./routes/index.route";
import authRouter from "./routes/auth.route";
import {errorHandler} from "./middleware/error.middleware"
import { corsMiddleware } from "./middleware/cors.middleware";
import { verifyToken } from "./middleware/auth.middleware";
import { reqLogger } from "./middleware/req.middlware";
import { setupGracefulShutdown } from "./utils/shutdown";

const app = express()
app.use(helmet())
app.use(corsMiddleware);
app.use(reqLogger)
app.use(express.json())
app.use(verifyToken)

app.use("/", indexRouter)
app.use("/api/v1/auth", authRouter)
app.use(errorHandler)



AppDataSource.initialize()
  .then(async () => {
    await init();

    const server = app.listen(config.PORT, () => {
      logger.info(`${config.SERVICE_NAME} running on http://localhost:${config.PORT}`)
    })
    setupGracefulShutdown(server);
  })
  .catch((err) => {
    logger.error('Failed to start server', err);
   
  })
