import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticationError } from './authentication.error';
import { UserId } from '../../../user/domain/model/user-id';
import admin = require('firebase-admin');

export const Authorization = createParamDecorator(async (data: unknown, ctx: ExecutionContext) => {

    const request = ctx.switchToHttp().getRequest();
    const authorization = request.authorizationHeader;

    if (!authorization) {
      return false;
    }

    try {
        const decodedIdToken = await admin.auth().verifyIdToken(authorization, true);
        return UserId.fromString(decodedIdToken.sub);
      } catch (error) {
        throw AuthenticationError.withString();
      }
});