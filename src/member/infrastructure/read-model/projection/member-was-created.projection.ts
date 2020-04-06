import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';

import { MemberWasCreated } from '../../../domain/event/member-was-created.event';
import { MemberView } from '../schema/member.schema';

@EventsHandler(MemberWasCreated)
export class MemberWasCreatedProjection
  implements IEventHandler<MemberWasCreated> {
  constructor(
    @Inject('MEMBER_MODEL') private readonly memberModel: Model<MemberView>,
  ) {}

  async handle(event: MemberWasCreated) {
    const memberView = new this.memberModel({
      _id: event.id,
      groupId: event.idGroup,
      name: event.membername,
      userId: event.idUser,
    });


    return memberView.save();
  }
}
