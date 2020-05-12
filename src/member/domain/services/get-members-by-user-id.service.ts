import { UserId } from '../../../user/domain/model/user-id';

export interface GetMembersIdByUserId {
  with(userId: UserId): Promise<string[]>;
}

export const GET_MEMBERS_BY_USER_ID = 'GET_MEMBERS_BY_USER_ID';
