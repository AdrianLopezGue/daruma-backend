import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { FirebaseModule } from '../../core/firebase/firebase.module';
import { CommandHandlers } from '../application/handler';
import { GroupController } from './controller/group.controller';
import { GroupProviders } from './group.provider';
import { GroupService } from './service/group.service';
import { GroupEventStore } from './eventstore/groups.event-store';
import { FirebaseDatabase } from '../../core/firebase/firebase';
import { EventStore } from '../../core/eventstore/eventstore';
import { groupEventHandlers } from '../domain/event/index';
import { EventStoreModule } from '../../core/eventstore/eventstore.module';
import { DatabaseModule } from '../../core/database/database.module';

@Module({
  controllers: [GroupController],
  imports: [CqrsModule, FirebaseModule, DatabaseModule, EventStoreModule.forRoot()],
  providers: [
    ...CommandHandlers,
    ...GroupProviders,
    GroupService,
    GroupEventStore,
    FirebaseDatabase,
  ],
})
export class GroupModule implements OnModuleInit {
  constructor(private readonly eventStore: EventStore) {}

  onModuleInit() {
    this.eventStore.addEventHandlers(groupEventHandlers);
  }
}
