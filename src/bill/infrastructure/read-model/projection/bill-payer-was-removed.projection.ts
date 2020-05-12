import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import { BillView } from '../schema/bill.schema';
import { BillPayerWasRemoved } from '../../../domain/event/bill-payer-was-removed.event';

@EventsHandler(BillPayerWasRemoved)
export class BillPayerWasRemovedProjection
  implements IEventHandler<BillPayerWasRemoved> {
  constructor(
    @Inject('BILL_MODEL') private readonly billModel: Model<BillView>,
  ) {}

  async handle(event: BillPayerWasRemoved) {
    this.billModel
      .updateOne(
        { _id: event.id },
        {
          $pull: {
            payers: {
              'props.memberId.props.value': event.payerId,
            },
          },
        },
      )
      .exec();
  }
}
