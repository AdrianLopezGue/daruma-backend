import { Injectable } from '@nestjs/common';

import { UserId } from '../../user/domain/model';
import { FirebaseAuthInterface } from './firebase.auth.interface';

@Injectable()
export class FirebaseAuthFakeService implements FirebaseAuthInterface {
  async validateUser(token: string): Promise<UserId> {
    return Promise.resolve(UserId.fromString(token));
  }
}
