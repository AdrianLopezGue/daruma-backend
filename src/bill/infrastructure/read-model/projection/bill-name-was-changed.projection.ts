import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import { BillNameWasChanged } from '../../../domain/event/bill-name-was-changed.event';
import { BillView } from '../schema/bill.schema';

@EventsHandler(BillNameWasChanged)
export class BillNameWasChangedProjection
  implements IEventHandler<BillNameWasChanged> {
  constructor(
    @Inject('BILL_MODEL') private readonly billModel: Model<BillView>,
  ) {}

  async handle(event: BillNameWasChanged) {
    this.billModel.updateOne({ _id: event.id }, { name: event.name }).exec();
  }
}