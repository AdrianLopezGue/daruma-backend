import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveGroupCommand } from '../command/remove-group.command';
import { GROUPS, Groups } from '../../domain/repository/index';
import { GroupId } from '../../domain/model/group-id';
import { Group } from '../../domain/model/group';
import { GroupIdNotFoundError } from '../../domain/exception/group-id-not-found.error';

@CommandHandler(RemoveGroupCommand)
export class RemoveGroupHandler implements ICommandHandler<RemoveGroupCommand> {
  constructor(@Inject(GROUPS) private readonly groups: Groups) {}

  async execute(command: RemoveGroupCommand) {
    const groupId = GroupId.fromString(command.groupId);
    const group = await this.groups.find(groupId);

    if (!(group instanceof Group) || group.isRemoved) {
      throw GroupIdNotFoundError.withString(command.groupId);
    }

    group.remove();
    this.groups.save(group);
  }
}
