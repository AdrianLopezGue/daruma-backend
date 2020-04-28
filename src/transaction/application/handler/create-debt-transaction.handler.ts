import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Transactions } from '../../domain/repository/transactions';
import { TRANSACTIONS } from '../../domain/repository/index';
import { TransactionId } from '../../domain/model/transaction-id';
import { MemberId } from '../../../member/domain/model/member-id';
import { BillId } from '../../../bill/domain/model/bill-id';
import { BillCurrencyUnit } from '../../../bill/domain/model/bill-currency-unit';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { BillAmount } from '../../../bill/domain/model/bill-amount';
import { CreateDebtTransactionCommand } from '../command/create-debt-transaction.command';
import { DebtTransaction } from '../../domain/model/debt-transaction';

@CommandHandler(CreateDebtTransactionCommand)
export class CreateDebtTransactionHandler
  implements ICommandHandler<CreateDebtTransactionCommand> {
  constructor(
    @Inject(TRANSACTIONS) private readonly transactions: Transactions,
  ) {}

  async execute(command: CreateDebtTransactionCommand) {
    const transactionId = TransactionId.fromString(command.transactionId);
    const memberId = MemberId.fromString(command.memberId);
    const billId = BillId.fromString(command.billId);
    const amount = BillAmount.withMoneyAndCurrencyCode(
      BillCurrencyUnit.fromNumber(command.money),
      GroupCurrencyCode.fromString(command.currencyCode),
    );

    const transaction = DebtTransaction.add(
      transactionId,
      memberId,
      billId,
      amount,
    );

    this.transactions.saveDebtTransaction(transaction);
  }
}
