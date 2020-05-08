import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { TRANSACTIONS, Transactions } from '../../domain/repository/index';
import { TransactionService } from '../../infrastructure/service/transaction.service';
import { TransactionId } from '../../domain/model/transaction-id';
import { TransactionIdNotFoundError } from '../../domain/exception/transaction-id-not-found.error';
import { RemoveDebtTransactionCommand } from '../command/remove-debt-transaction.command';
import { DebtTransaction } from '../../domain/model/debt-transaction';

@CommandHandler(RemoveDebtTransactionCommand)
export class RemoveDebtTransactionHandler
  implements ICommandHandler<RemoveDebtTransactionCommand> {
  constructor(
    @Inject(TRANSACTIONS) private readonly transactions: Transactions,
    private readonly transactionService: TransactionService,
  ) {}

  async execute(command: RemoveDebtTransactionCommand) {
    const debtTransactionId = await (await this.transactionService.getDebtTransactionByBillIdAndMemberId(command.billId, command.memberId)).id;

    const transactionId = TransactionId.fromString(debtTransactionId);
    const debtTransaction = await this.transactions.findDebtTransaction(transactionId);

    if (!(debtTransaction instanceof DebtTransaction) || debtTransaction.isRemoved) {
        throw TransactionIdNotFoundError.withString(transactionId.value);
    }

    debtTransaction.remove();
    this.transactions.saveDebtTransaction(debtTransaction);
  }
}