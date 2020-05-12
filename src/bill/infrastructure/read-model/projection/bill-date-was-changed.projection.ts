import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import { BillView } from '../schema/bill.schema';
import { BillDateWasChanged } from '../../../domain/event/bill-date-was-changed.event';

@EventsHandler(BillDateWasChanged)
export class BillDateWasChangedProjection
  implements IEventHandler<BillDateWasChanged> {
  constructor(
    @Inject('BILL_MODEL') private readonly billModel: Model<BillView>,
  ) {}

  async handle(event: BillDateWasChanged) {
    this.billModel.updateOne({ _id: event.id }, { date: event.date }).exec();
  }
}
