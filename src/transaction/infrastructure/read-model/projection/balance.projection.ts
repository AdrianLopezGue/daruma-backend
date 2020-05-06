import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import { BalanceView } from '../schema/balance.transaction.schema';
import { MemberWasCreated } from '../../../../member/domain/event/member-was-created.event';
import { MemberWasRemoved } from '../../../../member/domain/event/member-was-removed.event';

@EventsHandler(MemberWasCreated, MemberWasRemoved)
export class BalanceProjection
  implements IEventHandler<MemberWasCreated>, IEventHandler<MemberWasRemoved> {
  constructor(
    @Inject('BALANCE_MODEL')
    private readonly balanceModel: Model<BalanceView>,
  ) {}

  async handle(event: MemberWasCreated | MemberWasRemoved) {
    if (event instanceof MemberWasCreated) {
      const balanceView = new this.balanceModel({
        _id: event.id,
        idGroup: event.idGroup,
        money: 0,
      });
      return balanceView.save();
    } else if (event instanceof MemberWasRemoved) {
      const balanceView = await this.balanceModel.findById(event.id).exec();
      balanceView.remove();
    }
  }
}
