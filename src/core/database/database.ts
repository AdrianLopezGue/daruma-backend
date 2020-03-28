import { ConfigService } from 'nestjs-config';
import * as admin from 'firebase-admin';

import serviceAccount = require('../../../firebase/service-account-file.json');
import { Injectable } from '@nestjs/common/decorators';

@Injectable()
export class FirestoreDatabase {
    private firestoreApp: FirebaseFirestore.Firestore;

    constructor(configService: ConfigService) {
      this.initialApp(configService)
  }

    initialApp(configService: ConfigService) {

    const config = {
        credential: admin.credential.cert(serviceAccount.toString()),
        apiKey: configService.get('database').apiKey,
        authDomain: configService.get('database').authDomain,
        databaseURL: configService.get('database').databaseUrl,
        storageBucket: configService.get('database').storageBucket,
    };

    admin.initializeApp(config);

    this.firestoreApp = admin.firestore();
    this.firestoreApp.settings({
        timestampsInSnapshots: true
    });
  }

    getCollection(collectName: string) {
    const collection = this.firestoreApp.collection(collectName);
    return collection;
  }
    getDocument(collectName, docId): Promise<any> {
    const collect = this.getCollection(collectName);
    const doc = collect.doc(docId)
    return doc.get();
  }
}