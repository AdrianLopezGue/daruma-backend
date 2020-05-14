import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { FirebaseModule } from '../../core/firebase/firebase.module';
import { CommandHandlers } from '../application/handler';
import { FirebaseDatabase } from '../../core/firebase/firebase';
import { EventStore } from '../../core/eventstore/eventstore';
import { EventStoreModule } from '../../core/eventstore/eventstore.module';
import { DatabaseModule } from '../../core/database/database.module';
import { ProjectionHandlers } from './read-model/projection/index';
import { recurringBillEventHandlers } from '../domain/event';
import { RecurringBillProviders } from './recurring-bill.provider';
import { RecurringBillService } from './service/recurring-bill.service';
import { RecurringBillEventStore } from './eventstore/recurring-bills.event-store';
import { RecurringBillController } from './controller/recurring-bill.controller';
import { RecurringBillSagas } from './sagas/recurring-bill.saga';
import { TasksService } from './service/renovation-task.service';

@Module({
  controllers: [RecurringBillController],
  imports: [
    CqrsModule,
    FirebaseModule,
    DatabaseModule,
    EventStoreModule.forRoot(),
  ],
  providers: [
    ...CommandHandlers,
    ...ProjectionHandlers,
    ...RecurringBillProviders,
    RecurringBillService,
    TasksService,
    RecurringBillEventStore,
    FirebaseDatabase,
    RecurringBillSagas,
  ],
})
export class RecurringBillModule implements OnModuleInit {
  constructor(private readonly eventStore: EventStore) {}

  onModuleInit() {
    this.eventStore.addEventHandlers(recurringBillEventHandlers);
  }
}
