import { TCPClient } from 'geteventstore-promise';
import { ConfigService } from 'nestjs-config';

export const eventStoreProviders = [
  {
    provide: TCPClient,
    useFactory: (config: ConfigService): TCPClient =>
      new TCPClient({
        hostname: config.get('eventstore').hostname,
        port: config.get('eventstore').tcpPort,
        credentials: config.get('eventstore').credentials,
        poolOptions: config.get('eventstore').poolOptions,
      }),
    inject: [ConfigService],
  },
];
