import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Model } from 'mongoose';

import {
  CreateUserCommand,
  ChangeUserNameCommand,
} from '../../application/command';
import { USER_MODEL, UserView } from '../read-model/schema/user.schema';
import { UserIdNotFoundError } from '../../domain/exception/user-id-not-found.error';
import { ChangeUserPaypalCommand } from '../../application/command/change-user-paypal.command';

@Injectable()
export class UserService {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(USER_MODEL) private readonly userModel: Model<UserView>,
  ) {}

  async createUser(id: string, name: string, email: string, paypal?: string) {
    return this.commandBus.execute(
      new CreateUserCommand(id, name, email, paypal),
    );
  }

  async updateUser(id: string, name: string, paypal: string) {
    await this.commandBus.execute(new ChangeUserNameCommand(id, name));
    if (paypal !== '') {
      await this.commandBus.execute(new ChangeUserPaypalCommand(id, paypal));
    }
  }

  async getUser(id: string): Promise<UserView> {
    const result = await this.userModel.findById(id).exec();

    if (result == null) {
      throw new UserIdNotFoundError(id);
    }

    return result;
  }
}
