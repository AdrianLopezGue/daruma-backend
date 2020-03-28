import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Model } from 'mongoose';

import {
  CreateGroupCommand,
  ChangeGroupNameCommand,
} from '../../application/command';
import { v4 as uuid } from 'uuid';
import { GroupDto } from '../dto/group.dto';

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

  async getGroup(id: string): Promise<GroupDto> {
    return this.groupModel.findById(id).exec();
  }

  async getGroups(): Promise<GroupDto[]> {
    return this.groupModel.find().exec();
  }
}
