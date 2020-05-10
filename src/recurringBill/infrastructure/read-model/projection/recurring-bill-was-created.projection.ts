import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import { RecurringBillWasCreated } from '../../../domain/event/recurring-bill-was-created.event';
import { RecurringBillView } from '../schema/recurring-bill.schema';

@EventsHandler(RecurringBillWasCreated)
export class RecurringBillWasCreatedProjection
  implements IEventHandler<RecurringBillWasCreated> {
  constructor(
    @Inject('RECURRING_BILL_MODEL') private readonly recurringBillModel: Model<RecurringBillView>,
  ) {}

  async handle(event: RecurringBillWasCreated) {
    const nextDate = this.addDays(new Date(event.date), event.period);

    const recurringBillView = new this.recurringBillModel({
      _id: event.id,
      billId: event.billId,
      groupId: event.groupId,
      nextCreationDate: nextDate,
    });

    return recurringBillView.save();
  }

  addDays(date: Date, days: number) {
    const copy = new Date(Number(date))
    copy.setDate(date.getDate() + days)
    return copy
  }
}