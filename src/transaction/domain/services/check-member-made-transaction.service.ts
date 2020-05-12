import { MemberId } from '../../../member/domain/model/member-id';

export interface CheckMemberMadeAnyTransaction {
  with(memberId: MemberId): Promise<MemberId>;
}

export const CHECK_MEMBER_MADE_ANY_TRANSACTION =
  'CHECK_MEMBER_MADE_ANY_TRANSACTION';
