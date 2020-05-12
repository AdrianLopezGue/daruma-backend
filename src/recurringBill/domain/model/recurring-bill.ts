import { AggregateRoot } from '../../../core/domain/models/aggregate-root';

import { BillDate } from '../../../bill/domain/model/bill-date';
import { BillId } from '../../../bill/domain/model/bill-id';
import { RecurringBillId } from './recurring-bill-id';
import { RecurringBillWasCreated } from '../event/recurring-bill-was-created.event';
import { RecurringBillPeriod } from './recurring-bill-period';
import { RecurringBillWasRemoved } from '../event/recurring-bill-was-removed.event';
import { GroupId } from '../../../group/domain/model/group-id';
import { RecurringBillPeriodWasChanged } from '../event/recurring-bill-period-was-changed.event';

export class RecurringBill extends AggregateRoot {
  private _recurringBillId: RecurringBillId;
  private _billId: BillId;
  private _groupId: GroupId;
  private _recurringBillDate: BillDate;
  private _recurringBillPeriod: RecurringBillPeriod;
  private _isRemoved: boolean;

  private constructor() {
    super();
  }

  public static add(
    recurringBillId: RecurringBillId,
    billId: BillId,
    groupId: GroupId,
    date: BillDate,
    period: RecurringBillPeriod,
  ): RecurringBill {
    const recurringBill = new RecurringBill();

    recurringBill.apply(
      new RecurringBillWasCreated(
        recurringBillId.value,
        billId.value,
        groupId.value,
        date.value,
        period.value,
      ),
    );

    return recurringBill;
  }

  aggregateId(): string {
    return this._recurringBillId.value;
  }

  get id(): RecurringBillId {
    return this._recurringBillId;
  }

  get billId(): BillId {
    return this._billId;
  }

  get groupId(): GroupId {
    return this._groupId;
  }

  get date(): BillDate {
    return this._recurringBillDate;
  }

  get period(): RecurringBillPeriod {
    return this._recurringBillPeriod;
  }

  get isRemoved(): boolean {
    return this._isRemoved;
  }

  remove() {
    if (this._isRemoved) {
      return;
    }

    this.apply(new RecurringBillWasRemoved(this._recurringBillId.value));
  }

  changePeriod(period: RecurringBillPeriod) {
    if (period.equals(this._recurringBillPeriod)) {
      return;
    }

    this.apply(
      new RecurringBillPeriodWasChanged(
        this._recurringBillId.value,
        this._recurringBillDate.value,
        period.value,
      ),
    );
  }

  private onRecurringBillWasCreated(event: RecurringBillWasCreated) {
    this._recurringBillId = RecurringBillId.fromString(event.id);
    this._billId = BillId.fromString(event.billId);
    this._groupId = GroupId.fromString(event.groupId);
    this._recurringBillDate = BillDate.fromDate(event.date);
    this._recurringBillPeriod = RecurringBillPeriod.fromNumber(event.period);
    this._isRemoved = false;
  }

  private onRecurringBillPeriodWasChanged(
    event: RecurringBillPeriodWasChanged,
  ) {
    this._recurringBillPeriod = RecurringBillPeriod.fromNumber(event.period);
  }

  private onRecurringBillWasRemoved(event: RecurringBillWasRemoved) {
    this._isRemoved = true;
  }
}
