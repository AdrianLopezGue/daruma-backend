import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';


import { Model } from 'mongoose';
import { MEMBER_MODEL, MemberView } from '../read-model/schema/member.schema';
import { CreateMemberCommand } from '../../application/command/create-member.command';

@Injectable()
export class MemberService {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(MEMBER_MODEL) private readonly memberModel: Model<MemberView>,
  ) {}

  async createMember(memberId: string, groupId: string,name: string, email: string, userId: string) {
    return this.commandBus.execute(new CreateMemberCommand(memberId, groupId, name, email, userId));
  }
}