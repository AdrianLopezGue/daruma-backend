import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { EventStore } from '../../../core/eventstore/eventstore';
import { Transactions } from '../../domain/repository/transactions';
import { DepositTransaction } from '../../domain/model/deposit-transaction';
import { DebtTransaction } from '../../domain/model/debt-transaction';
import { TransactionId } from '../../domain/model/transaction-id';
import { TransferTransaction } from '../../domain/model/transfer-transaction';

@Injectable()
export class TransactionEventStore implements Transactions {
  constructor(
    private readonly eventStore: EventStore,
    private readonly publisher: EventPublisher,
  ) {}

  async getDepositTransaction(transactionId: TransactionId): Promise<DepositTransaction>{
    return this.eventStore.read(DepositTransaction, transactionId.value);
  }

  async findDepositTransaction(transactionId: TransactionId): Promise<DepositTransaction> | null{
    return this.eventStore.read(DepositTransaction, transactionId.value);
  }

  saveDepositTransaction(depositTransaction: DepositTransaction): void{
    depositTransaction = this.publisher.mergeObjectContext(depositTransaction);
    depositTransaction.commit();
  }

  async getDebtTransaction(transactionId: TransactionId): Promise<DebtTransaction>{
    return this.eventStore.read(DebtTransaction, transactionId.value);
  }

  async findDebtTransaction(transactionId: TransactionId): Promise<DebtTransaction> | null{
    return this.eventStore.read(DebtTransaction, transactionId.value);
  }

  saveDebtTransaction(debtTransaction: DebtTransaction): void{
    debtTransaction = this.publisher.mergeObjectContext(debtTransaction);
    debtTransaction.commit();
  }

  async getTransferTransaction(transactionId: TransactionId): Promise<TransferTransaction>{
    return this.eventStore.read(TransferTransaction, transactionId.value);
  }

  async findTransferTransaction(transactionId: TransactionId): Promise<TransferTransaction> | null{
    return this.eventStore.read(TransferTransaction, transactionId.value);
  }

  saveTransferTransaction(transferTransaction: TransferTransaction): void{
    transferTransaction = this.publisher.mergeObjectContext(transferTransaction);
    transferTransaction.commit();
  }
}