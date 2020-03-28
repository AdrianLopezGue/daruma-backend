
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthenticationError } from './authentication.error';
import admin = require('firebase-admin');


@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    if (!authorization) {
      return false;
    }

    request.user = this.verifyIdToken(authorization);

    return true;
  }

  public async verifyIdToken(idToken: string){
    try {
      const decodedIdToken = await admin.auth().verifyIdToken(idToken, true);
      return decodedIdToken;
    } catch (error) {
      throw AuthenticationError.withString();
    }
  }
}