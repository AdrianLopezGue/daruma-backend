import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import { BillView } from '../schema/bill.schema';
import { BillPayerWasAdded } from '../../../domain/event/bill-payer-was-added.event';

@EventsHandler(BillPayerWasAdded)
export class BillPayerWasAddedProjection
  implements IEventHandler<BillPayerWasAdded> {
  constructor(
    @Inject('BILL_MODEL') private readonly billModel: Model<BillView>,
  ) {}

  async handle(event: BillPayerWasAdded) {
    this.billModel
      .updateOne(
        { _id: event.id },
        {
          $push: {
            'payers': event.payer,
          },
        },
      )
      .exec();
  }
}
