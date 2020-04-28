import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import { TransferTransactionWasCreated } from '../../../domain/event/transfer-transaction-was-created';
import { TransferTransactionView } from '../schema/transfer-transaction.schema';

@EventsHandler(TransferTransactionWasCreated)
export class TransferTransactionWasCreatedProjection
  implements IEventHandler<TransferTransactionWasCreated> {
  constructor(
    @Inject('TRANSFER_TRANSACTION_MODEL')
    private readonly transferTransactionModel: Model<TransferTransactionView>,
  ) {}

  async handle(event: TransferTransactionWasCreated) {
    const transferTransactionView = new this.transferTransactionModel({
      _id: event.id,
      idSender: event.idSender,
      idBeneficiary: event.idBeneficiary,
      money: event.money,
      currencyCode: event.currencyCode,
    });

    return transferTransactionView.save();
  }
}
