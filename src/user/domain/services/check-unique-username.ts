import { UserId, Username } from '../model';

export interface CheckUniqueUsername {
  with(username: Username): Promise<UserId>;
}

export const CHECK_UNIQUE_USERNAME = 'CHECK_UNIQUE_USERNAME';