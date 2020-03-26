import * as admin from 'firebase-admin';

const config = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    storageBucket: process.env.STORAGE_BUCKET,
    credential: admin.credential.applicationDefault(),
  };

admin.initializeApp(config);

const firebaseDatabase = admin.firestore();
// Disable deprecated features
firebaseDatabase.settings({
    timestampsInSnapshots: true
});

export default firebaseDatabase;