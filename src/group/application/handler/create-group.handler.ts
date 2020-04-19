import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 } from 'uuid';

import {
  GroupNameAlreadyRegisteredError,
  GroupIdAlreadyRegisteredError,
} from '../../domain/exception';
import {
  Group,
  GroupName,
  GroupId,
  GroupCurrencyCode,
} from '../../domain/model';
import { GROUPS, Groups } from '../../domain/repository';
import { CreateGroupCommand } from '../command/create-group.command';
import { Member } from '../../../member/domain/model/member';
import { UserId } from '../../../user/domain/model/user-id';
import { MemberId } from '../../../member/domain/model/member-id';
import { MemberName } from '../../../member/domain/model/member-name';
import { CHECK_UNIQUE_GROUP_NAME, CheckUniqueGroupName } from '../../domain/services/check-unique-group-name.service';
import { MEMBERS,  Members } from '../../../member/domain/repository/index';

@CommandHandler(CreateGroupCommand)
export class CreateGroupHandler implements ICommandHandler<CreateGroupCommand> {
  constructor(
    @Inject(GROUPS) private readonly groups: Groups,
    @Inject(MEMBERS) private readonly members: Members,
    @Inject(CHECK_UNIQUE_GROUP_NAME)
    private readonly checkUniqueGroupName: CheckUniqueGroupName,
  ) {}

  async execute(command: CreateGroupCommand) {
    const groupId = GroupId.fromString(command.groupId);
    const name = GroupName.fromString(command.name);
    const currencyCode = GroupCurrencyCode.fromString(command.currencyCode);
    const groupMembers = command.members;
    const ownerId = UserId.fromString(command.owner.id);

    if ((await this.groups.find(groupId)) instanceof Group) {
      throw GroupIdAlreadyRegisteredError.withString(command.groupId);
    }

    if ((await this.checkUniqueGroupName.with(name, ownerId)) instanceof GroupId) {
      throw GroupNameAlreadyRegisteredError.withString(command.name);
    }

    const group = Group.add(groupId, name, currencyCode, ownerId);

    this.groups.save(group);

    const membersAdded: Member[] = [];

    membersAdded.push(group.addMember(
      MemberId.fromString(v4()),
      MemberName.fromString(command.owner.name),
      UserId.fromString(command.owner.id),
    ));

    groupMembers.forEach(member => {
      membersAdded.push(group.addMember(
        MemberId.fromString(member.id),
        MemberName.fromString(member.name)
      ))
    });

    membersAdded.map((member) => this.members.save(member));
  }
}
