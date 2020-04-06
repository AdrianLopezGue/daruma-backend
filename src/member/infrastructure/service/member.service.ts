import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { CreateMemberCommand } from '../../application/command/create-member.command';
import { RegisterMemberAsUserCommand } from '../../application/command/register-member-as-user.command';

@Injectable()
export class MemberService {
  constructor(
    private readonly commandBus: CommandBus,
  ) {}

  async createMember(memberId: string, groupId: string, name: string, userId?: string) {
    return this.commandBus.execute(new CreateMemberCommand(memberId, groupId, name, userId));
  }

  async registerMemberAsUser(id: string, idUser: string) {
    return this.commandBus.execute(new RegisterMemberAsUserCommand(id, idUser));
  }
}