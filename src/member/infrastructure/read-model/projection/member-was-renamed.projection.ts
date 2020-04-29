import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';

import { MemberNameWasChanged } from '../../../domain/event/member-name-was-changed.event';
import { MemberView } from '../schema/member.schema';

@EventsHandler(MemberNameWasChanged)
export class MemberWasRenamedProjection
  implements IEventHandler<MemberNameWasChanged> {
  constructor(
    @Inject('MEMBER_MODEL') private readonly memberModel: Model<MemberView>,
  ) {}

  async handle(event: MemberNameWasChanged) {
    this.memberModel.updateOne({ _id: event.id }, { name: event.name }).exec();
  }
}