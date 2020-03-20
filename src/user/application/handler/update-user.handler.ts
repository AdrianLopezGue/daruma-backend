import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserIdNotFoundError } from '../../domain/exception';
import { UserName, UserEmail, UserId } from '../../domain/model';
import { USERS, Users } from '../../domain/repository';
import { UpdateUserCommand } from '../command/update-user.command';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(@Inject(USERS) private readonly users: Users) {}

  async execute(command: UpdateUserCommand) {
    const userId = UserId.fromString(command.id);

    const user = await this.users.find(userId);
    if (user === null) {
      throw UserIdNotFoundError.withUserId(userId);
    }

    user.changeUsername(UserName.fromString(command.username));
    user.changeUseremail(UserEmail.fromString(command.useremail));

    this.users.save(user);
  }
}
