import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticationError } from './authentication.error';
import { UserId } from '../../../user/domain/model/user-id';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../../../config/service-account-file.json';

export const Authorization = createParamDecorator(async (data: unknown, ctx: ExecutionContext) => {

    const request = ctx.switchToHttp().getRequest<Request>();
    const authorization = request.headers['authorization'];

    if (!authorization) {
      return false;
    }

    const config = {
      credential: admin.credential.cert(serviceAccount as object),
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      databaseURL: process.env.DATABASE_URL,
      storageBucket: process.env.STORAGE_BUCKET
    };

    if (admin.apps.length === 0){
      admin.initializeApp(config);
    }

    try {
        const decodedIdToken = await admin.auth().verifyIdToken(authorization);
        return UserId.fromString(decodedIdToken.sub);
      } catch (error) {
        throw AuthenticationError.withString();
      }
});