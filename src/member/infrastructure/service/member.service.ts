import { Injectable, Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { CreateMemberCommand } from '../../application/command/create-member.command';
import { RegisterMemberAsUserCommand } from '../../application/command/register-member-as-user.command';
import { MemberView, MEMBER_MODEL } from '../read-model/schema/member.schema';
import { Model } from 'mongoose';
import { RemoveMemberCommand } from '../../application/command/remove-member.command';
import { GroupIdNotFoundError } from '../../../group/domain/exception/group-id-not-found.error';

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

  async removeMember(id: string) {
    return this.commandBus.execute(new RemoveMemberCommand(id));
  }

  async registerMemberAsUser(id: string, idUser: string) {
    return this.commandBus.execute(new RegisterMemberAsUserCommand(id, idUser));
  }

  async getMembersByGroupId(groupId: string): Promise<MemberView[]> {
    const members = await this.memberModel.find({ groupId: '' + groupId + '' }).exec();

    if (members.length === 0){
      throw GroupIdNotFoundError.withString(groupId);
    }

    return members;
  }

  async getMembersIdByUserId(userId: string): Promise<string[]> {
    return this.memberModel.distinct('_id', { userId: userId }).exec();;
  }

  async getMembersIdByGroupId(groupId: string): Promise<string[]> {
    return this.memberModel.distinct('_id', { groupId: groupId }).exec();;
  }

  async getGroups(userId: string): Promise<string[]> {
    return this.memberModel.distinct('groupId', { userId: userId }).exec();
  }
}

export const MEMBER_SERVICE = 'MEMBER_SERVICE';
