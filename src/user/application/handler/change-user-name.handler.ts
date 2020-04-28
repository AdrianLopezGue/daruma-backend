import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Users } from '../../domain/repository';
import { ChangeUserNameCommand } from '../command/change-user-name.command';
import { User, UserName } from '../../domain/model';
import { UserIdNotFoundError } from '../../domain/exception/user-id-not-found.error';
import { USERS } from '../../domain/repository/users';
import { UserId } from '../../domain/model/user-id';

@CommandHandler(ChangeUserNameCommand)
export class ChangeUserNameHandler
  implements ICommandHandler<ChangeUserNameCommand> {
  constructor(@Inject(USERS) private readonly users: Users) {}

  async execute(command: ChangeUserNameCommand) {
    const userId = UserId.fromString(command.userId);
    const user = await this.users.find(userId);
    const name = UserName.fromString(command.username);

    if (!(user instanceof User)) {
      throw UserIdNotFoundError.withUserId(userId);
    }

    user.rename(name);

    await this.users.save(user);
  }
}
