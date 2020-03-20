import { UserId, UserName } from '../model';

export interface CheckUniqueUsername {
  with(username: UserName): Promise<UserId>;
}

export const CHECK_UNIQUE_USERNAME = 'CHECK_UNIQUE_USERNAME';
