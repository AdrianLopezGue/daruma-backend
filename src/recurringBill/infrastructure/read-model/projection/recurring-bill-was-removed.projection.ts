import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';

import { RecurringBillWasRemoved } from '../../../domain/event/recurring-bill-was-removed.event';
import { RecurringBillView } from '../schema/recurring-bill.schema';

@EventsHandler(RecurringBillWasRemoved)
export class RecurringBillWasRemovedProjection
  implements IEventHandler<RecurringBillWasRemoved> {
  constructor(
    @Inject('RECURRING_BILL_MODEL')
    private readonly recurringBillModel: Model<RecurringBillView>,
  ) {}

  async handle(event: RecurringBillWasRemoved) {
    const recurringBillView = await this.recurringBillModel
      .findById(event.id)
      .exec();

    recurringBillView.remove();
  }
}
