import { UserId } from '../model/user-id';
import { UserEmail } from '../model/user-email';

export interface CheckUniqueUserEmail {
  with(email: UserEmail): Promise<UserId>;
}

export const CHECK_UNIQUE_USER_EMAIL = 'CHECK_UNIQUE_USER_EMAIL';
