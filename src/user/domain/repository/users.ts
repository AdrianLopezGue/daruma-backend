
import { User } from '../model';
import { UserId } from '../model/user-id';

export interface Users {
  find(groupId: UserId): Promise<User> | null;
  get(groupId: UserId): Promise<User>;
  save(user: User): void;
}

export const USERS = 'USERS';