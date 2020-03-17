import { connect, Mongoose } from 'mongoose';
import { ConfigService } from 'nestjs-config';

export const DatabaseProvider = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (config: ConfigService): Promise<Mongoose> =>
      connect(
        config.get('database').url,
        { useNewUrlParser: true },
      ),
    inject: [ConfigService],
  },
];
