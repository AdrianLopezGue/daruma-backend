import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveTransferTransactionsCommand } from '../command/remove-transfer-transactions.command';
import { TRANSACTIONS, Transactions } from '../../domain/repository/index';
import { TransactionService } from '../../infrastructure/service/transaction.service';
import { TransactionId } from '../../domain/model/transaction-id';
import { TransactionIdNotFoundError } from '../../domain/exception/transaction-id-not-found.error';
import { TransferTransaction } from '../../domain/model/transfer-transaction';

@CommandHandler(RemoveTransferTransactionsCommand)
export class RemoveTransferTransactionsHandler
  implements ICommandHandler<RemoveTransferTransactionsCommand> {
  constructor(
    @Inject(TRANSACTIONS) private readonly transactions: Transactions,
    private readonly transactionService: TransactionService,
  ) {}

  async execute(command: RemoveTransferTransactionsCommand) {
    const transferTransactionsId = await this.transactionService.getTransferTransactionIdsByGroupId(
      command.groupId,
    );
    const arr = Object.keys(transferTransactionsId).map(function(id) {
      return transferTransactionsId[id];
    });
    arr.map(async transferTransactionId => {
      const transactionId = TransactionId.fromString(transferTransactionId);
      const transferTransaction = await this.transactions.findTransferTransaction(
        transactionId,
      );

      if (
        !(transferTransaction instanceof TransferTransaction) ||
        transferTransaction.isRemoved
      ) {
        throw TransactionIdNotFoundError.withString(transactionId.value);
      }

      transferTransaction.remove();
      this.transactions.saveTransferTransaction(transferTransaction);
    });
  }
}
