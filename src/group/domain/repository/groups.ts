import { Group } from '../model';
import { UserId } from '@app/user/domain/model';
import { GroupName } from '../model/group-name';
import { GroupId } from '../model/group-id';

export interface Groups {
  findGroupByName(groupName: GroupName, idOwner: UserId): Promise<Group> | null; // fromState
  find(groupId: GroupId): Promise<Group> | null; // fromState
  save(group: Group): void;
  getGroupsById(userId: UserId): Promise<Group[]>; // getState
}
