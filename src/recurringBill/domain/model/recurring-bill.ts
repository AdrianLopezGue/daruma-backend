import { AggregateRoot } from '../../../core/domain/models/aggregate-root';

import { BillDate } from '../../../bill/domain/model/bill-date';
import { BillId } from '../../../bill/domain/model/bill-id';
import { RecurringBillId } from './recurring-bill-id';
import { RecurringBillWasCreated } from '../event/recurring-bill-was-created.event';
import { RecurringBillPeriod } from './recurring-bill-period';

export class RecurringBill extends AggregateRoot {
  private _recurringBillId: RecurringBillId;
  private _billId: BillId;
  private _recurringBillDate: BillDate;
  private _recurringBillPeriod: RecurringBillPeriod;

  private constructor() {
    super();
  }

  public static add(
    recurringBillId: RecurringBillId,
    billId: BillId,
    date: BillDate,
    period: RecurringBillPeriod,
  ): RecurringBill {
    const recurringBill = new RecurringBill();

    recurringBill.apply(
      new RecurringBillWasCreated(
        recurringBillId.value,
        billId.value,
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

  get date(): BillDate {
    return this._recurringBillDate;
  }

  get period(): RecurringBillPeriod {
    return this._recurringBillPeriod;
  }

  private onRecurringBillWasCreated(event: RecurringBillWasCreated) {
    this._recurringBillId = RecurringBillId.fromString(event.id);
    this._billId = BillId.fromString(event.billId);
    this._recurringBillDate = BillDate.fromDate(event.date);
    this._recurringBillPeriod = RecurringBillPeriod.fromNumber(event.period);
  }
}