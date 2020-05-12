import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { MemberId } from '../../domain/model/member-id';
import { MemberIdNotFoundError } from '../../domain/exception/member-id-not-found.error';
import { Member } from '../../domain/model/member';
import { MEMBERS, Members } from '../../domain/repository/index';
import { MemberService } from '../../infrastructure/service/member.service';
import { RemoveMembersCommand } from '../command/remove-members.command';

@CommandHandler(RemoveMembersCommand)
export class RemoveMembersHandler
  implements ICommandHandler<RemoveMembersCommand> {
  constructor(
    @Inject(MEMBERS) private readonly members: Members,
    private readonly memberService: MemberService,
  ) {}

  async execute(command: RemoveMembersCommand) {
    const membersId = await this.memberService.getMembersIdByGroupId(
      command.groupId,
    );
    const arr = Object.keys(membersId).map(function(id) {
      return membersId[id];
    });
    arr.map(async memberId => {
      const newMemberId = MemberId.fromString(memberId);
      const member = await this.members.find(newMemberId);

      if (!(member instanceof Member) || member.isRemoved) {
        throw MemberIdNotFoundError.withString(memberId);
      }

      member.remove();
      this.members.save(member);
    });
  }
}
