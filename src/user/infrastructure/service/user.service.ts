import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Model } from 'mongoose';

import { CreateUserCommand } from '../../application/command';
import { USER_MODEL, UserView } from '../read-model/schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(USER_MODEL) private readonly userModel: Model<UserView>,
  ) {}

  async createUser(id: string, name: string, email: string) {
    return this.commandBus.execute(new CreateUserCommand(id, name, email));
  }
}
