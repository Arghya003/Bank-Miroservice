import logger from "../../config/logger";
import { USER_TOPIC } from "../../constants";


const {producer}=require('../kafka');


export const publishUserRegistered=async(data:any)=>{
    const topic=USER_TOPIC.USER_REGISTERED;
    logger.info(`publishing message to topic : ${topic} with message : ${JSON.stringify(data.value)}`)

    await producer.send({
        topic,
        messages:[
            {
                key:data.key,
                value:JSON.stringify(data.value)
            }
        ]
    })
}