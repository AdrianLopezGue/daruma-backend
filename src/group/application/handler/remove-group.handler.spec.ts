import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';
import { RemoveGroupHandler } from './remove-group.handler';
import { GROUPS, Groups } from '../../domain/repository/index';
import { GroupId } from '../../domain/model/group-id';
import { GroupName } from '../../domain/model/group-name';
import { GroupCurrencyCode } from '../../domain/model/group-currency-code';
import { UserId } from '../../../user/domain/model/user-id';
import { Group } from '../../domain/model/group';
import { RemoveGroupCommand } from '../command/remove-group.command';
import { GroupIdNotFoundError } from '../../domain/exception/group-id-not-found.error';


describe('RemoveGroupHandler', () => {
  let command$: RemoveGroupHandler;

  const groups: Partial<Groups> = {};

  const groupId = GroupId.fromString(uuid());
  const name = GroupName.fromString('Group Name');
  const groupCurrencyCode = GroupCurrencyCode.fromString('EUR');
  const ownerId = UserId.fromString(uuid());

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemoveGroupHandler,
        {
          provide: GROUPS,
          useValue: groups,
        },
      ],
    }).compile();

    command$ = module.get<RemoveGroupHandler>(RemoveGroupHandler);
    groups.find = jest.fn().mockResolvedValue(null);
    groups.save = jest.fn();
  });

  it('should remove a group', async () => {
    const group = Group.add(groupId, name, groupCurrencyCode, ownerId);
    groups.find = jest.fn().mockResolvedValue(group);

    await command$.execute(new RemoveGroupCommand(groupId.value));

    expect(groups.save).toHaveBeenCalledTimes(1);
    expect(groups.save).toHaveBeenCalledWith(group);
  });

  it('should throw an error if group does not exists', async () => {
    groups.find = jest.fn().mockResolvedValue(null);

    expect(
      command$.execute(new RemoveGroupCommand(groupId.value)),
    ).rejects.toThrow(GroupIdNotFoundError);

    expect(groups.save).toHaveBeenCalledTimes(0);
  });

  it('should throw an error if group was removed', async () => {
    const group = Group.add(groupId, name, groupCurrencyCode, ownerId);
    group.remove();
    groups.find = jest.fn().mockResolvedValue(group);

    expect(
      command$.execute(new RemoveGroupCommand(groupId.value)),
    ).rejects.toThrow(GroupIdNotFoundError);

    expect(groups.save).toHaveBeenCalledTimes(0);
  });
});