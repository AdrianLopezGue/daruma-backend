import { ConfigService } from 'nestjs-config';
import * as admin from 'firebase-admin';

import * as serviceAccount from '../../config/service-account-file.json';
import { Injectable } from '@nestjs/common/decorators';

@Injectable()
export class FirebaseDatabase {
    private firestoreApp: FirebaseFirestore.Firestore;

    constructor(configService: ConfigService) {
      this.initialApp(configService)
  }

    initialApp(configService: ConfigService) {

    const config = {
        credential: admin.credential.cert(serviceAccount as object),
        apiKey: configService.get('database').apiKey,
        authDomain: configService.get('database').authDomain,
        databaseURL: configService.get('database').databaseUrl,
        storageBucket: configService.get('database').storageBucket,
    };

    if (admin.apps.length === 0){
      admin.initializeApp(config);

      this.firestoreApp = admin.firestore();
      this.firestoreApp.settings({
          timestampsInSnapshots: true
      });
    }
  }
}