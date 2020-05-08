import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import { BillView } from '../schema/bill.schema';
import { BillDebtorWasAdded } from '../../../domain/event/bill-debtor-was-added.event';

@EventsHandler(BillDebtorWasAdded)
export class BillDebtorWasAddedProjection
  implements IEventHandler<BillDebtorWasAdded> {
  constructor(
    @Inject('BILL_MODEL') private readonly billModel: Model<BillView>,
  ) {}

  async handle(event: BillDebtorWasAdded) {
    this.billModel
      .updateOne(
        { _id: event.id },
        {
          $push: {
            'debtors': event.debtor,
          },
        },
      )
      .exec();
  }
}
