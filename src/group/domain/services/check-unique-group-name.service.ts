import { GroupName, GroupId } from '../model';

export interface CheckUniqueGroupName {
  with(alias: GroupName): Promise<GroupId>;
}

export const CHECK_UNIQUE_GROUP_NAME = 'CHECK_UNIQUE_GROUP_NAME';
