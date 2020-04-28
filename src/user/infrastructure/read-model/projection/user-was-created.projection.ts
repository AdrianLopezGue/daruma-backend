import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import { UserWasCreated } from '../../../domain/event/user-was-created.event';
import { UserView } from '../schema/user.schema';

@EventsHandler(UserWasCreated)
export class UserWasCreatedProjection implements IEventHandler<UserWasCreated> {
  constructor(
    @Inject('USER_MODEL') private readonly userModel: Model<UserView>,
  ) {}

  async handle(event: UserWasCreated) {
    const userView = new this.userModel({
      _id: event.id,
      name: event.username,
      email: event.useremail,
      paypal: event.userpaypal,
    });

    return userView.save();
  }
}
