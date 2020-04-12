import { AggregateRoot } from '../../../core/domain/models/aggregate-root';

import { ExpenseId } from '../../../expense/domain/model/expense-id';
import { MemberId } from '../../../member/domain/model/member-id';
import { ExpenseAmount } from '../../../expense/domain/model/expense-amount';
import { PayerId } from './payer-id';
import { PayerWasCreated } from '../event/payer-was-created';
import { ExpenseCurrencyUnit } from '../../../expense/domain/model/expense-currency-unit';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';

export class Payer extends AggregateRoot {
  private _payerId: PayerId;
  private _expenseId: ExpenseId;
  private _memberId: MemberId;
  private _amount: ExpenseAmount;

  private constructor() {
    super();
  }

  public static add(
    payerId: PayerId,
    expenseId: ExpenseId,
    memberId: MemberId,
    amount: ExpenseAmount,
  ): Payer {
    const payer = new Payer();

    payer.apply(
      new PayerWasCreated(
        payerId.value,
        expenseId.value,
        memberId.value,
        amount.money.value,
        amount.currencyCode.value,
      ),
    );

    return payer;
  }

  aggregateId(): string {
    return this._payerId.value;
  }

  get id(): PayerId {
    return this._payerId;
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

  private onPayerWasCreated(event: PayerWasCreated) {
    this._payerId = PayerId.fromString(event.id);
    this._expenseId = ExpenseId.fromString(event.expenseId);
    this._memberId = MemberId.fromString(event.memberId);
    this._amount = ExpenseAmount.withMoneyAndCurrencyCode(
      ExpenseCurrencyUnit.fromBigInt(BigInt(event.money)),
      GroupCurrencyCode.fromString(event.currencyCode),
    );
  }
}
