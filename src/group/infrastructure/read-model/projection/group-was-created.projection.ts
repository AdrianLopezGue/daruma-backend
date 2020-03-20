import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';

import { GroupWasCreated } from '../../../domain/event';
import { GroupView } from '../schema/group.schema';

@EventsHandler(GroupWasCreated)
export class GroupWasCreatedProjection
  implements IEventHandler<GroupWasCreated> {
  constructor(
    @Inject('GROUP_MODEL') private readonly groupModel: Model<GroupView>,
  ) {}

  async handle(event: GroupWasCreated) {
    const groupView = new this.groupModel({
      _id: event.id,
      name: event.groupname,
      currencycode: event.groupcurrencycode,
      idOwner: event.userid,
    });

    return groupView.save();
  }
}
