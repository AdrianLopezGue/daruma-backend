import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';

import { UserId } from '../../../user/domain/model/user-id';
import { CreateExpenseHandler } from './create-expense.handler';
import { ExpenseId } from '../../domain/model/expense-id';
import { ExpenseName } from '../../domain/model/expense-name';
import { ExpenseAmount } from '../../domain/model/expense-amount';
import { ExpenseCurrencyUnit } from '../../domain/model/expense-currency-unit';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { ExpenseDate } from '../../domain/model/expense-date';
import { ExpensePeriodicity } from '../../domain/model/expense-periodicity';
import { ExpenseEndPeriodicity } from '../../domain/model/expense-end-periodicity';
import { Expenses } from '../../domain/repository/expenses';
import { CreateExpenseCommand } from '../command/create-expense.command';
import { EXPENSES } from '../../domain/repository/index';
import { Expense } from '../../domain/model/expense';
import { GroupId } from '../../../group/domain/model/group-id';

describe('CreateExpenseHandler', () => {
  let command$: CreateExpenseHandler;

  const expenses: Partial<Expenses> = {};

  const expenseId = ExpenseId.fromString(v4());
  const groupId = GroupId.fromString(v4());
  const name = ExpenseName.fromString('Expense name');
  const amount = ExpenseAmount.withMoneyAndCurrencyCode(
    ExpenseCurrencyUnit.fromBigInt(BigInt(100)),
    GroupCurrencyCode.fromString('EUR'),
  );
  const payers = [UserId.fromString('111111'), UserId.fromString('222222')];
  const debtors = [UserId.fromString('333333'), UserId.fromString('444444')];
  const date = ExpenseDate.fromDate(new Date('2019-11-15T17:43:50'));
  const periodicity = ExpensePeriodicity.fromString('Daily');
  const endPeriodicity = ExpenseEndPeriodicity.fromDate(new Date('2019-11-15T17:43:50'));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateExpenseHandler,
        {
          provide: EXPENSES,
          useValue: expenses,
        },
      ],
    }).compile();

    command$ = module.get<CreateExpenseHandler>(CreateExpenseHandler);
    expenses.save = jest.fn();
  });

  it('should creates a new expense', async () => {
    await command$.execute(
      new CreateExpenseCommand(
        expenseId.value,
        groupId.value,
        name.value,
        amount.money.value,
        amount.currencyCode.value,
        payers.map((payer) => payer.value),
        debtors.map((debtor) => debtor.value),
        date.value,
        periodicity.value,
        endPeriodicity.value
      ),
    );

    expect(expenses.save).toHaveBeenCalledWith(
        Expense.add(expenseId, groupId, name, amount, payers, debtors, date, periodicity, endPeriodicity),
    );
  });
});
