import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';

import { GroupIdNotFoundError } from '../../domain/exception';
import {
  Group,
  GroupName,
  GroupId,
  GroupCurrencyCode,
} from '../../domain/model';
import { GROUPS, Groups } from '../../domain/repository';

import { ChangeGroupNameCommand } from '../command/change-group-name.command';
import { ChangeGroupNameHandler } from './change-group-name.handler';
import { UserId } from '../../../user/domain/model/';

describe('ChangeGroupNameHandler', () => {
  let command$: ChangeGroupNameHandler;

  const groups: Partial<Groups> = {};

  const groupId = GroupId.fromString(uuid());
  const name = GroupName.fromString('Group Name');
  const currencyCode = GroupCurrencyCode.fromString('EUR');
  const ownerId = UserId.fromString(uuid());

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChangeGroupNameHandler,
        {
          provide: GROUPS,
          useValue: groups,
        },
      ],
    }).compile();

    command$ = module.get<ChangeGroupNameHandler>(ChangeGroupNameHandler);
    groups.find = jest.fn().mockResolvedValue(null);
    groups.save = jest.fn();
  });

  it('should change group name', async () => {
    const group = Group.add(groupId, name, currencyCode, ownerId);
    const newName = GroupName.fromString('New name');

    groups.find = jest.fn().mockResolvedValue(group);
    group.rename(newName);

    await command$.execute(
      new ChangeGroupNameCommand(groupId.value, newName.value),
    );

    expect(groups.save).toHaveBeenCalledTimes(1);
    expect(groups.save).toHaveBeenCalledWith(group);
  });

  it('should throw an error if group does not exists', async () => {
    expect(
      command$.execute(new ChangeGroupNameCommand(groupId.value, 'New name')),
    ).rejects.toThrow(GroupIdNotFoundError);

    expect(groups.save).toHaveBeenCalledTimes(0);
  });
});
