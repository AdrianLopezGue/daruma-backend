import { GroupId } from '../../../group/domain/model/group-id';

export interface GetMembersIdByGroupId {
  with(groupId: GroupId): Promise<string[]>;
}

export const GET_MEMBERS_BY_GROUP_ID = 'GET_MEMBERS_BY_GROUP_ID';
