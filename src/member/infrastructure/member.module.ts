import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CommandHandlers } from '../application/handler';
import { EventStore } from '../../core/eventstore/eventstore';
import { EventStoreModule } from '../../core/eventstore/eventstore.module';
import { DatabaseModule } from '../../core/database/database.module';
import { ProjectionHandlers } from './read-model/projection/index';
import { MemberProviders } from './member.provider';
import { MemberService } from './service/member.service';
import { MemberEventStore } from './eventstore/members.event-store';
import { memberEventHandlers } from '../domain/event/index';
import { MemberController } from './controller/member.controller';

@Module({
  controllers: [MemberController],
  imports: [CqrsModule, DatabaseModule, EventStoreModule.forRoot()],
  providers: [
    ...CommandHandlers,
    ...ProjectionHandlers,
    ...MemberProviders,
    MemberService,
    MemberEventStore,
  ],
})
export class MemberModule implements OnModuleInit {
  constructor(private readonly eventStore: EventStore) {}

  onModuleInit() {
    this.eventStore.addEventHandlers(memberEventHandlers);
  }
}
