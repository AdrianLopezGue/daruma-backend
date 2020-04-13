import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { FirebaseModule } from '../../core/firebase/firebase.module';
import { CommandHandlers } from '../application/handler';
import { FirebaseDatabase } from '../../core/firebase/firebase';
import { EventStore } from '../../core/eventstore/eventstore';
import { EventStoreModule } from '../../core/eventstore/eventstore.module';
import { DatabaseModule } from '../../core/database/database.module';
import { ProjectionHandlers } from './read-model/projection/index';
import { ReceiptService } from './repository/receipt.service';
import { ReceiptEventStore } from './eventstore/receipt.event-store';
import { receiptEventHandlers } from '../domain/event/index';
import { ReceiptProviders } from './receipt.provider';

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
    ...ReceiptProviders,
    ReceiptService,
    ReceiptEventStore,
    FirebaseDatabase,
  ],
})
export class ReceiptModule implements OnModuleInit {
  constructor(private readonly eventStore: EventStore) {}

  onModuleInit() {
    this.eventStore.addEventHandlers(receiptEventHandlers);
  }
}
