import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserId } from '../../../user/domain/model';
import { CreateMemberCommand } from '../command/create-member.command';
import { MEMBERS } from '../../domain/repository/index';
import { Members } from '../../domain/repository/members';
import { MemberId } from '../../domain/model/member-id';
import { GroupId } from '../../../group/domain/model/group-id';
import { MemberName } from '../../domain/model/member-name';
import { MemberEmail } from '../../domain/model/member-email';
import { Member } from '../../domain/model/member';

@CommandHandler(CreateMemberCommand)
export class CreateMemberHandler implements ICommandHandler<CreateMemberCommand> {
  constructor(
    @Inject(MEMBERS) private readonly members: Members,
  ) {}

  async execute(command: CreateMemberCommand) {
    const memberId = MemberId.fromString(command.memberId);
    const groupId = GroupId.fromString(command.groupId);
    const name = MemberName.fromString(command.name);
    const email = MemberEmail.fromString(command.email);
    const userId = UserId.fromString(command.userId);

    const member = Member.add(memberId, groupId, name, email, userId);

    this.members.save(member);
  }
}
