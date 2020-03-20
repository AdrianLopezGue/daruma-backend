import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Model } from 'mongoose';

import {
  RegisterUserCommand,
  UpdateUserCommand,
} from '../../application/command';
import { USER_MODEL, UserView } from '../read-model/schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(USER_MODEL) private readonly userModel: Model<UserView>,
  ) {}

  async registerUser(id: string, name: string, email: string) {
    return this.commandBus.execute(new RegisterUserCommand(id, name, email));
  }

  async updateUser(id: string, name: string, email: string) {
    return this.commandBus.execute(new UpdateUserCommand(id, name, email));
  }

  async getUser(id: string): Promise<UserView> {
    return this.userModel.findById(id).exec();
  }

  async getUsers(): Promise<UserView[]> {
    return this.userModel.find().exec();
  }
}
