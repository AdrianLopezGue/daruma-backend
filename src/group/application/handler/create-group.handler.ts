import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

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
import {
  CHECK_UNIQUE_GROUP_NAME,
  CheckUniqueGroupName,
} from '../../domain/services/check-unique-group-name.service';
import { CreateGroupCommand } from '../command/create-group.command';
import { UserId } from '../../../user/domain/model';

@CommandHandler(CreateGroupCommand)
export class CreateGroupHandler implements ICommandHandler<CreateGroupCommand> {
  constructor(
    @Inject(GROUPS) private readonly groups: Groups,
    @Inject(CHECK_UNIQUE_GROUP_NAME)
    private readonly checkUniqueGroupName: CheckUniqueGroupName,
  ) {}

  async execute(command: CreateGroupCommand) {
    const groupId = GroupId.fromString(command.groupId);
    const name = GroupName.fromString(command.name);
    const currencyCode = GroupCurrencyCode.fromString(command.currencyCode);
    const ownerId = UserId.fromString(command.ownerId);

    if ((await this.groups.find(groupId)) instanceof Group) {
      throw GroupIdAlreadyRegisteredError.withString(command.groupId);
    }

    if ((await this.checkUniqueGroupName.with(name)) instanceof GroupId) {
      throw GroupNameAlreadyRegisteredError.withString(command.name);
    }

    const group = Group.add(groupId, name, currencyCode, ownerId);

    this.groups.save(group);
  }
}
