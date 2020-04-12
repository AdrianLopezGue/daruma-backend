import { AggregateRoot } from '../../../core/domain/models/aggregate-root';

import { ExpenseId } from '../../../expense/domain/model/expense-id';
import { MemberId } from '../../../member/domain/model/member-id';
import { ExpenseAmount } from '../../../expense/domain/model/expense-amount';
import { DebtorId } from './debtor-id';
import { DebtorWasCreated } from '../event/debtor-was-created';
import { ExpenseCurrencyUnit } from '../../../expense/domain/model/expense-currency-unit';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';

export class Debtor extends AggregateRoot {
  private _debtorId: DebtorId;
  private _expenseId: ExpenseId;
  private _memberId: MemberId;
  private _amount: ExpenseAmount;

  private constructor() {
    super();
  }

  public static add(
    debtorId: DebtorId,
    expenseId: ExpenseId,
    memberId: MemberId,
    amount: ExpenseAmount,
  ): Debtor {
    const debtor = new Debtor();

    debtor.apply(
      new DebtorWasCreated(
        debtorId.value,
        expenseId.value,
        memberId.value,
        amount.money.value,
        amount.currencyCode.value,
      ),
    );

    return debtor;
  }

  aggregateId(): string {
    return this._debtorId.value;
  }

  get id(): DebtorId {
    return this._debtorId;
  }

  get expense(): ExpenseId {
    return this._expenseId;
  }

  get member(): MemberId {
    return this._memberId;
  }

  get amount(): ExpenseAmount {
    return this._amount;
  }

  private onDebtorWasCreated(event: DebtorWasCreated) {
    this._debtorId = DebtorId.fromString(event.id);
    this._expenseId = ExpenseId.fromString(event.expenseId);
    this._memberId = MemberId.fromString(event.memberId);
    this._amount = ExpenseAmount.withMoneyAndCurrencyCode(
      ExpenseCurrencyUnit.fromBigInt(BigInt(event.money)),
      GroupCurrencyCode.fromString(event.currencyCode),
    );
  }
}
