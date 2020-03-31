import { ConfigService } from 'nestjs-config';
import { FirebaseDatabase } from './firebase';

export const FirebaseProvider = [
  {
    provide: 'LOGIN',
    useFactory: async (config: ConfigService): Promise<FirebaseDatabase> =>
      {
        return new FirebaseDatabase(config);
      },
    inject: [ConfigService],
  },
];