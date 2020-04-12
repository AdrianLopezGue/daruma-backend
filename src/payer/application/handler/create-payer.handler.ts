import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreatePayerCommand } from '../command/create-payer.command';
import { PAYERS } from '../../domain/repository/index';
import { Payers } from '../../domain/repository/payers';
import { PayerId } from '../../domain/model/payer-id';
import { ExpenseId } from '../../../expense/domain/model/expense-id';
import { MemberId } from '../../../member/domain/model/member-id';
import { ExpenseAmount } from '../../../expense/domain/model/expense-amount';
import { ExpenseCurrencyUnit } from '../../../expense/domain/model/expense-currency-unit';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { Payer } from '../../domain/model/payer';


@CommandHandler(CreatePayerCommand)
export class CreatePayerHandler implements ICommandHandler<CreatePayerCommand> {
  constructor(
    @Inject(PAYERS) private readonly payers: Payers,
  ) {}

  async execute(command: CreatePayerCommand) {
    const payerId = PayerId.fromString(command.payerId);
    const expenseId = ExpenseId.fromString(command.expenseId);
    const memberId = MemberId.fromString(command.memberId);
    const amount = ExpenseAmount.withMoneyAndCurrencyCode(
        ExpenseCurrencyUnit.fromBigInt(BigInt(command.money)),
        GroupCurrencyCode.fromString(command.currencyCode),
      );

    const payer = Payer.add(payerId, expenseId, memberId, amount);

    this.payers.save(payer);
  }
}
