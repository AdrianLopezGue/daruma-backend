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

  async getMembersByGroupId(groupId: string): Promise<MemberView[]> {
    return this.memberModel.find({ groupId: '' + groupId + '' }).exec();
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

  async updateMember(newUserId: string, newName: string){
    this.memberModel.updateMany({userId: newUserId}, { $set: { name: newName} }).exec();
  }

  async checkIfMemberIsInGroup(
    groupId: string,
    userId: string,
  ): Promise<boolean> {
    const member = await this.memberModel.findOne({
      $and: [{ groupId: '' + groupId + '' }, { userId: '' + userId + '' }],
    });

    let result = true;
    if (member != null) {
      result = true;
    } else {
      result = false;
    }

    return result;
  }
}

export const MEMBER_SERVICE = 'MEMBER_SERVICE';
