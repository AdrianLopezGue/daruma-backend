import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';

import {
  GroupNameAlreadyRegisteredError,
  GroupIdAlreadyRegisteredError,
} from '../../domain/exception';
import {
  Group,
  GroupId,
  GroupName,
  GroupCurrencyCode,
} from '../../domain/model';
import { GROUPS, Groups } from '../../domain/repository';

import {
  CHECK_UNIQUE_GROUP_NAME,
  CheckUniqueGroupName,
} from '../../domain/services/check-unique-group-name.service';
import { CreateGroupCommand } from '../command/create-group.command';
import { CreateGroupHandler } from './create-group.handler';
import { UserId } from '../../../user/domain/model/user-id';
import { OwnerDto } from '../../infrastructure/dto/owner.dto';
import { MEMBERS } from '../../../member/domain/repository/index';
import { Members } from '../../../../dist/member/domain/repository/members';

describe('CreateGroupHandler', () => {
  let command$: CreateGroupHandler;

  const groups: Partial<Groups> = {};
  const checkUniqueGroupName: Partial<CheckUniqueGroupName> = {};

  const groupId = GroupId.fromString(uuid());
  const name = GroupName.fromString('Group Name');
  const groupCurrencyCode = GroupCurrencyCode.fromString('EUR');
  const ownerId = UserId.fromString(uuid());
  const owner = new OwnerDto(ownerId.value, 'Owner name');

  const members: Partial<Members> = {};
  const groupMembers = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateGroupHandler,
        {
          provide: GROUPS,
          useValue: groups,
        },
        {
          provide: MEMBERS,
          useValue: members,
        },
        {
          provide: CHECK_UNIQUE_GROUP_NAME,
          useValue: checkUniqueGroupName,
        },
      ],
    }).compile();

    command$ = module.get<CreateGroupHandler>(CreateGroupHandler);
    groups.find = jest.fn().mockResolvedValue(null);
    groups.save = jest.fn();
    members.save = jest.fn();
    checkUniqueGroupName.with = jest.fn().mockResolvedValue(null);
  });

  it('should creates a new group', async () => {
    await command$.execute(
      new CreateGroupCommand(
        groupId.value,
        name.value,
        groupCurrencyCode.value,
        owner,
        groupMembers,
      ),
    );

    expect(groups.save).toHaveBeenCalledWith(
      Group.add(groupId, name, groupCurrencyCode, ownerId),
    );
  });

  it('should not creates an existing group name', async () => {
    checkUniqueGroupName.with = jest.fn().mockResolvedValue(groupId);

    expect(
      command$.execute(
        new CreateGroupCommand(
          groupId.value,
          name.value,
          groupCurrencyCode.value,
          owner,
          groupMembers,
        ),
      ),
    ).rejects.toThrow(GroupNameAlreadyRegisteredError);

    expect(groups.save).toHaveBeenCalledTimes(0);
  });

  it('should not creates an existing group id', async () => {
    groups.find = jest
      .fn()
      .mockResolvedValue(Group.add(groupId, name, groupCurrencyCode, ownerId));

    expect(
      command$.execute(
        new CreateGroupCommand(
          groupId.value,
          name.value,
          groupCurrencyCode.value,
          owner,
          groupMembers,
        ),
      ),
    ).rejects.toThrow(GroupIdAlreadyRegisteredError);

    expect(groups.save).toHaveBeenCalledTimes(0);
  });
});
