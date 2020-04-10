import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { FirebaseModule } from '../../core/firebase/firebase.module';
import { CommandHandlers } from '../application/handler';
import { FirebaseDatabase } from '../../core/firebase/firebase';
import { EventStore } from '../../core/eventstore/eventstore';
import { EventStoreModule } from '../../core/eventstore/eventstore.module';
import { DatabaseModule } from '../../core/database/database.module';
import { ProjectionHandlers } from './read-model/projection/index';
import { ExpenseProviders } from './expense.provider';
import { ExpenseService } from './service/expense.service';
import { ExpenseEventStore } from './eventstore/expense.event-store';
import { ExpenseController } from './controller/expense.controller';
import { expenseEventHandlers } from '../domain/event/index';

@Module({
  controllers: [ExpenseController],
  imports: [CqrsModule, FirebaseModule, DatabaseModule, EventStoreModule.forRoot()],
  providers: [
    ...CommandHandlers,
    ...ProjectionHandlers,
    ...ExpenseProviders,
    ExpenseService,
    ExpenseEventStore,
    FirebaseDatabase
  ],
})
export class ExpenseModule implements OnModuleInit {
  constructor(private readonly eventStore: EventStore) {}

  onModuleInit() {
    this.eventStore.addEventHandlers(expenseEventHandlers);
  }
}
