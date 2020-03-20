import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';

import {
  EmptyUseremailError,
  EmptyUsernameError,
} from '../../domain/exception';
import { User, Useremail, UserId, Username } from '../../domain/model';

/*
import { SCOPES } from '../../domain/repository';

import {
  SCOPE_MODEL,
  ScopeView,
} from '../../infrastructure/read-model/schema/ScopeSchema';
*/

import { RegisterUserCommand } from '../command';
import { USERS, Users } from '../../domain/repository/users';
import {
  CheckUniqueUsername,
  CHECK_UNIQUE_USERNAME,
} from '../../domain/services/check-unique-username';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand> {
  constructor(
    @Inject(USERS) private readonly users: Users,
    @Inject(CHECK_UNIQUE_USERNAME)
    private readonly checkUniqueUsername: CheckUniqueUsername,
  ) {}

  async execute(command: RegisterUserCommand) {
    const userId = UserId.fromString(command.userId);
    const username = Username.fromString(command.username);
    const useremail = Useremail.fromString(command.useremail);

    /*
    const instance = await this.eventStore.find(scopeId);

    
    if (instance instanceof Scope) {
      throw ScopeIdAlreadyRegisteredException.withString(command.scopeId);
    }

    
    const scopeView = await this.scopeModel.findOne({ alias: command.alias });
    if (scopeView !== null) {
      throw ScopeAliasAlreadyRegisteredException.withString(command.alias);
    }

    const scope = this.publisher.mergeObjectContext(
      Scope.add(scopeId, name, alias),
    );

    this.eventStore.save(scope);
    */

    const user = User.add(userId, username, useremail);

    /*
      Firebase database connection goes here
    */
  }
}
