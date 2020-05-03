import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveMemberCommand } from '../command/remove-member.command';
import { MEMBERS, Members } from '../../domain/repository/index';
import { MemberId } from '../../domain/model/member-id';
import { Member } from '../../domain/model/member';
import { MemberIdNotFoundError } from '../../domain/exception/member-id-not-found.error';
import {
  CHECK_MEMBER_MADE_ANY_TRANSACTION,
  CheckMemberMadeAnyTransaction,
} from '../../../transaction/domain/services/check-member-made-transaction.service';
import { MemberMadeTransactionError } from '../../domain/exception/member-made-transaction.error';
import { MemberService, MEMBER_SERVICE } from '../../infrastructure/service/member.service';
import { LastMemberInGroupError } from '../../domain/exception/last-member-in-group.error';
import { GET_MEMBERS_BY_GROUP_ID, GetMembersIdByGroupId } from '../../domain/services/get-members-by-group-id.service';
import { GroupId } from '../../../group/domain/model/group-id';

@CommandHandler(RemoveMemberCommand)
export class RemoveMemberHandler
  implements ICommandHandler<RemoveMemberCommand> {
  constructor(
    @Inject(MEMBERS) private readonly members: Members,
    @Inject(CHECK_MEMBER_MADE_ANY_TRANSACTION)
    private readonly checkMemberMadeAnyTransaction: CheckMemberMadeAnyTransaction,
    @Inject(GET_MEMBERS_BY_GROUP_ID)
    private readonly getMembersByGroupId: GetMembersIdByGroupId,
  ) {}

  async execute(command: RemoveMemberCommand) {
    const memberId = MemberId.fromString(command.memberId);
    const member = await this.members.find(memberId);

    if (!(member instanceof Member) || member.isRemoved) {
      throw MemberIdNotFoundError.withString(memberId.value);
    }

    if ((await this.getMembersByGroupId.with(GroupId.fromString(member.groupId.value))).length === 1){
      throw LastMemberInGroupError.withString(memberId.value);
    }

    if ((await this.checkMemberMadeAnyTransaction.with(memberId)) instanceof MemberId) {
      throw MemberMadeTransactionError.withString(command.memberId);
    }

    member.remove();
    this.members.save(member);
  }
}
