import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import { PayerWasCreated } from '../../../domain/event/payer-was-created';
import { PayerView } from '../schema/payer.schema';

@EventsHandler(PayerWasCreated)
export class PayerWasCreatedProjection
  implements IEventHandler<PayerWasCreated> {
  constructor(
    @Inject('PAYER_MODEL') private readonly payerModel: Model<PayerView>,
  ) {}

  async handle(event: PayerWasCreated) {
    const payerView = new this.payerModel({
      _id: event.id,
      expenseId: event.expenseId,
      memberId: event.memberId,
      money: event.money,
      currencyCode: event.currencyCode,
    });

    return payerView.save();
  }
}
