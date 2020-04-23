import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateDepositTransactionCommand } from '../command/create-deposit-transaction.command';
import { Transactions } from '../../domain/repository/transactions';
import { TRANSACTIONS } from '../../domain/repository/index';
import { TransactionId } from '../../domain/model/transaction-id';
import { MemberId } from '../../../member/domain/model/member-id';
import { BillId } from '../../../bill/domain/model/bill-id';
import { BillCurrencyUnit } from '../../../bill/domain/model/bill-currency-unit';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { BillAmount } from '../../../bill/domain/model/bill-amount';
import { DepositTransaction } from '../../domain/model/deposit-transaction';

@CommandHandler(CreateDepositTransactionCommand)
export class CreateDepositTransactionHandler
  implements ICommandHandler<CreateDepositTransactionCommand> {
  constructor(@Inject(TRANSACTIONS) private readonly transactions: Transactions) {}

  async execute(command: CreateDepositTransactionCommand) {
    const transactionId = TransactionId.fromString(command.transactionId);
    const memberId = MemberId.fromString(command.memberId);
    const billId = BillId.fromString(command.billId);
    const amount = BillAmount.withMoneyAndCurrencyCode(
        BillCurrencyUnit.fromNumber(command.money),
        GroupCurrencyCode.fromString(command.currencyCode),
    );

    const transaction = DepositTransaction.add(
        transactionId,
        memberId,
        billId,
        amount,
      );

    this.transactions.saveDepositTransaction(transaction);
  }
}
