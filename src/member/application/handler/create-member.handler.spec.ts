import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';

import { UserId } from '../../../user/domain/model/user-id';
import { CreateMemberHandler } from './create-member.handler';
import { Members } from '../../domain/repository/members';
import { MEMBERS } from '../../domain/repository/index';
import { MemberId } from '../../domain/model/member-id';
import { MemberName } from '../../domain/model/member-name';
import { CreateMemberCommand } from '../command/create-member.command';
import { GroupId } from '../../../group/domain/model/group-id';
import { Member } from '../../domain/model/member';
import { CHECK_UNIQUE_MEMBER_NAME, CheckUniqueMemberName } from '../../domain/services/check-unique-member-name.service';
import { MemberNameAlreadyRegisteredError } from '../../domain/exception/member-name-in-group.error';
import { MemberIdAlreadyRegisteredError } from '../../domain/exception/member-id-already-registered.error';
import { GROUPS, Groups } from '../../../group/domain/repository/index';
import { CreateGroupCommand } from '../../../group/application/command/create-group.command';
import { CreateGroupHandler } from '../../../group/application/handler/create-group.handler';
import { CHECK_UNIQUE_GROUP_NAME, CheckUniqueGroupName } from '../../../group/domain/services/check-unique-group-name.service';
import { OwnerDto } from '../../../group/infrastructure/dto/owner.dto';
import { Group } from '../../../group/domain/model/group';
import { GroupName } from '../../../group/domain/model/group-name';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';

describe('CreateMemberHandler', () => {
  let command$: CreateMemberHandler;
  let command2$: CreateGroupHandler;

  const members: Partial<Members> = {};
  const groups: Partial<Groups> = {};
  const checkUniqueMemberName: Partial<CheckUniqueMemberName> = {};
  const checkUniqueGroupName: Partial<CheckUniqueGroupName> = {};

  const memberId = MemberId.fromString(uuid());
  const groupId = GroupId.fromString(uuid());
  const name = MemberName.fromString('Member Name');
  const userId = UserId.fromString('1111');
  const ownerId = UserId.fromString(uuid());
  const owner = new OwnerDto(ownerId.value, 'Owner name');
  const groupName = GroupName.fromString('Group Name');
  const groupCurrencyCode = GroupCurrencyCode.fromString('EUR');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateMemberHandler,
        {
          provide: MEMBERS,
          useValue: members,
        },
        {
          provide: GROUPS,
          useValue: groups,
        },
        {
          provide: CHECK_UNIQUE_MEMBER_NAME,
          useValue: checkUniqueMemberName,
        },
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

    command$ = module.get<CreateMemberHandler>(CreateMemberHandler);
    command2$ = module.get<CreateGroupHandler>(CreateGroupHandler);
    members.find = jest.fn().mockResolvedValue(null);
    members.save = jest.fn();
    groups.find = jest.fn().mockResolvedValue(null);
    groups.save = jest.fn();
    checkUniqueMemberName.with = jest.fn().mockResolvedValue(null);
    checkUniqueGroupName.with = jest.fn().mockResolvedValue(null);
  });

  it('should creates a new member', async () => {

    await command2$.execute(
      new CreateGroupCommand(
        groupId.value,
        groupName.value,
        groupCurrencyCode.value,
        owner,
        [],
      ),
    );

    expect(groups.save).toHaveBeenCalledWith(
      Group.add(groupId, groupName, groupCurrencyCode, ownerId),
    );

    await command$.execute(
      new CreateMemberCommand(
        memberId.value,
        groupId.value,
        name.value,
        userId.value,
      ),
    );

    expect(members.save).toHaveBeenCalledWith(
      Member.add(memberId, groupId, name, userId),
    );
  });

  it('should not creates an existing member name', async () => {
    checkUniqueMemberName.with = jest.fn().mockResolvedValue(memberId);

    expect(
      command$.execute(
        new CreateMemberCommand(
          memberId.value,
          groupId.value,
          name.value,
          userId.value,
        ),
      ),
    ).rejects.toThrow(MemberNameAlreadyRegisteredError);

    expect(members.save).toHaveBeenCalledTimes(0);
  });

  it('should not creates an existing member id', async () => {
    members.find = jest
      .fn()
      .mockResolvedValue(Member.add(memberId, groupId, name, userId));

    expect(
      command$.execute(
        new CreateMemberCommand(
          memberId.value,
          groupId.value,
          name.value,
          userId.value,
        ),
      ),
    ).rejects.toThrow(MemberIdAlreadyRegisteredError);

    expect(members.save).toHaveBeenCalledTimes(0);
  });
});
