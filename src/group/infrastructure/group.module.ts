import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { FirestoreModule } from '../../core/firestore/firestore.module';
import { CommandHandlers } from '../application/handler';
import { GroupController } from './controller/group.controller';
import { GroupProviders } from './group.provider';
import { GroupService } from './service/group.service';
import { GroupDatabase } from './database/groups.database';
import { FirestoreDatabase } from '../../core/firestore/firestore';

@Module({
  controllers: [GroupController],
  imports: [CqrsModule, FirestoreModule],
  providers: [
    ...CommandHandlers,
    ...GroupProviders,
    GroupService,
    GroupDatabase,
    FirestoreDatabase,
  ],
})
export class GroupModule implements OnModuleInit {
  constructor() {}

  onModuleInit() {;
  }
}
