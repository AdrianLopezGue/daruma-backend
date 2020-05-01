import { GroupId } from '../../../group/domain/model/group-id';
import { MemberId } from '../model/member-id';
import { UserId } from '../../../user/domain/model/user-id';

export interface CheckUserInGroup {
  with(userId: UserId, groupId: GroupId): Promise<MemberId>;
}

export const CHECK_USER_IN_GROUP = 'CHECK_USER_IN_GROUP';