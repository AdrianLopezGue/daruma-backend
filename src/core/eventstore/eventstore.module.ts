import { DynamicModule } from '@nestjs/common';

import { EventStore } from './eventstore';
import { eventStoreProviders } from './eventstore.provider';

export class EventStoreModule {
  static forRoot(): DynamicModule {
    return {
      module: EventStoreModule,
      providers: [EventStore, ...eventStoreProviders],
      exports: [EventStore, ...eventStoreProviders],
    };
  }
}
