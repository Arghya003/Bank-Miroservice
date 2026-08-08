import { Repository } from "typeorm";
import { Transaction, TransactionStatus, TransactionType } from "../entity/transaction.entity";
import { AppDataSource } from "../data-source";
import logger from "../config/logger";
import { publishTransactionEvent } from "../events/producers/transactionEvents.producer";
import { ERROR_CODES, TRANSACTION_EVENT_TYPES } from "@bank_microservices/constants";
import { createError } from "../utils";



interface TransferTransactionDTO {
    userId: number;
    sourceAccountNumber: string;
    destinationAccountNumber: string;
    amount: number;
    transactionType: TransactionType;
    note?: string;
}


export class TransactionService {

    transactionRepository: Repository<Transaction>;

    constructor() {
        this.transactionRepository = AppDataSource.getRepository(Transaction);
    }

    async create(data: TransferTransactionDTO): Promise<Transaction> {
        try {
            const transaction = new Transaction();
            transaction.userId = data.userId;
            transaction.sourceAccountNumber = data.sourceAccountNumber;
            transaction.destinationAccountNumber = data.destinationAccountNumber;
            transaction.amount = data.amount;
            transaction.transactionType = data.transactionType;
            transaction.note = data.note || '';
            transaction.status = TransactionStatus.INITIATED;

            await this.transactionRepository.save(transaction);
            logger.info(`Transaction created: ${transaction.id}`);

            await publishTransactionEvent({
                eventType: TRANSACTION_EVENT_TYPES.INITIATED,
                userId: transaction.userId,
                transactionId: transaction.transactionId,
                status: transaction.status,
                sourceAccountNumber: transaction.sourceAccountNumber,
                destinationAccountNumber: transaction.destinationAccountNumber,
                amount: transaction.amount,
                transactionType: transaction.transactionType,
                isInternal: transaction.isInternal,
            })

            return transaction;
        }
        catch (error) {
            logger.error(`Error creating transaction: ${error}`);
            throw createError(
                'failed to create transaction',
                500,
                ERROR_CODES.TRANSACTION_FAILED,
            );
        }
    }
    async updateStatus(
        transactionId: string,
        {
            status,
            errorDetails,
            sourceDebitedAt,
            destinationCreditedAt,
            compensatedAt,
            completedAt,
        }: {
            status: TransactionStatus;
            errorDetails?: string;
            sourceDebitedAt?: Date;
            destinationCreditedAt?: Date;
            compensatedAt?: Date;
            completedAt?: Date;
        },
    ): Promise<Transaction> {
        let transaction = await this.getByTransactionId(transactionId);

        transaction.status = status;
        transaction.details = errorDetails || '';
        transaction.sourceDebitedAt =
            sourceDebitedAt || transaction.sourceDebitedAt;
        transaction.destinationCreditedAt =
            destinationCreditedAt || transaction.destinationCreditedAt;
        transaction.compensatedAt = compensatedAt || transaction.compensatedAt;
        transaction.completedAt = completedAt || transaction.completedAt;

        await this.transactionRepository.save(transaction);

        logger.info(`Transaction ${transactionId} status updated to '${status}'`);

        return transaction;
    }

    async getByTransactionId(transactionId: string): Promise<Transaction> {
        const transaction = await this.transactionRepository.findOne({
            where: { transactionId },
        });

        if (!transaction) {
            throw createError(`Transaction ${transactionId} not found`, 404);
        }

        return transaction;
    }



}


export const transactionService = new TransactionService();