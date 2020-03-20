import { User, UserId } from '../model';

export interface Users {
  find(userId: UserId): Promise<User> | null;
  nextIdentity(): UserId;
  save(user: User): void;
}

export const USERS = 'USERS';
