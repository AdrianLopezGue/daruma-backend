import { Member } from '../model/member';
import { MemberId } from '../model/member-id';

export interface Members {
  find(groupId: MemberId): Promise<Member> | null;
  get(groupId: MemberId): Promise<Member>;
  save(group: Member): void;
}