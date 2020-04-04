import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserId } from '../../../user/domain/model';
import { UserName } from '../../domain/model/user-name';
import { UserEmail } from '../../domain/model/user-email';
import { CreateUserCommand } from '../command/create-user.command';
import { USERS, Users } from '../../domain/repository/users';
import { User } from '../../domain/model/user';


@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject(USERS) private readonly users: Users,
  ) {}

  async execute(command: CreateUserCommand) {
    const userId = UserId.fromString(command.userId);
    const username = UserName.fromString(command.username);
    const useremail = UserEmail.fromString(command.useremail);

    const user = User.add(userId, username, useremail);

    this.users.save(user);
  }
}
