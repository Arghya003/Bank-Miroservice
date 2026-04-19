import { BaseProducer, KafkaMessage } from '@bank_microservices/kafka-client';
import logger from '../../config/logger';
import { USER_TOPICS } from '@bank_microservices/constants';

const { producer } = require('../kafka');

export interface UserRegisteredData {
  id: number;
}

class UserRegisteredProducer extends BaseProducer<UserRegisteredData> {
  protected readonly topic = USER_TOPICS.USER_REGISTERED;

  constructor() {
    super(producer);
  }
}

const userRegisteredProducer = new UserRegisteredProducer();

export const publishUserRegistered = async (
  data: KafkaMessage<UserRegisteredData>,
): Promise<void> => userRegisteredProducer.publish(data);