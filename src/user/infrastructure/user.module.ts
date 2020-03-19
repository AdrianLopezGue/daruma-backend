import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from '../../core/database/database.module';
import { EventStore } from '../../core/eventstore/eventstore';
import { EventStoreModule } from '../../core/eventstore/eventstore.module';
import { CommandHandlers } from '../application/handler';
import { userEventHandlers } from '../domain/event';
import { UserController } from './controller/user.controller';
import { ScopeEventStore } from './eventstore/ScopesEventStore';
import { ProjectionHandlers } from './read-model/projection';
import { UserService } from './service/user.service';
import { ScopeProviders } from './scope.providers';

@Module({
  controllers: [UserController],
  imports: [CqrsModule, DatabaseModule, EventStoreModule.forFeature()],
  providers: [
    ...CommandHandlers,
    ...ProjectionHandlers,
    ...ScopeProviders,
    UserService,
    ScopeEventStore,
  ],
})
export class UserModule implements OnModuleInit {
  constructor(private readonly eventStore: EventStore) {}

  onModuleInit() {
    this.eventStore.addEventHandlers(userEventHandlers);
  }
}