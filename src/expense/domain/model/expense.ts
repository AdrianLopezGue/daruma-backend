import { AggregateRoot } from '../../../core/domain/models/aggregate-root';

import { ExpenseId } from './expense-id';
import { ExpenseName } from './expense-name';
import { ExpenseAmount } from './expense-amount';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { ExpenseDate } from './expense-date';
import { ExpensePeriodicity } from './expense-periodicity';
import { ExpenseEndPeriodicity } from './expense-end-periodicity';
import { ExpenseWasCreated } from '../event/expense-was-created';
import { ExpenseCurrencyUnit } from './expense-currency-unit';
import { GroupId } from '../../../group/domain/model/group-id';

export class Expense extends AggregateRoot {
  private _expenseId: ExpenseId;
  private _groupId: GroupId;
  private _name: ExpenseName;
  private _amount: ExpenseAmount;
  private _date: ExpenseDate;
  private _periodicity: ExpensePeriodicity;
  private _endPeriodicity: ExpenseEndPeriodicity;

  private constructor() {
    super();
  }

  public static add(
    expenseId: ExpenseId,
    groupId: GroupId,
    name: ExpenseName,
    amount: ExpenseAmount,
    date: ExpenseDate,
    periodicty: ExpensePeriodicity,
    endPeriodicity: ExpenseEndPeriodicity,
  ): Expense {
    const expense = new Expense();

    expense.apply(
      new ExpenseWasCreated(
        expenseId.value,
        groupId.value,
        name.value,
        amount.money.value,
        amount.currencyCode.value,
        date.value,
        periodicty.value,
        endPeriodicity != null ? endPeriodicity.value : null,
      ),
    );

    return expense;
  }

  public aggregateId(): string {
    return this._expenseId.value;
  }

  get id(): ExpenseId {
    return this._expenseId;
  }

  get groupId(): GroupId {
    return this._groupId;
  }

  get name(): ExpenseName {
    return this._name;
  }

  get amount(): ExpenseAmount {
    return this._amount;
  }

  get date(): ExpenseDate {
    return this._date;
  }

  get periodicity(): ExpensePeriodicity {
    return this._periodicity;
  }

  get endPeriodicity(): ExpenseEndPeriodicity {
    return this._endPeriodicity;
  }

  private onExpenseWasCreated(event: ExpenseWasCreated) {
    this._expenseId = ExpenseId.fromString(event.id);
    this._groupId = GroupId.fromString(event.groupId);
    this._name = ExpenseName.fromString(event.name);
    this._amount = ExpenseAmount.withMoneyAndCurrencyCode(
      ExpenseCurrencyUnit.fromBigInt(BigInt(event.money)),
      GroupCurrencyCode.fromString(event.currencyCode),
    );
    this._date = ExpenseDate.fromDate(event.date);
    this._periodicity = ExpensePeriodicity.fromString(event.periodicity);
    this._endPeriodicity = ExpenseEndPeriodicity.fromDate(event.endPeriodicity);
  }
}
