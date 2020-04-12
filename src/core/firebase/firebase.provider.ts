import { FirebaseDatabase } from './firebase';

export const FirebaseProvider = [
  {
    provide: 'LOGIN',
    useFactory: async (): Promise<FirebaseDatabase> => {
      return new FirebaseDatabase();
    },
    inject: [],
  },
];
