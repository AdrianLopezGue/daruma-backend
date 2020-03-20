import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Model } from 'mongoose';

import {
  CreateGroupCommand,
  ChangeGroupNameCommand,
} from '../../application/command';
import { GROUP_MODEL, GroupView } from '../read-model/schema/group.schema';

@Injectable()
export class GroupService {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(GROUP_MODEL) private readonly groupModel: Model<GroupView>,
  ) {}

  async createGroup(
    id: string,
    name: string,
    currencyCode: string,
    idUser: string,
  ) {
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
