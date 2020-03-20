import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { ConfigModule } from 'nestjs-config';
import * as path from 'path';

import { EventStore, EventStoreModule } from './core/eventstore';

@Module({
  imports: [
    ConfigModule.load(
      path.resolve(__dirname, 'config/**/!(*.d).config.{ts,js}'),
      {
        modifyConfigName: name => name.replace('.config', ''),
      },
    ),
    CqrsModule,
    EventStoreModule.forRoot(),
  ],
})
export class BootstrapModule implements OnModuleInit {
  constructor(
    private readonly event$: EventBus,
    private readonly eventStore: EventStore,
  ) {}

  onModuleInit() {
    /** ------------ */
    this.eventStore.bridgeEventsTo((this.event$ as any).subject$);
    this.event$.publisher = this.eventStore;
  }
}
