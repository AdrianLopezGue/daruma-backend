import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';

import { MemberWasRemoved } from '../../../domain/event/member-was-removed.event';
import { MemberView } from '../schema/member.schema';

@EventsHandler(MemberWasRemoved)
export class MemberWasRemovedProjection
  implements IEventHandler<MemberWasRemoved> {
  constructor(
    @Inject('MEMBER_MODEL') private readonly memberModel: Model<MemberView>,
  ) {}

  async handle(event: MemberWasRemoved) {
    const memberView = await this.memberModel.findById(event.id).exec();

    memberView.remove();
  }
}