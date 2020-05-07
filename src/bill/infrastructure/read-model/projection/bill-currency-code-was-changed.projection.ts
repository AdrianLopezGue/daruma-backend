import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import { BillCurrencyCodeWasChanged } from '../../../domain/event/bill-currency-code-was-changed.event';
import { BillView } from '../schema/bill.schema';


@EventsHandler(BillCurrencyCodeWasChanged)
export class BillCurrencyCodeWasChangedProjection
  implements IEventHandler<BillCurrencyCodeWasChanged> {
  constructor(
    @Inject('BILL_MODEL') private readonly billModel: Model<BillView>,
  ) {}

  async handle(event: BillCurrencyCodeWasChanged) {
    this.billModel.updateOne({ _id: event.id }, { currencyCode: event.currencyCode }).exec();
  }
}