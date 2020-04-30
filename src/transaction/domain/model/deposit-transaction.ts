import { AggregateRoot } from '../../../core/domain/models/aggregate-root';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { MemberId } from '../../../member/domain/model/member-id';
import { TransactionId } from './transaction-id';
import { BillAmount } from '../../../bill/domain/model/bill-amount';
import { BillId } from '../../../bill/domain/model/bill-id';
import { BillCurrencyUnit } from '../../../bill/domain/model/bill-currency-unit';
import { DepositTransactionWasCreated } from '../event/deposit-transaction-was-created.event';
import { DepositTransactionWasRemoved } from '../event/deposit-transaction-was-removed.event';

export class DepositTransaction extends AggregateRoot {
  private _transactionId: TransactionId;
  private _memberId: MemberId;
  private _billId: BillId;
  private _amount: BillAmount;
  private _isRemoved: boolean;

  private constructor() {
    super();
  }

  public static add(
    transactionId: TransactionId,
    memberId: MemberId,
    billId: BillId,
    amount: BillAmount,
  ): DepositTransaction {
    const debtTransaction = new DepositTransaction();

    debtTransaction.apply(
      new DepositTransactionWasCreated(
        transactionId.value,
        memberId.value,
        billId.value,
        amount.money.value,
        amount.currencyCode.value,
      ),
    );

    return debtTransaction;
  }

  public aggregateId(): string {
    return this._transactionId.value;
  }

  get id(): TransactionId {
    return this._transactionId;
  }

  get memberId(): MemberId {
    return this._memberId;
  }

  get billId(): BillId {
    return this._billId;
  }

  get amount(): BillAmount {
    return this._amount;
  }

  get isRemoved(): boolean {
    return this._isRemoved;
  }

  remove() {
    if (this._isRemoved) {
      return;
    }

    this.apply(new DepositTransactionWasRemoved(this._transactionId.value));
  }

  private onDepositTransactionWasCreated(event: DepositTransactionWasCreated) {
    this._transactionId = TransactionId.fromString(event.id);
    this._memberId = MemberId.fromString(event.idMember);
    this._billId = BillId.fromString(event.idBill);
    this._amount = BillAmount.withMoneyAndCurrencyCode(
      BillCurrencyUnit.fromNumber(event.money),
      GroupCurrencyCode.fromString(event.currencyCode),
    );
    this._isRemoved = false;
  }

  private onDepositTransactionWasRemoved(event: DepositTransactionWasRemoved) {
    this._isRemoved = true;
  }
}
