import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import { DebtTransactionWasRemoved } from '../../../domain/event/debt-transaction-was-removed.event';
import { DebtTransactionView } from '../schema/debt-transaction.schema';
import { BalanceView } from '../schema/balance.transaction.schema';

@EventsHandler(DebtTransactionWasRemoved)
export class DebtTransactionWasRemovedProjection
  implements IEventHandler<DebtTransactionWasRemoved> {
  constructor(
    @Inject('DEBT_TRANSACTION_MODEL')
    private readonly debtTransactionModel: Model<DebtTransactionView>,
    @Inject('BALANCE_MODEL')
    private readonly balanceModel: Model<BalanceView>,
  ) {}

  async handle(event: DebtTransactionWasRemoved) {
    const debtTransactionView = await this.debtTransactionModel
      .findById(event.id)
      .exec();

    this.balanceModel
      .updateOne({ _id: event.idMember }, { $inc: { money: event.money } })
      .exec();

    debtTransactionView.remove();
  }
}
