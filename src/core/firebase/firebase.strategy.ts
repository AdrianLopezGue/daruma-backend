import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';

import { UserId } from '../../user/domain/model';
import {
  FIREBASE_AUTH,
  FirebaseAuthInterface,
} from './firebase.auth.interface';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(FIREBASE_AUTH) private authService: FirebaseAuthInterface,
  ) {
    super();
  }

  async validate(token: string): Promise<UserId> {
    const id = await this.authService.validateUser(token);

    return id;
  }
}
