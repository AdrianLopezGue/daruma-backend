import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Users } from '../../domain/repository';
import { User } from '../../domain/model';
import { UserIdNotFoundError } from '../../domain/exception/user-id-not-found.error';
import { USERS } from '../../domain/repository/users';
import { UserId } from '../../domain/model/user-id';
import { ChangeUserPaypalCommand } from '../command/change-user-paypal.command';
import { UserPaypal } from '../../domain/model/user-paypal';

@CommandHandler(ChangeUserPaypalCommand)
export class ChangeUserPaypalHandler
  implements ICommandHandler<ChangeUserPaypalCommand> {
  constructor(@Inject(USERS) private readonly users: Users) {}

  async execute(command: ChangeUserPaypalCommand) {
    const userId = UserId.fromString(command.userId);
    const user = await this.users.find(userId);
    const paypal = UserPaypal.fromString(command.userpaypal);

    if (!(user instanceof User)) {
      throw UserIdNotFoundError.withUserId(userId);
    }

    user.changePaypal(paypal);

    await this.users.save(user);

    const user2 = await this.users.find(userId);

    console.debug(user2);


  }
}