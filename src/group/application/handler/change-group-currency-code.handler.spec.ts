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

import { UserId } from '../../../user/domain/model/';
import { ChangeGroupCurrencyCodeHandler } from './change-group-currency-code.handler';
import { ChangeGroupCurrencyCodeCommand } from '../command/change-group-currency-code.command';

describe('ChangeGroupCurrencyCodeHandler', () => {
  let command$: ChangeGroupCurrencyCodeHandler;

  const groups: Partial<Groups> = {};

  const groupId = GroupId.fromString(uuid());
  const name = GroupName.fromString('Group Name');
  const currencyCode = GroupCurrencyCode.fromString('EUR');
  const ownerId = UserId.fromString(uuid());

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChangeGroupCurrencyCodeHandler,
        {
          provide: GROUPS,
          useValue: groups,
        },
      ],
    }).compile();

    command$ = module.get<ChangeGroupCurrencyCodeHandler>(
      ChangeGroupCurrencyCodeHandler,
    );
    groups.find = jest.fn().mockResolvedValue(null);
    groups.save = jest.fn();
  });

  it('should change group currency code', async () => {
    const group = Group.add(groupId, name, currencyCode, ownerId);
    const newCurrencyCode = GroupCurrencyCode.fromString('USD');

    groups.find = jest.fn().mockResolvedValue(group);
    group.changeCurrencyCode(newCurrencyCode);

    await command$.execute(
      new ChangeGroupCurrencyCodeCommand(groupId.value, newCurrencyCode.value),
    );

    expect(groups.save).toHaveBeenCalledTimes(1);
    expect(groups.save).toHaveBeenCalledWith(group);
  });

  it('should throw an error if group does not exists', async () => {
    expect(
      command$.execute(
        new ChangeGroupCurrencyCodeCommand(groupId.value, 'USD'),
      ),
    ).rejects.toThrow(GroupIdNotFoundError);

    expect(groups.save).toHaveBeenCalledTimes(0);
  });
});
