import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

import * as serviceAccount from '../../config/service-account-file.json';
import { UserId } from '../../user/domain/model';
import { FirebaseAuthInterface } from './firebase.auth.interface';
import { FirebaseAuthenticationError } from './firebase.authentication.error';

@Injectable()
export class FirebaseAuthService implements FirebaseAuthInterface {
  async validateUser(token: string): Promise<UserId> {
    const config = {
      credential: admin.credential.cert(serviceAccount as object),
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      databaseURL: process.env.DATABASE_URL,
      storageBucket: process.env.STORAGE_BUCKET,
    };

    if (admin.apps.length === 0) {
      admin.initializeApp(config);
    }

    try {
      const decodedIdToken = await admin.auth().verifyIdToken(token);

      return UserId.fromString(decodedIdToken.sub);
    } catch (error) {
      throw FirebaseAuthenticationError.withString();
    }
  }
}
