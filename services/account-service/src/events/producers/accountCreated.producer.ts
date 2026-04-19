import { USER_TOPICS } from '@bank_microservices/constants';
import { BaseProducer, KafkaMessage } from '@bank_microservices/kafka-client';
import { producer } from '../kafka';

export interface AccountCreatedData {
  id: number;
}

class AccountCreatedProducer extends BaseProducer<AccountCreatedData> {
  protected readonly topic = USER_TOPICS.ACCOUNT_CREATED;

  constructor() {
    super(producer);
  }
}

const accountCreatedProducer = new AccountCreatedProducer();

export const publishAccountCreated = async (
  data: KafkaMessage<AccountCreatedData>,
): Promise<void> => accountCreatedProducer.publish(data);