import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from '../core/database/database.module';
import { EventStore } from '../core/eventstore/eventstore';
import { EventStoreModule } from '../core/eventstore/eventstore.module';
import { CommandHandlers } from './application/handler';
import { scopeEventHandlers } from './domain/event';
import { ScopeController } from './infrastructure/controller/ScopeController';
import { ScopeEventStore } from './infrastructure/eventstore/ScopesEventStore';
import { ProjectionHandlers } from './infrastructure/read-model/projection';
import { ScopeService } from './infrastructure/service/ScopeService';
import { ScopeProviders } from './scope.providers';

@Module({
  controllers: [ScopeController],
  imports: [CqrsModule, DatabaseModule, EventStoreModule.forFeature()],
  providers: [
    ...CommandHandlers,
    ...ProjectionHandlers,
    ...ScopeProviders,
    ScopeService,
    ScopeEventStore,
  ],
})
export class ScopeModule implements OnModuleInit {
  constructor(private readonly eventStore: EventStore) {}

  onModuleInit() {
    this.eventStore.addEventHandlers(scopeEventHandlers);
  }
}