import * as admin from 'firebase-admin';

import * as serviceAccount from '../../config/service-account-file.json';
import { Injectable } from '@nestjs/common/decorators';

@Injectable()
export class FirebaseDatabase {
  constructor() {
    this.initialApp();
  }

  initialApp() {
    const config = {
      credential: admin.credential.cert(serviceAccount as object),
    };

    if (admin.apps.length === 0) {
      admin.initializeApp(config);
    }
  }
}
