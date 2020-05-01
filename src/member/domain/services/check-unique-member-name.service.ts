import { MemberName } from '../model/member-name';
import { GroupId } from '../../../group/domain/model/group-id';
import { MemberId } from '../model/member-id';

export interface CheckUniqueMemberName {
  with(name: MemberName, groupId: GroupId): Promise<MemberId>;
}

export const CHECK_UNIQUE_MEMBER_NAME = 'CHECK_UNIQUE_MEMBER_NAME';
