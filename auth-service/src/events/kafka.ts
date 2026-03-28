import { Kafka, Partitioners } from "kafkajs";
import { config } from "../config";
import logger from "../config/logger";





const kafka= new Kafka({
    clientId:config.SERVICE_NAME,
    brokers:[config.KAFKA_BROKER]
})


export const producer=kafka.producer({
    allowAutoTopicCreation:true,
    createPartitioner:Partitioners.DefaultPartitioner,
})


export const connectKafka=async()=>{
    try{
        await producer.connect();
        logger.info('Kafka producer connected');
    }
    catch(error){
        logger.error('Kafka producer connection error:', error);
    }
}

process.on('SIGTERM',async()=>{
    await producer.disconnect();
    logger.info('Kafka producer disconnected');
    process.exit(0);
})

process.on('SIGINT',async()=>{
    await producer.disconnect();
    logger.info('Kafka producer disconnected');
    process.exit(0);
})


export const disconnectKafka = async () => {
  try {
    await producer.disconnect();
    logger.info('Kafka producer disconnected');
  } catch (error) {
    logger.error('Failed to disconnect Kafka producer', error);
  }
};