import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { EventStore } from '../../core/eventstore/eventstore';
import { EventStoreModule } from '../../core/eventstore/eventstore.module';
import { DatabaseModule } from '../../core/database/database.module';
import { ProjectionHandlers } from './read-model/projection/index';
import { CommandHandlers } from '../application/handler/index';
import { UserService } from './service/user.service';
import { UserEventStore } from './eventstore/user.event-store';
import { userEventHandlers } from '../domain/event/index';
import { UserProviders } from './user.provider';
import { UserController } from './controller/user.controller';

@Module({
  controllers: [UserController],
  imports: [CqrsModule, DatabaseModule, EventStoreModule.forRoot()],
  providers: [
    ...CommandHandlers,
    ...ProjectionHandlers,
    ...UserProviders,
    UserService,
    UserEventStore,
  ],
})
export class UserModule implements OnModuleInit {
  constructor(private readonly eventStore: EventStore) {}

  onModuleInit() {
    this.eventStore.addEventHandlers(userEventHandlers);
  }
}
