import { Injectable, Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { CreateMemberCommand } from '../../application/command/create-member.command';
import { RegisterMemberAsUserCommand } from '../../application/command/register-member-as-user.command';
import { MemberView, MEMBER_MODEL } from '../read-model/schema/member.schema';
import { Model } from 'mongoose';

@Injectable()
export class MemberService {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(MEMBER_MODEL) private readonly memberModel: Model<MemberView>,
  ) {}

  async createMember(
    memberId: string,
    groupId: string,
    name: string,
    userId?: string,
  ) {
    return this.commandBus.execute(
      new CreateMemberCommand(memberId, groupId, name, userId),
    );
  }

  async registerMemberAsUser(id: string, idUser: string) {
    return this.commandBus.execute(new RegisterMemberAsUserCommand(id, idUser));
  }

  async getMembers(groupId: string): Promise<MemberView[]> {
    return this.memberModel.find({ 'groupId': "" + groupId + "" }).exec();
  }

  async getGroups(userId: string): Promise<string[]> {
    return this.memberModel.distinct('groupId', { userId: userId }).exec();
  }
}
