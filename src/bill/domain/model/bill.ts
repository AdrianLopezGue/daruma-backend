import { AggregateRoot } from '../../../core/domain/models/aggregate-root';

import { BillId } from './bill-id';
import { BillName } from './bill-name';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { BillDate } from './bill-date';
import { GroupId } from '../../../group/domain/model/group-id';
import { BillPayer } from './bill-payer';
import { BillDebtor } from './bill-debtor';
import { BillAmount } from './bill-amount';
import { BillWasCreated } from '../event/bill-was-created.event';
import { BillCurrencyUnit } from './bill-currency-unit';
import { MemberId } from '../../../member/domain/model/member-id';
import { TransactionId } from '../../../transaction/domain/model/transaction-id';
import { DepositTransaction } from '../../../transaction/domain/model/deposit-transaction';
import { DebtTransaction } from '../../../transaction/domain/model/debt-transaction';
import { BillWasRemoved } from '../event/bill-was-removed.event';

export class Bill extends AggregateRoot {
  private _billId: BillId;
  private _groupId: GroupId;
  private _name: BillName;
  private _amount: BillAmount;
  private _date: BillDate;
  private _payers: BillPayer[];
  private _debtors: BillDebtor[];
  private _creatorId: MemberId;
  private _isRemoved: boolean;

  private constructor() {
    super();
  }

  public static add(
    billId: BillId,
    groupId: GroupId,
    name: BillName,
    amount: BillAmount,
    date: BillDate,
    payers: BillPayer[],
    debtors: BillDebtor[],
    creatorId: MemberId,
  ): Bill {
    const bill = new Bill();

    bill.apply(
      new BillWasCreated(
        billId.value,
        groupId.value,
        name.value,
        amount.money.value,
        amount.currencyCode.value,
        date.value,
        payers,
        debtors,
        creatorId.value,
      ),
    );

    return bill;
  }

  public addDepositTransaction(
    transactionId: TransactionId,
    memberId: MemberId,
    amount: BillAmount,
  ): DepositTransaction {
    return DepositTransaction.add(transactionId, memberId, this.id, amount);
  }

  public addDebtTransaction(
    transactionId: TransactionId,
    memberId: MemberId,
    amount: BillAmount,
  ): DebtTransaction {
    return DebtTransaction.add(transactionId, memberId, this.id, amount);
  }

  public aggregateId(): string {
    return this._billId.value;
  }

  get id(): BillId {
    return this._billId;
  }

  get groupId(): GroupId {
    return this._groupId;
  }

  get name(): BillName {
    return this._name;
  }

  get amount(): BillAmount {
    return this._amount;
  }

  get date(): BillDate {
    return this._date;
  }

  get payers(): BillPayer[] {
    return this._payers;
  }

  get debtors(): BillDebtor[] {
    return this._debtors;
  }

  get creator(): MemberId {
    return this._creatorId;
  }

  get isRemoved(): boolean {
    return this._isRemoved;
  }

  remove() {
    if (this._isRemoved) {
      return;
    }

    this.apply(new BillWasRemoved(this._billId.value));
  }

  private onBillWasCreated(event: BillWasCreated) {
    this._billId = BillId.fromString(event.id);
    this._groupId = GroupId.fromString(event.groupId);
    this._name = BillName.fromString(event.name);
    this._amount = BillAmount.withMoneyAndCurrencyCode(
      BillCurrencyUnit.fromNumber(event.money),
      GroupCurrencyCode.fromString(event.currencyCode),
    );
    this._date = BillDate.fromDate(event.date);
    this._payers = event.payers;
    this._debtors = event.debtors;
    this._creatorId = MemberId.fromString(event.creatorId);
    this._isRemoved = false;
  }

  private onBillWasRemoved(event: BillWasRemoved) {
    this._isRemoved = true;
  }
}
