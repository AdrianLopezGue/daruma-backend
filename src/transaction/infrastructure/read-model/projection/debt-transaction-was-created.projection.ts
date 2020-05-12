import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import { DebtTransactionWasCreated } from '@app/transaction/domain/event/debt-transaction-was-created.event';
import { DebtTransactionView } from '../schema/debt-transaction.schema';
import { BalanceView } from '../schema/balance.transaction.schema';

@EventsHandler(DebtTransactionWasCreated)
export class DebtTransactionWasCreatedProjection
  implements IEventHandler<DebtTransactionWasCreated> {
  constructor(
    @Inject('DEBT_TRANSACTION_MODEL')
    private readonly debtTransactionModel: Model<DebtTransactionView>,
    @Inject('BALANCE_MODEL')
    private readonly balanceModel: Model<BalanceView>,
  ) {}

  async handle(event: DebtTransactionWasCreated) {
    const debtTransactionView = new this.debtTransactionModel({
      _id: event.id,
      idMember: event.idMember,
      idBill: event.idBill,
      money: event.money,
      currencyCode: event.currencyCode,
    });

    this.balanceModel
      .updateOne({ _id: event.idMember }, { $inc: { money: -event.money } })
      .exec();

    return debtTransactionView.save();
  }
}
