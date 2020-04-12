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

describe('CreateMemberHandler', () => {
  let command$: CreateMemberHandler;

  const members: Partial<Members> = {};

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
      ],
    }).compile();

    command$ = module.get<CreateMemberHandler>(CreateMemberHandler);
    members.save = jest.fn();
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
});
