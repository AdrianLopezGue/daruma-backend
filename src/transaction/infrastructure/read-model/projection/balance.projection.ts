import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import { TransferTransactionWasCreated } from '../../../domain/event/transfer-transaction-was-created.event';
import { DebtTransactionWasCreated } from '../../../domain/event/debt-transaction-was-created.event';
import { DepositTransactionWasCreated } from '../../../domain/event/deposit-transaction-was-created.event';
import { BalanceView } from '../schema/balance.transaction.schema';
import { MemberWasCreated } from '../../../../member/domain/event/member-was-created.event';
import { DebtTransactionWasRemoved } from '../../../domain/event/debt-transaction-was-removed.event';
import { DepositTransactionWasRemoved } from '../../../domain/event/deposit-transaction-was-removed.event';
import { TransferTransactionWasRemoved } from '../../../domain/event/transfer-transaction-was-removed.event';

@EventsHandler(
  DebtTransactionWasCreated,
  DepositTransactionWasCreated,
  TransferTransactionWasCreated,
  DebtTransactionWasRemoved,
  DepositTransactionWasRemoved,
  TransferTransactionWasRemoved,
  MemberWasCreated,
)
export class BalanceProjection
  implements
    IEventHandler<DebtTransactionWasCreated>,
    IEventHandler<DepositTransactionWasCreated>,
    IEventHandler<TransferTransactionWasCreated>,
    IEventHandler<DebtTransactionWasRemoved>,
    IEventHandler<DepositTransactionWasRemoved>,
    IEventHandler<TransferTransactionWasRemoved>,
    IEventHandler<MemberWasCreated> {
  constructor(
    @Inject('BALANCE_MODEL')
    private readonly balanceModel: Model<BalanceView>,
  ) {}

  async handle(
    event:
      | MemberWasCreated
      | DebtTransactionWasCreated
      | DepositTransactionWasCreated
      | TransferTransactionWasCreated
      | DebtTransactionWasRemoved
      | DepositTransactionWasRemoved
      | TransferTransactionWasRemoved,
  ) {
    if (event instanceof MemberWasCreated) {
      const balanceView = new this.balanceModel({
        _id: event.id,
        idGroup: event.idGroup,
        money: 0,
      });
      return balanceView.save();
    } else if (event instanceof DebtTransactionWasCreated) {
      this.balanceModel
        .updateOne({ _id: event.idMember }, { $inc: { money: -event.money } })
        .exec();
    } else if (event instanceof DepositTransactionWasCreated) {
      this.balanceModel
        .updateOne({ _id: event.idMember }, { $inc: { money: event.money } })
        .exec();
    } else if (event instanceof TransferTransactionWasCreated) {
      this.balanceModel
        .updateOne({ _id: event.idSender }, { $inc: { money: event.money } })
        .exec();
      this.balanceModel
        .updateOne(
          { _id: event.idBeneficiary },
          { $inc: { money: -event.money } },
        )
        .exec();
    } else if (event instanceof DebtTransactionWasRemoved) {
      this.balanceModel
        .updateOne({ _id: event.id }, { $inc: { money: event.money } })
        .exec();
    } else if (event instanceof DepositTransactionWasRemoved) {
      this.balanceModel
        .updateOne({ _id: event.id }, { $inc: { money: -event.money } })
        .exec();
    } else if (event instanceof TransferTransactionWasRemoved) {
      this.balanceModel
        .updateOne({ _id: event.idSender }, { $inc: { money: -event.money } })
        .exec();
      this.balanceModel
        .updateOne(
          { _id: event.idBeneficiary },
          { $inc: { money: event.money } },
        )
        .exec();
    }
  }
}
