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

const app = express()
app.use(helmet())

app.use(express.json())


app.use("/", indexRouter)
app.use("/api/v1/auth", authRouter)

AppDataSource.initialize()
  .then(async () => {
    await init();

    const server = app.listen(config.PORT, () => {
      logger.info(`${config.SERVICE_NAME} running on http://localhost:${config.PORT}`)
    })
  })
  .catch((err) => {
    logger.error('Failed to start server', err);
    //process.exit(1);
  })
