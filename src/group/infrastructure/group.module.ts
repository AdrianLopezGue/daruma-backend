import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from '../../core/database/database.module';
import { EventStore } from '../../core/eventstore/eventstore';
import { EventStoreModule } from '../../core/eventstore/eventstore.module';
import { CommandHandlers } from '../application/handler';
import { groupEventHandlers } from '../domain/event';
import { GroupController } from './controller/group.controller';
import { ProjectionHandlers } from './read-model/projection';
import { GroupProviders } from './group.provider';
import { GroupService } from './service/group.service';

@Module({
  controllers: [GroupController],
  imports: [CqrsModule, DatabaseModule, EventStoreModule.forRoot()],
  providers: [
    ...CommandHandlers,
    ...ProjectionHandlers,
    ...GroupProviders,
    GroupService,
  ],
})
export class GroupModule implements OnModuleInit {
  constructor(private readonly eventStore: EventStore) {}

  onModuleInit() {
    this.eventStore.addEventHandlers(groupEventHandlers);
  }
}
