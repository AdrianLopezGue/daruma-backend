import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Transactions } from '../../domain/repository/transactions';
import { TRANSACTIONS } from '../../domain/repository/index';
import { TransactionId } from '../../domain/model/transaction-id';
import { MemberId } from '../../../member/domain/model/member-id';
import { BillCurrencyUnit } from '../../../bill/domain/model/bill-currency-unit';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { BillAmount } from '../../../bill/domain/model/bill-amount';
import { CreateTransferTransactionCommand } from '../command/create-transfer-transaction.command';
import { TransferTransaction } from '../../domain/model/transfer-transaction';
import { GroupId } from '../../../group/domain/model/group-id';

@CommandHandler(CreateTransferTransactionCommand)
export class CreateTransferTransactionHandler
  implements ICommandHandler<CreateTransferTransactionCommand> {
  constructor(
    @Inject(TRANSACTIONS) private readonly transactions: Transactions,
  ) {}

  async execute(command: CreateTransferTransactionCommand) {
    const transactionId = TransactionId.fromString(command.transactionId);
    const senderId = MemberId.fromString(command.senderId);
    const beneficiaryId = MemberId.fromString(command.beneficiaryId);
    const amount = BillAmount.withMoneyAndCurrencyCode(
      BillCurrencyUnit.fromNumber(command.money),
      GroupCurrencyCode.fromString(command.currencyCode),
    );
    const groupId = GroupId.fromString(command.groupId);

    const transaction = TransferTransaction.add(
      transactionId,
      senderId,
      beneficiaryId,
      amount,
      groupId
    );

    this.transactions.saveTransferTransaction(transaction);
  }
}
