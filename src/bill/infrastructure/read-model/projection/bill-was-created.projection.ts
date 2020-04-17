import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import { BillWasCreated } from '../../../domain/event/bill-was-created';
import { BillView } from '../schema/bill.schema';


@EventsHandler(BillWasCreated)
export class BillWasCreatedProjection
  implements IEventHandler<BillWasCreated> {
  constructor(
    @Inject('BILL_MODEL') private readonly billModel: Model<BillView>,
  ) {}

  async handle(event: BillWasCreated) {
    const billView = new this.billModel({
      _id: event.id,
      groupId: event.groupId,
      name: event.name,
      money: event.money,
      currencyCode: event.currencyCode,
      date: event.date,
      payers: event.payers,
      debtors: event.debtors,
      creatorId: event.creatorId
    });

    return billView.save();
  }
}
