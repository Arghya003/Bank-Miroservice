import { TRANSACTION_TOPICS } from '@bank_microservices/constants';
import { BaseProducer } from '@bank_microservices/kafka-client';
import { producer } from '../kafka';

export interface TransactionEventData {
  eventType: string;
  transactionId: string;
  timestamp?: number;
}

class TransactionEventsProducer extends BaseProducer<TransactionEventData> {
  protected readonly topic = TRANSACTION_TOPICS.TRANSACTION_EVENTS;

  constructor() {
    super(producer);
  }
}

const transactionEventsProducer = new TransactionEventsProducer();

export const publishTransactionEvent = async <T extends TransactionEventData>(
  eventData: T,
): Promise<void> => {
  return transactionEventsProducer.publish({
    key: eventData.transactionId,
    value: {
      ...eventData,
      timestamp: Date.now(),
    },
  });
};