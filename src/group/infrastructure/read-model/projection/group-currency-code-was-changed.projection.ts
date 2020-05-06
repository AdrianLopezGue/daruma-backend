import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';

import { GroupView } from '../schema/group.schema';
import { GroupCurrencyCodeWasChanged } from '../../../domain/event/group-currency-code-was-changed.event';

@EventsHandler(GroupCurrencyCodeWasChanged)
export class GroupCurrencyCodeWasChangedProjection
  implements IEventHandler<GroupCurrencyCodeWasChanged> {
  constructor(
    @Inject('GROUP_MODEL') private readonly groupModel: Model<GroupView>,
  ) {}

  async handle(event: GroupCurrencyCodeWasChanged) {
    this.groupModel.updateOne({ _id: event.id }, { currencyCode: event.currencyCode }).exec();
  }
}