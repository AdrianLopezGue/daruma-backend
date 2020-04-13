import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';

import { ReceiptWasCreated } from '../../../domain/event';
import { ReceiptView } from '../schema/receipt.schema';

@EventsHandler(ReceiptWasCreated)
export class ReceiptWasCreatedProjection
  implements IEventHandler<ReceiptWasCreated> {
  constructor(
    @Inject('RECEIPT_MODEL') private readonly receiptModel: Model<ReceiptView>,
  ) {}

  async handle(event: ReceiptWasCreated) {
    const receiptView = new this.receiptModel({
      _id: event.id,
      groupId: event.expenseId,
      date: event.date,
      payers: event.payers,
      debtors: event.debtors,
      money: event.money,
      currencyCode: event.currencyCode,
    });

    return receiptView.save();
  }
}