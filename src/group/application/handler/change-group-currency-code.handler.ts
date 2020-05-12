import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { GroupIdNotFoundError } from '../../domain/exception/group-id-not-found.error';
import { Group, GroupId } from '../../domain/model';
import { GROUPS, Groups } from '../../domain/repository';
import { ChangeGroupCurrencyCodeCommand } from '../command/change-group-currency-code.command';
import { GroupCurrencyCode } from '../../domain/model/group-currency-code';

@CommandHandler(ChangeGroupCurrencyCodeCommand)
export class ChangeGroupCurrencyCodeHandler
  implements ICommandHandler<ChangeGroupCurrencyCodeCommand> {
  constructor(@Inject(GROUPS) private readonly groups: Groups) {}

  async execute(command: ChangeGroupCurrencyCodeCommand) {
    const groupId = GroupId.fromString(command.groupId);
    const group = await this.groups.find(groupId);
    const currencyCode = GroupCurrencyCode.fromString(command.currencyCode);

    if (!(group instanceof Group)) {
      throw GroupIdNotFoundError.withString(command.groupId);
    }

    group.changeCurrencyCode(currencyCode);
    this.groups.save(group);
  }
}
