import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Model } from 'mongoose';

import {
  CreateGroupCommand,
  ChangeGroupNameCommand,
} from '../../application/command';
import { GROUP_MODEL, GroupView } from '../read-model/schema/group.schema';
import { v4 as uuid } from 'uuid';

@Injectable()
export class GroupService {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(GROUP_MODEL) private readonly groupModel: Model<GroupView>,
  ) {}

  async createGroup(
    name: string,
    currencyCode: string,
    idUser: string,
  ) {
    const id = uuid();
    return this.commandBus.execute(
      new CreateGroupCommand(id, name, currencyCode, idUser),
    );
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
