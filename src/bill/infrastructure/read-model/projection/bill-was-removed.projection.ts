import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import { BillWasRemoved } from '../../../domain/event/bill-was-removed.event';
import { BillView } from '../schema/bill.schema';

@EventsHandler(BillWasRemoved)
export class BillWasRemovedProjection
  implements IEventHandler<BillWasRemoved> {
  constructor(
    @Inject('BILL_MODEL') private readonly billmodel: Model<BillView>,
  ) {}

  async handle(event: BillWasRemoved) {
    const billView = await this.billmodel.findById(event.id).exec();

    billView.remove();
  }
}