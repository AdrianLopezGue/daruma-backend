import { ConfigService } from 'nestjs-config';
import * as admin from 'firebase-admin';

import { AuthenticationError } from '../../group/infrastructure/service/authentication.error';

import serviceAccount = require('../../../firebase/service-account-file.json');

export class FirestoreDatabase {
    private firestoreDatabase: FirebaseFirestore.Firestore;

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

    this.firestoreDatabase = admin.firestore();
    this.firestoreDatabase.settings({
        timestampsInSnapshots: true
    });
  }

    public async verifyIdToken(idToken: string){
    try {
      const decodedIdToken = await admin.auth().verifyIdToken(idToken, true);
      return decodedIdToken;
    } catch (error) {
      throw AuthenticationError.withString();
    }
  }

    getCollection(collectName: string) {
    const collection = this.firestoreDatabase.collection(collectName);
    return collection;
  }
    getDocument(collectName, docId): Promise<any> {
    const collect = this.getCollection(collectName);
    const doc = collect.doc(docId)
    return doc.get();
  }
}