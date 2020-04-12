import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { FirebaseModule } from '../../core/firebase/firebase.module';
import { CommandHandlers } from '../application/handler';
import { FirebaseDatabase } from '../../core/firebase/firebase';
import { EventStore } from '../../core/eventstore/eventstore';
import { EventStoreModule } from '../../core/eventstore/eventstore.module';
import { DatabaseModule } from '../../core/database/database.module';
import { payerEventHandlers } from '../domain/event/index';
import { PayerService } from './service/payer.service';
import { PayerEventStore } from './eventstore/payer.event-store';
import { PayerProviders } from './payer.provider';
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
    ...PayerProviders,
    PayerService,
    PayerEventStore,
    FirebaseDatabase,
  ],
})
export class PayerModule implements OnModuleInit {
  constructor(private readonly eventStore: EventStore) {}

  onModuleInit() {
    this.eventStore.addEventHandlers(payerEventHandlers);
  }
}
