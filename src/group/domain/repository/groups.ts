import { Group, GroupId } from '../model';

export interface Groups {
  find(groupId: GroupId): Promise<Group> | null;
  get(groupId: GroupId): Promise<Group>;
  nextIdentity(): GroupId;
  save(group: Group): void;
}