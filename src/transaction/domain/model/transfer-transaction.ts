import { AggregateRoot } from '../../../core/domain/models/aggregate-root';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { MemberId } from '../../../member/domain/model/member-id';
import { TransactionId } from './transaction-id';
import { BillAmount } from '../../../bill/domain/model/bill-amount';
import { BillCurrencyUnit } from '../../../bill/domain/model/bill-currency-unit';
import { TransferTransactionWasCreated } from '../event/transfer-transaction-was-created';

export class TransferTransaction extends AggregateRoot {
  private _transactionId: TransactionId;
  private _senderId: MemberId;
  private _beneficiaryId: MemberId;
  private _amount: BillAmount;

  private constructor() {
    super();
  }

  public static add(
    transactionId: TransactionId,
    senderId: MemberId,
    beneficiaryId: MemberId,
    amount: BillAmount,
  ): TransferTransaction {
    const transferTransaction = new TransferTransaction();

    transferTransaction.apply(
      new TransferTransactionWasCreated(
        transactionId.value,
        senderId.value,
        beneficiaryId.value,
        amount.money.value,
        amount.currencyCode.value,
      ),
    );

    return transferTransaction;
  }

  public aggregateId(): string {
    return this._transactionId.value;
  }

  get id(): TransactionId {
    return this._transactionId;
  }

  get senderId(): MemberId {
    return this._senderId;
  }

  get beneficiaryId(): MemberId {
    return this._beneficiaryId;
  }

  get amount(): BillAmount {
    return this._amount;
  }

  private onTransferTransactionWasCreated(
    event: TransferTransactionWasCreated,
  ) {
    this._transactionId = TransactionId.fromString(event.id);
    this._senderId = MemberId.fromString(event.idSender);
    this._beneficiaryId = MemberId.fromString(event.idBeneficiary);
    this._amount = BillAmount.withMoneyAndCurrencyCode(
      BillCurrencyUnit.fromNumber(event.money),
      GroupCurrencyCode.fromString(event.currencyCode),
    );
  }
}
