import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';

import { GroupNameWasChanged } from '../../../domain/event';
import { GroupView } from '../schema/group.schema';

@EventsHandler(GroupNameWasChanged)
export class GroupNameWasChangedProjection
  implements IEventHandler<GroupNameWasChanged> {
  constructor(
    @Inject('GROUP_MODEL') private readonly groupModel: Model<GroupView>,
  ) {}

  async handle(event: GroupNameWasChanged) {
    this.groupModel.updateOne({ _id: event.id }, { name: event.name }).exec();
  }
}
