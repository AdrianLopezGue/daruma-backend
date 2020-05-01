import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveMemberCommand } from '../command/remove-member.command';
import { MEMBERS, Members } from '../../domain/repository/index';
import { MemberId } from '../../domain/model/member-id';
import { Member } from '../../domain/model/member';
import { MemberIdNotFoundError } from '../../domain/exception/member-id-not-found.error';


@CommandHandler(RemoveMemberCommand)
export class RemoveMemberHandler implements ICommandHandler<RemoveMemberCommand> {
  constructor(@Inject(MEMBERS) private readonly members: Members) {}

  async execute(command: RemoveMemberCommand) {
    const memberId = MemberId.fromString(command.memberId);
    const member = await this.members.find(memberId);

    if (!(member instanceof Member) || member.isRemoved) {
      throw MemberIdNotFoundError.withString(command.memberId);
    }

    member.remove();
    this.members.save(member);
  }
}