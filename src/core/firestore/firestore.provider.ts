import { ConfigService } from 'nestjs-config';
import { FirestoreDatabase } from './firestore';

export const FirestoreProvider = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (config: ConfigService): Promise<FirestoreDatabase> =>
      {
        return new FirestoreDatabase(config);
      },
    inject: [ConfigService],
  },
];
