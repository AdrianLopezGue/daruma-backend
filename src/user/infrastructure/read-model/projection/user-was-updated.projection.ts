import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';

import { UserPaypalWasChanged } from '../../../domain/event/user-paypal-was-changed.event';
import { UserNameWasChanged } from '../../../domain/event/user-name-was-changed.event';
import { UserView } from '../schema/user.schema';

@EventsHandler(UserNameWasChanged, UserPaypalWasChanged)
export class UserWasUpdatedProjection
  implements
    IEventHandler<UserNameWasChanged>,
    IEventHandler<UserPaypalWasChanged> {
  constructor(
    @Inject('USER_MODEL') private readonly userModel: Model<UserView>,
  ) {}

  async handle(event: UserNameWasChanged | UserPaypalWasChanged) {
    if (event instanceof UserNameWasChanged) {
      this.userModel
        .updateOne({ _id: event.id }, { name: event.username })
        .exec();
    } else if (event instanceof UserPaypalWasChanged) {
      this.userModel
        .updateOne({ _id: event.id }, { paypal: event.userpaypal })
        .exec();
    }
  }
}
