import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';

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

describe('CreateMemberHandler', () => {
  let command$: CreateMemberHandler;

  const members: Partial<Members> = {};
  const checkUniqueMemberName: Partial<CheckUniqueMemberName> = {};

  const memberId = MemberId.fromString(v4());
  const groupId = GroupId.fromString(v4());
  const name = MemberName.fromString('Member Name');
  const userId = UserId.fromString('1111');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateMemberHandler,
        {
          provide: MEMBERS,
          useValue: members,
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
