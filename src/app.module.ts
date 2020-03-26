import { Global, Module } from '@nestjs/common';

import { BootstrapModule } from './bootstrap.module';
import { GroupModule } from './group/infrastructure/group.module';

@Global()
@Module({
  imports: [BootstrapModule, GroupModule],
})
export class AppModule {}
