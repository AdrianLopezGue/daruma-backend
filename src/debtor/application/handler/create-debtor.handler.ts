import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateDebtorCommand } from '../command/create-debtor.command';
import { DEBTORS } from '../../domain/repository/index';
import { Debtors } from '../../domain/repository/debtors';
import { DebtorId } from '../../domain/model/debtor-id';
import { ExpenseId } from '../../../expense/domain/model/expense-id';
import { MemberId } from '../../../member/domain/model/member-id';
import { ExpenseAmount } from '../../../expense/domain/model/expense-amount';
import { ExpenseCurrencyUnit } from '../../../expense/domain/model/expense-currency-unit';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { Debtor } from '../../domain/model/debtor';

@CommandHandler(CreateDebtorCommand)
export class CreateDebtorHandler implements ICommandHandler<CreateDebtorCommand> {
  constructor(@Inject(DEBTORS) private readonly debtors: Debtors) {}

  async execute(command: CreateDebtorCommand) {
    const debtorId = DebtorId.fromString(command.debtorId);
    const expenseId = ExpenseId.fromString(command.expenseId);
    const memberId = MemberId.fromString(command.memberId);
    const amount = ExpenseAmount.withMoneyAndCurrencyCode(
      ExpenseCurrencyUnit.fromBigInt(BigInt(command.money)),
      GroupCurrencyCode.fromString(command.currencyCode),
    );

    const debtor = Debtor.add(debtorId, expenseId, memberId, amount);

    this.debtors.save(debtor);
  }
}
