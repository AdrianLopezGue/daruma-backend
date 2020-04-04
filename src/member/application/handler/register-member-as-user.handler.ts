import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { MemberIdNotFoundError } from '../../domain/exception/member-id-not-found.error';
import { RegisterMemberAsUserCommand } from '../command/register-member-as-user.command';
import { MEMBERS } from '../../domain/repository/index';
import { Members } from '../../domain/repository/members';
import { MemberId } from '../../domain/model/member-id';
import { Member } from '../../domain/model/member';
import { UserId } from '../../../user/domain/model/user-id';

@CommandHandler(RegisterMemberAsUserCommand)
export class RegisterMemberAsUserHandler
  implements ICommandHandler<RegisterMemberAsUserCommand> {
  constructor(@Inject(MEMBERS) private readonly members: Members) {}

  async execute(command: RegisterMemberAsUserCommand) {
    const memberId = MemberId.fromString(command.memberId);
    const member = await this.members.find(memberId);
    const userId = UserId.fromString(command.userId);

    if (!(member instanceof Member)) {
      throw MemberIdNotFoundError.withString(command.memberId);
    }

    member.setUserId(userId);

    this.members.save(member);
  }
}
