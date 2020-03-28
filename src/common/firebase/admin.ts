import * as admin from 'firebase-admin';
import { AuthenticationError } from '../guards/authentication.error';

const config = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    storageBucket: process.env.STORAGE_BUCKET,
    credential: admin.credential.applicationDefault(),
  };

admin.initializeApp(config);

const firebaseAdmin = admin.firestore();
// Disable deprecated features
firebaseAdmin.settings({
    timestampsInSnapshots: true
});

async function verifyIdToken(idToken: string) {
  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken, true);
    return decodedIdToken;
  } catch (error) {
    throw AuthenticationError.withString();
  }
}

export default firebaseAdmin;
export { verifyIdToken };