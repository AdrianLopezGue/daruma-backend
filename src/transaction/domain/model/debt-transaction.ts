import { AggregateRoot } from '../../../core/domain/models/aggregate-root';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { MemberId } from '../../../member/domain/model/member-id';
import { TransactionId } from './transaction-id';
import { BillAmount } from '../../../bill/domain/model/bill-amount';
import { BillId } from '../../../bill/domain/model/bill-id';
import { DebtTransactionWasCreated } from '../event/debt-transaction-was-created';
import { BillCurrencyUnit } from '../../../bill/domain/model/bill-currency-unit';

export class DebtTransaction extends AggregateRoot {
  private _transactionId: TransactionId;
  private _memberId: MemberId;
  private _billId: BillId;
  private _amount: BillAmount;

  private constructor() {
    super();
  }

  public static add(
    transactionId: TransactionId,
    memberId: MemberId,
    billId: BillId,
    amount: BillAmount,
  ): DebtTransaction {
    const debtTransaction = new DebtTransaction();

    debtTransaction.apply(
      new DebtTransactionWasCreated(
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

  private onDebtTransactionWasCreated(event: DebtTransactionWasCreated) {
    this._transactionId = TransactionId.fromString(event.id);
    this._memberId = MemberId.fromString(event.idMember);
    this._billId = BillId.fromString(event.idBill);
    this._amount = BillAmount.withMoneyAndCurrencyCode(
      BillCurrencyUnit.fromNumber(event.money),
      GroupCurrencyCode.fromString(event.currencyCode),
    );
  }
}
