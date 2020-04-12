import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import { DebtorWasCreated } from '../../../domain/event/debtor-was-created';
import { DebtorView } from '../schema/debtor.schema';

@EventsHandler(DebtorWasCreated)
export class DebtorWasCreatedProjection
  implements IEventHandler<DebtorWasCreated> {
  constructor(
    @Inject('DEBTOR_MODEL') private readonly debtorModel: Model<DebtorView>,
  ) {}

  async handle(event: DebtorWasCreated) {
    const debtorView = new this.debtorModel({
      _id: event.id,
      expenseId: event.expenseId,
      memberId: event.memberId,
      money: event.money,
      currencyCode: event.currencyCode,
    });

    return debtorView.save();
  }
}
