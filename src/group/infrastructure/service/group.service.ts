import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import {
  CreateGroupCommand,
  ChangeGroupNameCommand,
} from '../../application/command';
import { GroupView, GROUP_MODEL } from '../read-model/schema/group.schema';
import { Model } from 'mongoose';
import { MemberService } from '../../../member/infrastructure/service/member.service';
import { MemberDto } from '../dto/group.dto';
import { OwnerDto } from '../dto/owner.dto';

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
    owner: OwnerDto,
    members: MemberDto[],
  ) {
    return this.commandBus.execute(
      new CreateGroupCommand(groupId, name, currencyCode, owner, members),
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
    const arr = Object.keys(idGroups).map(function(id) {
      return idGroups[id];
    });
    return this.groupModel.find({ _id: { $in: arr } }).exec();
  }
}
