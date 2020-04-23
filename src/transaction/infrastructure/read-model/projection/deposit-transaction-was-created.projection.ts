import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import { DebtTransactionWasCreated } from '@app/transaction/domain/event/debt-transaction-was-created';
import { DebtTransactionView } from '../schema/debt-transaction.schema';
import { DepositTransactionWasCreated } from '../../../domain/event/deposit-transaction-was-created';


@EventsHandler(DebtTransactionWasCreated)
export class DepositTransactionWasCreatedProjection
  implements IEventHandler<DepositTransactionWasCreated> {
  constructor(
    @Inject('DEPOSIT_TRANSACTION_MODEL') private readonly depositTransactionModel: Model<DebtTransactionView>,
  ) {}

  async handle(event: DepositTransactionWasCreated) {
    const depositTransactionView = new this.depositTransactionModel({
      _id: event.id,
      idMember: event.idMember,
      idBill: event.idBill,
      money: event.money,
      currencyCode: event.currencyCode,
    });

    return depositTransactionView.save();
  }
}