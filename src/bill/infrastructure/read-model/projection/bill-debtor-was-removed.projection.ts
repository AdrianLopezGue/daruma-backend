import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import { BillView } from '../schema/bill.schema';
import { BillDebtorWasRemoved } from '../../../domain/event/bill-debtor-was-removed.event';

@EventsHandler(BillDebtorWasRemoved)
export class BillDebtorWasRemovedProjection
  implements IEventHandler<BillDebtorWasRemoved> {
  constructor(
    @Inject('BILL_MODEL') private readonly billModel: Model<BillView>,
  ) {}

  async handle(event: BillDebtorWasRemoved) {
    this.billModel
      .updateOne(
        { _id: event.id },
        {
          $pull: {
            'debtors': {
              'props.memberId.props.value': event.debtorId,
            },
          },
        },
      )
      .exec();
  }
}
