import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';

import { GroupWasRemoved } from '../../../domain/event/group-was-removed.event';
import { GroupView } from '../schema/group.schema';

@EventsHandler(GroupWasRemoved)
export class GroupWasRemovedProjection
  implements IEventHandler<GroupWasRemoved> {
  constructor(
    @Inject('GROUP_MODEL') private readonly groupModel: Model<GroupView>,
  ) {}

  async handle(event: GroupWasRemoved) {
    const groupView = await this.groupModel.findById(event.id).exec();

    groupView.remove();
  }
}
