import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RECEIPTS } from '../../domain/repository/index';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { CreateReceiptCommand } from '../command/create-receipt.command';
import { Receipts } from '../../domain/repository/receipts';
import { ReceiptId } from '../../domain/model/receipt-id';
import { Receipt } from '../../domain/model/receipt';
import { ExpenseDate } from '../../../expense/domain/model/expense-date';
import { ExpenseId } from '../../../expense/domain/model/expense-id';
import { ExpenseAmount } from '../../../expense/domain/model/expense-amount';
import { ExpenseCurrencyUnit } from '../../../expense/domain/model/expense-currency-unit';

@CommandHandler(CreateReceiptCommand)
export class CreateReceiptHandler
  implements ICommandHandler<CreateReceiptCommand> {
  constructor(@Inject(RECEIPTS) private readonly receipts: Receipts) {}

  async execute(command: CreateReceiptCommand) {
    const receiptId = ReceiptId.fromString(command.receiptId);
    const expenseId = ExpenseId.fromString(command.expenseId);
    const date = ExpenseDate.fromDate(command.date);
    const payers = command.payers;
    const debtors = command.debtors;
    const amount = ExpenseAmount.withMoneyAndCurrencyCode(
      ExpenseCurrencyUnit.fromBigInt(BigInt(command.money)),
      GroupCurrencyCode.fromString(command.currencyCode),
    );

    const receipt = Receipt.add(
      receiptId,
      expenseId,
      date,
      payers,
      debtors,
      amount,
    );

    this.receipts.save(receipt);
  }
}
