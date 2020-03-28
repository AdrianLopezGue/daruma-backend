import { ConfigService } from 'nestjs-config';
import { FirestoreDatabase } from './database';

export const DatabaseProvider = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (config: ConfigService): Promise<FirestoreDatabase> =>
      {
        return new FirestoreDatabase(config);
      },
    inject: [ConfigService],
  },
];
