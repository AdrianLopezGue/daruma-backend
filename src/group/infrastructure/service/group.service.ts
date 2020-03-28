import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import {
  CreateGroupCommand,
  ChangeGroupNameCommand,
} from '../../application/command';
import { v4 as uuid } from 'uuid';
import { GroupDto } from '../dto/group.dto';
import { GROUPS } from '../../domain/repository/index';
import { GroupDatabase } from '../database';
import { GroupId } from '@app/group/domain/model/group-id';
import { GroupView } from '../schema/group.view';

@Injectable()
export class GroupService {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(GROUPS) private readonly firebaseDatabase: GroupDatabase,
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
    return this.firebaseDatabase.get(GroupId.fromString(id));
  }

  async getGroupsById(id: string): Promise<GroupView[]> {
    return this.firebaseDatabase.getGroupsById(GroupId.fromString(id));
  }
}
