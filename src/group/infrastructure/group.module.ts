import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from '../../core/database/database.module';
import { CommandHandlers } from '../application/handler';
import { GroupController } from './controller/group.controller';
import { GroupProviders } from './group.provider';
import { GroupService } from './service/group.service';

@Module({
  controllers: [GroupController],
  imports: [CqrsModule, DatabaseModule],
  providers: [
    ...CommandHandlers,
    ...GroupProviders,
    GroupService,
  ],
})
export class GroupModule implements OnModuleInit {
  constructor() {}

  onModuleInit() {;
  }
}
