import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { RemoveDebtAndDepositTransactionsCommand } from '../command/remove-debt-and-deposit-transactions.command';
import { TRANSACTIONS, Transactions } from '../../domain/repository/index';
import { TransactionService } from '../../infrastructure/service/transaction.service';
import { TransactionId } from '../../domain/model/transaction-id';
import { DebtTransaction } from '../../domain/model/debt-transaction';
import { TransactionIdNotFoundError } from '../../domain/exception/transaction-id-not-found.error';
import { DepositTransaction } from '../../domain/model/deposit-transaction';

@CommandHandler(RemoveDebtAndDepositTransactionsCommand)
export class RemoveDebtAndDepositTransactionsHandler
  implements ICommandHandler<RemoveDebtAndDepositTransactionsCommand> {
  constructor(
    @Inject(TRANSACTIONS) private readonly transactions: Transactions,
    private readonly transactionService: TransactionService,
  ) {}

  async execute(command: RemoveDebtAndDepositTransactionsCommand) {
    const debtTransactionsId = await this.transactionService.getDebtTransactionIdsByBillId(
      command.billId,
    );
    const arr = Object.keys(debtTransactionsId).map(function(id) {
      return debtTransactionsId[id];
    });
    arr.map(async debtTransactionId => {
      const transactionId = TransactionId.fromString(debtTransactionId);
      const debtTransaction = await this.transactions.findDebtTransaction(
        transactionId,
      );

      if (
        !(debtTransaction instanceof DebtTransaction) ||
        debtTransaction.isRemoved
      ) {
        throw TransactionIdNotFoundError.withString(transactionId.value);
      }

      debtTransaction.remove();
      this.transactions.saveDebtTransaction(debtTransaction);
    });

    const depositTransactionsId = await this.transactionService.getDepositTransactionIdsByBillId(
      command.billId,
    );
    const arr2 = Object.keys(depositTransactionsId).map(function(id) {
      return depositTransactionsId[id];
    });
    arr2.map(async depositTransactionId => {
      const transactionId = TransactionId.fromString(depositTransactionId);
      const depositTransaction = await this.transactions.findDepositTransaction(
        transactionId,
      );

      if (
        !(depositTransaction instanceof DepositTransaction) ||
        depositTransaction.isRemoved
      ) {
        throw TransactionIdNotFoundError.withString(transactionId.value);
      }

      depositTransaction.remove();
      this.transactions.saveDepositTransaction(depositTransaction);
    });
  }
}
