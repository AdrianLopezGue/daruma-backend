import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';

import { MemberWasRegisteredAsUser } from '../../../domain/event/member-was-registered-as-user.event';
import { MemberView } from '../schema/member.schema';

@EventsHandler(MemberWasRegisteredAsUser)
export class RegisterMemberAsUserProjection
  implements IEventHandler<MemberWasRegisteredAsUser> {
  constructor(
    @Inject('GROUP_MODEL') private readonly memberModel: Model<MemberView>,
  ) {}

  async handle(event: MemberWasRegisteredAsUser) {
    this.memberModel.updateOne({ _id: event.id }, { userId: event.idUser }).exec();
  }
}