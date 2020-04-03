import { Member } from '../model/member';

export interface Members {
  save(group: Member): void;
}