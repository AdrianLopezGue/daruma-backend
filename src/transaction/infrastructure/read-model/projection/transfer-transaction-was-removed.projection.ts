import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import { TransferTransactionWasRemoved } from '../../../domain/event/transfer-transaction-was-removed.event';
import { TransferTransactionView } from '../schema/transfer-transaction.schema';


@EventsHandler(TransferTransactionWasRemoved)
export class TransferTransactionWasRemovedProjection
  implements IEventHandler<TransferTransactionWasRemoved> {
  constructor(
    @Inject('TRANSFER_TRANSACTION_MODEL') private readonly transferTransactionModel: Model<TransferTransactionView>,
  ) {}

  async handle(event: TransferTransactionWasRemoved) {
    const transferTransactionView = await this.transferTransactionModel.findById(event.id).exec();

    transferTransactionView.remove();
  }
}