
import { User } from '../model';

export interface Users {
  save(user: User): void;
}

export const USERS = 'USERS';