import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';

import { ExpenseWasCreated } from '../../../domain/event';
import { ExpenseView } from '../schema/expense.schema';

@EventsHandler(ExpenseWasCreated)
export class ExpenseWasCreatedProjection
  implements IEventHandler<ExpenseWasCreated> {
  constructor(
    @Inject('EXPENSE_MODEL') private readonly expenseModel: Model<ExpenseView>,
  ) {}

  async handle(event: ExpenseWasCreated) {
    const expenseView = new this.expenseModel({
      _id: event.id,
      groupId: event.groupId,
      name: event.name,
      money: event.money,
      currencyCode: event.currencyCode,
      date: event.date,
      periodicity: event.periodicity,
      endPeriodicity: event.endPeriodicity,
    });

    return expenseView.save();
  }
}
