import { AggregateRoot } from '../../../core/domain/models/aggregate-root';

import { BillId } from './bill-id';
import { BillName } from './bill-name';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { BillDate } from './bill-date';
import { GroupId } from '../../../group/domain/model/group-id';
import { BillPayer } from './bill-payer';
import { BillDebtor } from './bill-debtor';
import { BillAmount } from './bill-amount';
import { BillWasCreated } from '../event/bill-was-created';
import { BillCurrencyUnit } from './bill-currency-unit';
import { MemberId } from '../../../member/domain/model/member-id';

export class Bill extends AggregateRoot {
  private _billId: BillId;
  private _groupId: GroupId;
  private _name: BillName;
  private _amount: BillAmount;
  private _date: BillDate;
  private _payers: BillPayer[];
  private _debtors: BillDebtor[];
  private _creatorId: MemberId;

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
        creatorId.value
      ),
    );

    return bill;
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

  private onBillWasCreated(event: BillWasCreated) {
    this._billId = BillId.fromString(event.id);
    this._groupId = GroupId.fromString(event.groupId);
    this._name = BillName.fromString(event.name);
    this._amount = BillAmount.withMoneyAndCurrencyCode(
      BillCurrencyUnit.fromBigInt(BigInt(event.money)),
      GroupCurrencyCode.fromString(event.currencyCode),
    );
    this._date = BillDate.fromDate(event.date);
    this._payers = event.payers;
    this._debtors = event.debtors;
    this._creatorId = MemberId.fromString(event.creatorId);
  }
}
