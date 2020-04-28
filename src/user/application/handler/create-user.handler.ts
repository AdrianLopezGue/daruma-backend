import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserId } from '../../domain/model';
import { UserName } from '../../domain/model/user-name';
import { UserEmail } from '../../domain/model/user-email';
import { CreateUserCommand } from '../command/create-user.command';
import { USERS, Users } from '../../domain/repository/users';
import { User } from '../../domain/model/user';
import { UserIdAlreadyRegisteredError } from '../../domain/exception/user-id-already-registered.error';
import { UserEmailAlreadyRegisteredError } from '../../domain/exception/user-email-already-registered.error';
import { UserPaypal } from '../../domain/model/user-paypal';
import {
  CHECK_UNIQUE_USER_EMAIL,
  CheckUniqueUserEmail,
} from '../../domain/services/check-unique-user-email.service';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject(USERS) private readonly users: Users,
    @Inject(CHECK_UNIQUE_USER_EMAIL)
    private readonly checkUniqueUserEmail: CheckUniqueUserEmail,
  ) {}

  async execute(command: CreateUserCommand) {
    const userId = UserId.fromString(command.userId);
    const username = UserName.fromString(command.username);
    const useremail = UserEmail.fromString(command.useremail);
    const userpaypal = UserPaypal.fromString(command.userpaypal);

    if ((await this.users.find(userId)) instanceof User) {
      throw UserIdAlreadyRegisteredError.withString(command.userId);
    }

    if (
      (await this.checkUniqueUserEmail.with(useremail)) instanceof UserEmail
    ) {
      throw UserEmailAlreadyRegisteredError.withString(command.useremail);
    }

    const user = User.add(userId, username, useremail, userpaypal);

    this.users.save(user);
  }
}
