import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import { TransferTransactionWasRemoved } from '../../../domain/event/transfer-transaction-was-removed.event';
import { TransferTransactionView } from '../schema/transfer-transaction.schema';
import { BalanceView } from '../schema/balance.transaction.schema';

@EventsHandler(TransferTransactionWasRemoved)
export class TransferTransactionWasRemovedProjection
  implements IEventHandler<TransferTransactionWasRemoved> {
  constructor(
    @Inject('TRANSFER_TRANSACTION_MODEL')
    private readonly transferTransactionModel: Model<TransferTransactionView>,
    @Inject('BALANCE_MODEL')
    private readonly balanceModel: Model<BalanceView>,
  ) {}

  async handle(event: TransferTransactionWasRemoved) {
    const transferTransactionView = await this.transferTransactionModel
      .findById(event.id)
      .exec();

    this.balanceModel
      .updateOne({ _id: event.idSender }, { $inc: { money: -event.money } })
      .exec();
    this.balanceModel
      .updateOne({ _id: event.idBeneficiary }, { $inc: { money: event.money } })
      .exec();

    transferTransactionView.remove();
  }
}
