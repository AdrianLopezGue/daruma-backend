import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ChangeMembersNameCommand } from '../command/change-members-name.command';
import { MemberName } from '../../domain/model/member-name';
import { MemberId } from '../../domain/model/member-id';
import { MemberIdNotFoundError } from '../../domain/exception/member-id-not-found.error';
import { Member } from '../../domain/model/member';
import { MEMBERS, Members } from '../../domain/repository/index';
import { MemberService } from '../../infrastructure/service/member.service';

@CommandHandler(ChangeMembersNameCommand)
export class ChangeMembersNameHandler
  implements ICommandHandler<ChangeMembersNameCommand> {
  constructor(
    @Inject(MEMBERS) private readonly members: Members,
    private readonly memberService: MemberService,
  ) {}

  async execute(command: ChangeMembersNameCommand) {
    const membersId = await this.memberService.getMembersIdByUserId(command.userId);
    const arr = Object.keys(membersId).map(function(id) {
      return membersId[id];
    });
    arr.map(
      async memberId => {
        const newMemberId = MemberId.fromString(memberId);
        const member = await this.members.find(newMemberId);
        const name = MemberName.fromString(command.name);

        if (!(member instanceof Member)) {
          throw MemberIdNotFoundError.withString(memberId);
        }

        member.rename(name);
        this.members.save(member);
      }
    );
  }
}
