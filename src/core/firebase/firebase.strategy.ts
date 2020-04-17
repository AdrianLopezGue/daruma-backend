import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';

import { UserId } from '../../user/domain/model';
import { FirebaseAuthService } from './firebase.auth.service';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: FirebaseAuthService) {
    super();
  }

  async validate(token: string): Promise<UserId> {
    const id = await this.authService.validateUser(token);

    return id;
  }
}
