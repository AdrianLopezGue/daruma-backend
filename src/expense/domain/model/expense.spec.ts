import { CqrsModule, EventBus, EventPublisher } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';
import { Expense } from './expense';
import { ExpenseId } from './expense-id';
import { ExpenseName } from './expense-name';
import { ExpenseAmount } from './expense-amount';
import { ExpenseCurrencyUnit } from './expense-currency-unit';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { ExpenseWasCreated } from '../event/expense-was-created';
import { ExpenseDate } from './expense-date';
import { UserId } from '../../../user/domain/model/user-id';
import { ExpensePeriodicity } from './expense-periodicity';
import { ExpenseEndPeriodicity } from './expense-end-periodicity';
import { GroupId } from '../../../group/domain/model/group-id';

describe('Expense', () => {
  let expense: Expense;
  let eventBus$: EventBus;
  let eventPublisher$: EventPublisher;

  const expenseId = ExpenseId.fromString(v4());
  const groupId = GroupId.fromString(v4());
  const name = ExpenseName.fromString('Expense Name');
  const amount = ExpenseAmount.withMoneyAndCurrencyCode(
    ExpenseCurrencyUnit.fromBigInt(BigInt(100)),
    GroupCurrencyCode.fromString('EUR'),
  );
  const payers = [UserId.fromString('111111'), UserId.fromString('222222')];
  const debtors = [UserId.fromString('333333'), UserId.fromString('444444')];
  const date = ExpenseDate.fromDate(new Date('2019-11-15T17:43:50'));
  const periodicity = ExpensePeriodicity.fromString('Daily');
  const endPeriodicity = ExpenseEndPeriodicity.fromDate(
    new Date('2019-11-15T17:43:50'),
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventBus$.publish = jest.fn();
    eventPublisher$ = module.get<EventPublisher>(EventPublisher);
  });

  it('can be created', () => {
    expense = eventPublisher$.mergeObjectContext(
      Expense.add(
        expenseId,
        groupId,
        name,
        amount,
        payers,
        debtors,
        date,
        periodicity,
        endPeriodicity,
      ),
    );
    expense.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new ExpenseWasCreated(
        expenseId.value,
        groupId.value,
        name.value,
        amount.money.value,
        amount.currencyCode.value,
        payers.map(payer => payer.value),
        debtors.map(debtor => debtor.value),
        date.value,
        periodicity.value,
        endPeriodicity.value,
      ),
    );
  });

  it('has an id', () => {
    expect(expense.id.equals(expenseId)).toBeTruthy();
  });

  it('has an groupId', () => {
    expect(expense.groupId.equals(groupId)).toBeTruthy();
  });

  it('has a name', () => {
    expect(expense.name.equals(name)).toBeTruthy();
  });

  it('has an amount', () => {
    expect(expense.amount.money.equals(amount.money)).toBeTruthy();
    expect(
      expense.amount.currencyCode.equals(amount.currencyCode),
    ).toBeTruthy();
  });

  it('has an date', () => {
    expect(expense.date.equals(date)).toBeTruthy();
  });

  it('has an periodicity', () => {
    expect(expense.periodicity.equals(periodicity)).toBeTruthy();
  });

  it('has an endPeriodicity', () => {
    expect(expense.endPeriodicity.equals(endPeriodicity)).toBeTruthy();
  });

  it('has payers', () => {
    const payersA: string = payers.toString();
    const payersB: string = expense.payers.toString();

    expect(payersA === payersB).toBeTruthy();
  });

  it('has debtors', () => {
    const debtorsA: string = debtors.toString();
    const debtorsB: string = expense.debtors.toString();

    expect(debtorsA === debtorsB).toBeTruthy();
  });
});
