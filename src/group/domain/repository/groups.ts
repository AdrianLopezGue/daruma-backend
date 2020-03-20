import { Group, GroupId } from '../model';

export interface Groups {
  find(scopeId: GroupId): Promise<Group> | null;
  get(scopeId: GroupId): Promise<Group>;
  nextIdentity(): GroupId;
  save(scope: Group): void;
}
