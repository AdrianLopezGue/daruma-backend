import { AggregateRoot } from '../../../core/domain/models/aggregate-root';

import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { TransactionId } from './transaction-id';
import { MemberId } from '../../../member/domain/model/member-id';
import { TransactionWasCreated } from '../event/transaction-was-created';
import { BillAmount } from '../../../bill/domain/model/bill-amount';
import { BillCurrencyUnit } from '../../../bill/domain/model/bill-currency-unit';

export class Transaction extends AggregateRoot {
  private _transactionId: TransactionId;
  private _memberId: MemberId;
  private _amount: BillAmount;

  private constructor() {
    super();
  }

  public static add(
    transactionId: TransactionId,
    memberId: MemberId,
    amount: BillAmount,
  ): Transaction {
    const transaction = new Transaction();

    transaction.apply(
      new TransactionWasCreated(
        transactionId.value,
        memberId.value,
        amount.money.value,
        amount.currencyCode.value,
      ),
    );

    return transaction;
  }

  public aggregateId(): string {
    return this._transactionId.value;
  }

  get id(): TransactionId {
    return this._transactionId;
  }

  get expenseId(): MemberId {
    return this._memberId;
  }

  get amount(): BillAmount {
    return this._amount;
  }

  private onTransactionWasCreated(event: TransactionWasCreated) {
    this._transactionId = TransactionId.fromString(event.id);
    this._memberId = MemberId.fromString(event.id);
    this._amount = BillAmount.withMoneyAndCurrencyCode(
      BillCurrencyUnit.fromBigInt(BigInt(event.money)),
      GroupCurrencyCode.fromString(event.currencyCode),
    );
  }
}
