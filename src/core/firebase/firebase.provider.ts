import { FIREBASE_AUTH } from './firebase.auth.interface';
import { FirebaseAuthService } from './firebase.auth.service';
import { FirebaseAuthFakeService } from './firebase.authfake.service';

export const FirebaseProvider = [
  {
    provide: FIREBASE_AUTH,
    useClass:
      process.env.NODE_ENV === 'test'
        ? FirebaseAuthFakeService
        : FirebaseAuthService,
  },
];
