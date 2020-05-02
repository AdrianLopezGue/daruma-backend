import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserId } from '../../../user/domain/model';
import { CreateMemberCommand } from '../command/create-member.command';
import { MEMBERS } from '../../domain/repository/index';
import { Members } from '../../domain/repository/members';
import { MemberId } from '../../domain/model/member-id';
import { GroupId } from '../../../group/domain/model/group-id';
import { MemberName } from '../../domain/model/member-name';
import { Member } from '../../domain/model/member';
import { MemberIdAlreadyRegisteredError } from '../../domain/exception/member-id-already-registered.error';
import { MemberNameAlreadyRegisteredError } from '../../domain/exception/member-name-in-group.error';
import { GROUPS, Groups } from '../../../group/domain/repository/index';
import { GroupIdNotFoundError } from '../../../group/domain/exception/group-id-not-found.error';
import { Group } from '../../../group/domain/model/group';
import {
  CHECK_UNIQUE_MEMBER_NAME,
  CheckUniqueMemberName,
} from '../../domain/services/check-unique-member-name.service';

@CommandHandler(CreateMemberCommand)
export class CreateMemberHandler
  implements ICommandHandler<CreateMemberCommand> {
  constructor(
    @Inject(MEMBERS) private readonly members: Members,
    @Inject(GROUPS) private readonly groups: Groups,
    @Inject(CHECK_UNIQUE_MEMBER_NAME)
    private readonly checkUniqueMemberName: CheckUniqueMemberName,
  ) {}

  async execute(command: CreateMemberCommand) {
    const memberId = MemberId.fromString(command.memberId);
    const groupId = GroupId.fromString(command.groupId);
    const name = MemberName.fromString(command.name);
    const userId = UserId.fromString(command.userId);

    if ((await this.members.find(memberId)) instanceof Member) {
      throw MemberIdAlreadyRegisteredError.withString(command.memberId);
    }

    if ((await this.groups.find(groupId)) === null) {
      throw GroupIdNotFoundError.withString(command.groupId);
    }

    if (
      (await this.checkUniqueMemberName.with(name, groupId)) instanceof MemberId
    ) {
      throw MemberNameAlreadyRegisteredError.withString(command.name);
    }

    const member = Member.add(memberId, groupId, name, userId);

    this.members.save(member);
  }
}
