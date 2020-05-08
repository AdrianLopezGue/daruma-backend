import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import { BillView } from '../schema/bill.schema';
import { BillMoneyWasChanged } from '../../../domain/event/bill-money-was-changed.event';

@EventsHandler(BillMoneyWasChanged)
export class BillMoneyWasChangedProjection
  implements IEventHandler<BillMoneyWasChanged> {
  constructor(
    @Inject('BILL_MODEL') private readonly billModel: Model<BillView>,
  ) {}

  async handle(event: BillMoneyWasChanged) {
    this.billModel.updateOne({ _id: event.id }, { money: event.money }).exec();
  }
}