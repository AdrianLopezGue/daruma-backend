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
import { ProjectionHandlers } from './read-model/projection/index';
import { MemberService } from '../../member/infrastructure/service/member.service';
import { MemberModule } from '../../member/infrastructure/member.module';
import { BalanceService } from '../../transaction/infrastructure/service/balance.service';
import { TransactionModule } from '../../transaction/infrastructure/transaction.module';

@Module({
  controllers: [GroupController],
  imports: [
    CqrsModule,
    FirebaseModule,
    DatabaseModule,
    MemberModule,
    TransactionModule,
    EventStoreModule.forRoot(),
  ],
  providers: [
    ...CommandHandlers,
    ...ProjectionHandlers,
    ...GroupProviders,
    GroupService,
    GroupEventStore,
    FirebaseDatabase,
    MemberService,
    BalanceService,
  ],
})
export class GroupModule implements OnModuleInit {
  constructor(private readonly eventStore: EventStore) {}

  onModuleInit() {
    this.eventStore.addEventHandlers(groupEventHandlers);
  }
}
