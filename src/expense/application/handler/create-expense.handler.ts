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
import { UserId } from '../../../user/domain/model/user-id';
import { Expenses } from '../../domain/repository/expenses';


@CommandHandler(CreateExpenseCommand)
export class CreateExpenseHandler implements ICommandHandler<CreateExpenseCommand> {
  constructor(
    @Inject(EXPENSES) private readonly expenses: Expenses,
  ) {}

  async execute(command: CreateExpenseCommand) {

    const expenseId = ExpenseId.fromString(command.expenseId);
    const groupId = ExpenseId.fromString(command.groupId);
    const name = ExpenseName.fromString(command.name);
    const amount = ExpenseAmount.withMoneyAndCurrencyCode(
      ExpenseCurrencyUnit.fromBigInt(BigInt(command.money)),
      GroupCurrencyCode.fromString(command.currencyCode),
    );
    const payers = command.payers.map((payer) => UserId.fromString(payer));
    const debtors = command.debtors.map((debtor) => UserId.fromString(debtor));
    const date = ExpenseDate.fromDate(command.date);
    const periodicity = ExpensePeriodicity.fromString(command.periodicity);
    const endPeriodicity = ExpenseEndPeriodicity.fromDate(command.endPeriodicity);

    const expense = Expense.add(expenseId, groupId, name, amount, payers, debtors, date, periodicity, endPeriodicity);

    this.expenses.save(expense);
  }
}