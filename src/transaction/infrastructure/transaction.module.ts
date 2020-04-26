import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CommandHandlers } from '../application/handler';
import { EventStore } from '../../core/eventstore/eventstore';
import { EventStoreModule } from '../../core/eventstore/eventstore.module';
import { DatabaseModule } from '../../core/database/database.module';
import { ProjectionHandlers } from './read-model/projection/index';
import { TransactionService } from './service/transaction.service';
import { TransactionEventStore } from './eventstore/transaction.event-store';
import { transactionEventHandlers } from '../domain/event/index';
import { TransactionProviders } from './transaction.provider';
import { TransactionController } from './controller/transaction.controller';
import { BalanceController } from './controller/balance.controller';
import { BalanceService } from './service/balance.service';

@Module({
  controllers: [TransactionController, BalanceController],
  imports: [CqrsModule, DatabaseModule, EventStoreModule.forRoot()],
  providers: [
    ...CommandHandlers,
    ...ProjectionHandlers,
    ...TransactionProviders,
    TransactionService,
    BalanceService,
    TransactionEventStore,
  ],
})
export class TransactionModule implements OnModuleInit {
  constructor(private readonly eventStore: EventStore) {}

  onModuleInit() {
    this.eventStore.addEventHandlers(transactionEventHandlers);
  }
}
