import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { GroupIdNotFoundError } from '../../domain/exception/group-id-not-found.error';
import { Group, GroupId, GroupName } from '../../domain/model';
import { GROUPS, Groups } from '../../domain/repository';
import { ChangeGroupNameCommand } from '../command/change-group-name.command';

@CommandHandler(ChangeGroupNameCommand)
export class ChangeGroupNameHandler
  implements ICommandHandler<ChangeGroupNameCommand> {
  constructor(@Inject(GROUPS) private readonly groups: Groups) {}

  async execute(command: ChangeGroupNameCommand) {
    const groupId = GroupId.fromString(command.groupId);
    const group = await this.groups.find(groupId);
    const name = GroupName.fromString(command.name);

    if (!(group instanceof Group)) {
      throw GroupIdNotFoundError.withString(command.groupId);
    }

    group.rename(name);
    this.groups.save(group);
  }
}
