import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';

import { RecurringBillPeriodWasChanged } from '../../../domain/event/recurring-bill-period-was-changed.event';
import { RecurringBillView } from '../schema/recurring-bill.schema';

@EventsHandler(RecurringBillPeriodWasChanged)
export class RecurringBillPeriodWasChangedProjection
  implements IEventHandler<RecurringBillPeriodWasChanged> {
  constructor(
    @Inject('RECURRING_BILL_MODEL')
    private readonly recurringBillModel: Model<RecurringBillView>,
  ) {}

  async handle(event: RecurringBillPeriodWasChanged) {
    const nextDate = this.addDays(new Date(event.date), event.period);

    this.recurringBillModel
      .updateOne(
        { _id: event.id },
        { nextCreationDate: nextDate, period: event.period },
      )
      .exec();
  }

  addDays(date: Date, days: number) {
    const copy = new Date(Number(date));
    copy.setDate(date.getDate() + days);
    return copy;
  }
}
