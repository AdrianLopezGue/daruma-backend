import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';

import { GroupCurrencyCode } from '../../../group/domain/model';
import { Group } from '../../../group/domain/model/group';
import { GroupId } from '../../../group/domain/model/group-id';
import { GroupName } from '../../../group/domain/model/group-name';
import { GROUPS, Groups } from '../../../group/domain/repository';
import { OwnerDto } from '../../../group/infrastructure/dto/owner.dto';
import { UserId } from '../../../user/domain/model/user-id';
import {
  MemberIdAlreadyRegisteredError,
} from '../../domain/exception/member-id-already-registered.error';
import {
  MemberNameAlreadyRegisteredError,
} from '../../domain/exception/member-name-in-group.error';
import { Member } from '../../domain/model/member';
import { MemberId } from '../../domain/model/member-id';
import { MemberName } from '../../domain/model/member-name';
import { MEMBERS } from '../../domain/repository';
import { Members } from '../../domain/repository/members';
import {
  CHECK_UNIQUE_MEMBER_NAME,
  CheckUniqueMemberName,
} from '../../domain/services/check-unique-member-name.service';
import { CreateMemberCommand } from '../command/create-member.command';
import { CreateMemberHandler } from './create-member.handler';

describe('CreateMemberHandler', () => {
  let command$: CreateMemberHandler;

  const members: Partial<Members> = {};
  const groups: Partial<Groups> = {};
  const checkUniqueMemberName: Partial<CheckUniqueMemberName> = {};

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
      ],
    }).compile();

    command$ = module.get<CreateMemberHandler>(CreateMemberHandler);
    members.find = jest.fn().mockResolvedValue(null);
    members.save = jest.fn();
    groups.find = jest
      .fn()
      .mockResolvedValue(
        Group.add(groupId, groupName, groupCurrencyCode, userId),
      );
    groups.save = jest.fn();
    checkUniqueMemberName.with = jest.fn().mockResolvedValue(null);
  });

  it('should creates a new member', async () => {
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
