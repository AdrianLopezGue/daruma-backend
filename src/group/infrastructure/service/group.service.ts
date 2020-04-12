import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import {
  CreateGroupCommand,
  ChangeGroupNameCommand,
} from '../../application/command';
import { GroupView, GROUP_MODEL } from '../read-model/schema/group.schema';
import { Model } from 'mongoose';
import { MemberService } from '../../../member/infrastructure/service/member.service';

@Injectable()
export class GroupService {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(GROUP_MODEL) private readonly groupModel: Model<GroupView>,
    private readonly memberService: MemberService,
  ) {}

  async createGroup(
    groupId: string,
    name: string,
    currencyCode: string,
    ownerId: string,
  ) {
    return this.commandBus.execute(
      new CreateGroupCommand(groupId, name, currencyCode, ownerId),
    );
  }

  async changeNameGroup(id: string, name: string) {
    return this.commandBus.execute(new ChangeGroupNameCommand(id, name));
  }

  async getGroup(id: string): Promise<GroupView> {
    return this.groupModel.findById(id).exec();
  }

  async getGroups(ownerId: string): Promise<GroupView[]> {
    const idGroups = await this.memberService.getGroups(ownerId);
    return this.groupModel.find({ _id: { $in: [idGroups.toString()] } }).exec();
  }
}
