import { Member } from '../model/member';
import { MemberId } from '../model/member-id';

export interface Members {
  find(memberId: MemberId): Promise<Member> | null;
  get(memberId: MemberId): Promise<Member>;
  save(memberId: Member): void;
}
