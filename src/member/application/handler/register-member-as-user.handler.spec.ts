import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';

import { UserId } from '../../../user/domain/model/';
import { RegisterMemberAsUserCommand } from '../command/register-member-as-user.command';
import { RegisterMemberAsUserHandler } from './register-member-as-user.handler';
import { Members } from '../../../../dist/member/domain/repository/members';
import { MemberId } from '../../domain/model/member-id';
import { MemberName } from '../../domain/model/member-name';
import { MemberEmail } from '../../domain/model/member-email';
import { MEMBERS } from '../../domain/repository/index';
import { Member } from '../../domain/model/member';
import { MemberIdNotFoundError } from '../../domain/exception/member-id-not-found.error';
import { GroupId } from '../../../group/domain/model/group-id';

describe('RegisterMemberAsUserHandler', () => {
  let command$: RegisterMemberAsUserHandler;

  const members: Partial<Members> = {};

  const memberId = MemberId.fromString(v4());
  const groupId = GroupId.fromString(v4());
  const name = MemberName.fromString('Member Name');
  const email = MemberEmail.fromString('Member Email');
  const userId = UserId.fromString('1111');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterMemberAsUserHandler,
        {
          provide: MEMBERS,
          useValue: members,
        },
      ],
    }).compile();

    command$ = module.get<RegisterMemberAsUserHandler>(RegisterMemberAsUserHandler);
    members.find = jest.fn().mockResolvedValue(null);
    members.save = jest.fn();
  });

  it('should change user id', async () => {
    const member = Member.add(memberId, groupId, name, email, userId);
    const newUserId = UserId.fromString('2222');

    members.find = jest.fn().mockResolvedValue(member);
    member.setUserId(newUserId);

    await command$.execute(
      new RegisterMemberAsUserCommand(groupId.value, newUserId.value),
    );

    expect(members.save).toHaveBeenCalledTimes(1);
    expect(members.save).toHaveBeenCalledWith(member);
  });

  it('should throw an error if group does not exists', async () => {
    expect(
      command$.execute(new RegisterMemberAsUserCommand(groupId.value, '2222')),
    ).rejects.toThrow(MemberIdNotFoundError);

    expect(members.save).toHaveBeenCalledTimes(0);
  });
});
