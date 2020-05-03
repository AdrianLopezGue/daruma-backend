import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';
import { MemberId } from '../../domain/model/member-id';
import { GroupId } from '../../../group/domain/model/group-id';
import { MemberName } from '../../domain/model/member-name';
import { UserId } from '../../../user/domain/model/user-id';
import { Members } from '../../domain/repository/members';
import { MEMBERS } from '../../domain/repository/index';
import { RemoveMemberHandler } from './remove-member.handler';
import { Member } from '../../domain/model/member';
import { RemoveMemberCommand } from '../command/remove-member.command';
import { MemberIdNotFoundError } from '../../domain/exception/member-id-not-found.error';
import {
  CHECK_MEMBER_MADE_ANY_TRANSACTION,
  CheckMemberMadeAnyTransaction,
} from '../../../transaction/domain/services/check-member-made-transaction.service';
import {
  MEMBER_SERVICE,
  MemberService,
} from '../../infrastructure/service/member.service';

describe('RemoveMemberHandler', () => {
  let command$: RemoveMemberHandler;

  const members: Partial<Members> = {};
  const checkMemberMadeAnyTransaction: Partial<CheckMemberMadeAnyTransaction> = {};
  const memberService: Partial<MemberService> = {};

  const memberId = MemberId.fromString(v4());
  const groupId = GroupId.fromString(v4());
  const name = MemberName.fromString('Member Name');
  const userId = UserId.fromString('1111');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemoveMemberHandler,
        {
          provide: MEMBERS,
          useValue: members,
        },
        {
          provide: CHECK_MEMBER_MADE_ANY_TRANSACTION,
          useValue: checkMemberMadeAnyTransaction,
        },
        {
          provide: MEMBER_SERVICE,
          useValue: memberService,
        },
      ],
    }).compile();

    command$ = module.get<RemoveMemberHandler>(RemoveMemberHandler);
    members.find = jest.fn().mockResolvedValue(null);
    members.save = jest.fn();
    checkMemberMadeAnyTransaction.with = jest.fn().mockResolvedValue(null);
    memberService.getMembersIdByGroupId = jest.fn().mockResolvedValue(1);
  });

  it('should remove a member', async () => {
    const member = Member.add(memberId, groupId, name, userId);
    members.find = jest.fn().mockResolvedValue(member);

    await command$.execute(new RemoveMemberCommand(memberId.value));

    expect(members.save).toHaveBeenCalledTimes(1);
    expect(members.save).toHaveBeenCalledWith(member);
  });

  it('should throw an error if member does not exists', async () => {
    members.find = jest.fn().mockResolvedValue(null);

    expect(
      command$.execute(new RemoveMemberCommand(memberId.value)),
    ).rejects.toThrow(MemberIdNotFoundError);

    expect(members.save).toHaveBeenCalledTimes(0);
  });

  it('should throw an error if member was removed', async () => {
    const member = Member.add(memberId, groupId, name, userId);
    member.remove();
    members.find = jest.fn().mockResolvedValue(member);

    expect(
      command$.execute(new RemoveMemberCommand(memberId.value)),
    ).rejects.toThrow(MemberIdNotFoundError);

    expect(members.save).toHaveBeenCalledTimes(0);
  });
});
