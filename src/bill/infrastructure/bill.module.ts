import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { FirebaseModule } from '../../core/firebase/firebase.module';
import { CommandHandlers } from '../application/handler';
import { FirebaseDatabase } from '../../core/firebase/firebase';
import { EventStore } from '../../core/eventstore/eventstore';
import { EventStoreModule } from '../../core/eventstore/eventstore.module';
import { DatabaseModule } from '../../core/database/database.module';
import { ProjectionHandlers } from './read-model/projection/index';
import { BillProviders } from './bill.provider';
import { BillService } from './service/bill.service';
import { BillEventStore } from './eventstore/bill.event-store';
import { BillController } from './controller/bill.controller';
import { billEventHandlers } from '../domain/event/index';
import { MemberService } from '../../member/infrastructure/service/member.service';
import { TransactionModule } from '../../transaction/infrastructure/transaction.module';
import { BillSagas } from './sagas/bill.saga';

@Module({
  controllers: [BillController],
  imports: [
    CqrsModule,
    FirebaseModule,
    DatabaseModule,
    EventStoreModule.forRoot(),
    TransactionModule,
  ],
  providers: [
    ...CommandHandlers,
    ...ProjectionHandlers,
    ...BillProviders,
    BillService,
    BillEventStore,
    FirebaseDatabase,
    MemberService,
    BillSagas,
  ],
})
export class BillModule implements OnModuleInit {
  constructor(private readonly eventStore: EventStore) {}

  onModuleInit() {
    this.eventStore.addEventHandlers(billEventHandlers);
  }
}
