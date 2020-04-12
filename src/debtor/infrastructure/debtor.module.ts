import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { FirebaseModule } from '../../core/firebase/firebase.module';
import { CommandHandlers } from '../application/handler';
import { FirebaseDatabase } from '../../core/firebase/firebase';
import { EventStore } from '../../core/eventstore/eventstore';
import { EventStoreModule } from '../../core/eventstore/eventstore.module';
import { DatabaseModule } from '../../core/database/database.module';
import { debtorEventHandlers } from '../domain/event/index';
import { DebtorService } from './service/debtor.service';
import { DebtorEventStore } from './eventstore/debtor.event-store';
import { DebtorProviders } from './debtor.provider';
import { ProjectionHandlers } from './read-model/projection/index';

@Module({
  controllers: [],
  imports: [
    CqrsModule,
    FirebaseModule,
    DatabaseModule,
    EventStoreModule.forRoot(),
  ],
  providers: [
    ...CommandHandlers,
    ...ProjectionHandlers,
    ...DebtorProviders,
    DebtorService,
    DebtorEventStore,
    FirebaseDatabase,
  ],
})
export class DebtorModule implements OnModuleInit {
  constructor(private readonly eventStore: EventStore) {}

  onModuleInit() {
    this.eventStore.addEventHandlers(debtorEventHandlers);
  }
}
