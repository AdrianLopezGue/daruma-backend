import { UserId } from '../../user/domain/model';

export interface FirebaseAuthInterface {
  validateUser(token: string): Promise<UserId>;
}

export const FIREBASE_AUTH = 'FIREBASE_AUTH';
