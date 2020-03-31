import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import {
  CreateGroupCommand,
  ChangeGroupNameCommand,
} from '../../application/command';
import { GroupView, GROUP_MODEL } from '../read-model/schema/group.schema';
import { Model } from 'mongoose';
import uuid = require('uuid');

@Injectable()
export class GroupService {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(GROUP_MODEL) private readonly groupModel: Model<GroupView>,
  ) {}

  async createGroup(id: string, currencyCode: string, name: string) {
    const idOwner = uuid.v4();
    return this.commandBus.execute(new CreateGroupCommand(id, currencyCode, name, idOwner));
  }

  async changeNameGroup(id: string, name: string) {
    return this.commandBus.execute(new ChangeGroupNameCommand(id, name));
  }

  async getGroup(id: string): Promise<GroupView> {
    return this.groupModel.findById(id).exec();
  }

  async getGroups(): Promise<GroupView[]> {
    return this.groupModel.find().exec();
  }
}
