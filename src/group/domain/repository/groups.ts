import { Group, GroupId } from '../model';
import { GroupView } from '../../infrastructure/schema/group.view';

export interface Groups {
  find(groupId: GroupId): Promise<GroupView> | null;
  get(groupId: GroupId): Promise<GroupView>;
  save(group: Group): void;
}
