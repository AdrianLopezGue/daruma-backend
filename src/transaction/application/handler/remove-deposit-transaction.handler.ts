import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { TRANSACTIONS, Transactions } from '../../domain/repository/index';
import { TransactionService } from '../../infrastructure/service/transaction.service';
import { TransactionId } from '../../domain/model/transaction-id';
import { TransactionIdNotFoundError } from '../../domain/exception/transaction-id-not-found.error';
import { RemoveDepositTransactionCommand } from '../command/remove-deposit-transaction.command';
import { DepositTransaction } from '../../domain/model/deposit-transaction';

@CommandHandler(RemoveDepositTransactionCommand)
export class RemoveDepositTransactionHandler
  implements ICommandHandler<RemoveDepositTransactionCommand> {
  constructor(
    @Inject(TRANSACTIONS) private readonly transactions: Transactions,
    private readonly transactionService: TransactionService,
  ) {}

  async execute(command: RemoveDepositTransactionCommand) {
    const depositTransactionId = await (
      await this.transactionService.getDepositTransactionByBillIdAndMemberId(
        command.billId,
        command.memberId,
      )
    ).id;

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
  }
}
