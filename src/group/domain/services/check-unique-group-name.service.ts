import { GroupName, GroupId } from '../model';
import { UserId } from '../../../user/domain/model/user-id';

export interface CheckUniqueGroupName {
  with(alias: GroupName, ownerId: UserId): Promise<GroupId>;
}

export const CHECK_UNIQUE_GROUP_NAME = 'CHECK_UNIQUE_GROUP_NAME';
