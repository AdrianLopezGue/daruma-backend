import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateExpenseCommand } from '../command/create-expense.command';
import { EXPENSES } from '../../domain/repository/index';
import { ExpenseId } from '../../domain/model/expense-id';
import { Expense } from '../../domain/model/expense';
import { ExpenseName } from '../../domain/model/expense-name';
import { ExpenseAmount } from '../../domain/model/expense-amount';
import { ExpenseCurrencyUnit } from '../../domain/model/expense-currency-unit';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { ExpenseDate } from '../../domain/model/expense-date';
import { ExpensePeriodicity } from '../../domain/model/expense-periodicity';
import { ExpenseEndPeriodicity } from '../../domain/model/expense-end-periodicity';
import { Expenses } from '../../domain/repository/expenses';
import { PayerId } from '../../../payer/domain/model/payer-id';
import { MemberId } from '../../../member/domain/model/member-id';
import { DebtorId } from '../../../debtor/domain/model/debtor-id';
import { Payer } from '../../../payer/domain/model/payer';
import { PAYERS, Payers } from '../../../payer/domain/repository/index';
import { Debtor } from '../../../debtor/domain/model/debtor';
import { DEBTORS, Debtors } from '../../../debtor/domain/repository/index';
import uuid = require('uuid');

@CommandHandler(CreateExpenseCommand)
export class CreateExpenseHandler
  implements ICommandHandler<CreateExpenseCommand> {
  constructor(
    @Inject(EXPENSES) private readonly expenses: Expenses,
    @Inject(PAYERS) private readonly payers: Payers,
    @Inject(DEBTORS) private readonly debtors: Debtors,
  ) {}

  async execute(command: CreateExpenseCommand) {
    const expenseId = ExpenseId.fromString(command.expenseId);
    const groupId = ExpenseId.fromString(command.groupId);
    const name = ExpenseName.fromString(command.name);
    const amount = ExpenseAmount.withMoneyAndCurrencyCode(
      ExpenseCurrencyUnit.fromBigInt(BigInt(command.money)),
      GroupCurrencyCode.fromString(command.currencyCode),
    );
    const expensePayers = command.payers;
    const expenseDebtors = command.debtors;
    const date = ExpenseDate.fromDate(command.date);
    const periodicity = ExpensePeriodicity.fromString(command.periodicity);
    const endPeriodicity = ExpenseEndPeriodicity.fromDate(
      command.endPeriodicity,
    );

    const expense = Expense.add(
      expenseId,
      groupId,
      name,
      amount,
      date,
      periodicity,
      endPeriodicity,
    );

    this.expenses.save(expense);

    const payersAdded: Payer[] =  [];
    const debtorsAdded: Debtor[] =  [];

    expensePayers.forEach(payer => {
      payersAdded.push(expense.addPayer(
        PayerId.fromString(uuid.v4()),
        MemberId.fromString(payer.id),
        ExpenseAmount.withMoneyAndCurrencyCode(
          ExpenseCurrencyUnit.fromBigInt(BigInt(payer.money)),
          GroupCurrencyCode.fromString(command.currencyCode),
        )
      ))
    });

    payersAdded.map((payer) => this.payers.save(payer));

    expenseDebtors.forEach(debtor => {
      debtorsAdded.push(expense.addDebtor(
        DebtorId.fromString(uuid.v4()),
        MemberId.fromString(debtor.id),
        ExpenseAmount.withMoneyAndCurrencyCode(
          ExpenseCurrencyUnit.fromBigInt(BigInt(debtor.money)),
          GroupCurrencyCode.fromString(command.currencyCode),
        )
      ))
    });

    debtorsAdded.map((debtor) => this.debtors.save(debtor));
  }
}
