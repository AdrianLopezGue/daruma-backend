import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import { DepositTransactionWasRemoved } from '../../../domain/event/deposit-transaction-was-removed.event';
import { DepositTransactionView } from '../schema/deposit-transaction.schema';


@EventsHandler(DepositTransactionWasRemoved)
export class DepositTransactionWasRemovedProjection
  implements IEventHandler<DepositTransactionWasRemoved> {
  constructor(
    @Inject('DEPOSIT_TRANSACTION_MODEL') private readonly depositTransactionModel: Model<DepositTransactionView>,
  ) {}

  async handle(event: DepositTransactionWasRemoved) {
    const depositTransactionView = await this.depositTransactionModel.findById(event.id).exec();

    depositTransactionView.remove();
  }
}