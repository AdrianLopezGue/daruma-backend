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
import { RemoveGroupCommand } from '../../application/command/remove-group.command';
import { BalanceService } from '../../../transaction/infrastructure/service/balance.service';
import { ChangeGroupCurrencyCodeCommand } from '../../application/command/change-group-currency-code.command';

@Injectable()
export class GroupService {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(GROUP_MODEL) private readonly groupModel: Model<GroupView>,
    private readonly memberService: MemberService,
    private readonly balanceService: BalanceService,
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

  async updateGroup(id: string, name: string, currencyCode: string) {
    await this.commandBus.execute(new ChangeGroupNameCommand(id, name));
    await this.commandBus.execute(new ChangeGroupCurrencyCodeCommand(id, currencyCode));
  }

  async removeGroup(id: string) {
    this.commandBus.execute(new RemoveGroupCommand(id));
    this.balanceService.deleteBalances(id);
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
