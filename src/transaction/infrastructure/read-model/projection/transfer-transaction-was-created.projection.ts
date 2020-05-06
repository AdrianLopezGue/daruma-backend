import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import { TransferTransactionWasCreated } from '../../../domain/event/transfer-transaction-was-created.event';
import { TransferTransactionView } from '../schema/transfer-transaction.schema';
import { BalanceView } from '../schema/balance.transaction.schema';

@EventsHandler(TransferTransactionWasCreated)
export class TransferTransactionWasCreatedProjection
  implements IEventHandler<TransferTransactionWasCreated> {
  constructor(
    @Inject('TRANSFER_TRANSACTION_MODEL')
    private readonly transferTransactionModel: Model<TransferTransactionView>,
    @Inject('BALANCE_MODEL')
    private readonly balanceModel: Model<BalanceView>,
  ) {}

  async handle(event: TransferTransactionWasCreated) {
    const transferTransactionView = new this.transferTransactionModel({
      _id: event.id,
      idSender: event.idSender,
      idBeneficiary: event.idBeneficiary,
      money: event.money,
      currencyCode: event.currencyCode,
      idGroup: event.idGroup,
    });

    this.balanceModel
      .updateOne({ _id: event.idSender }, { $inc: { money: event.money } })
      .exec();
    this.balanceModel
      .updateOne(
        { _id: event.idBeneficiary },
        { $inc: { money: -event.money } },
      )
      .exec();

    return transferTransactionView.save();
  }
}
