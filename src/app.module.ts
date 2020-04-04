import { Global, Module } from '@nestjs/common';

import { BootstrapModule } from './bootstrap.module';
import { GroupModule } from './group/infrastructure/group.module';
import { MemberModule } from './member/infrastructure/member.module';
import { UserModule } from './user/infrastructure/user.module';

@Global()
@Module({
  imports: [BootstrapModule, GroupModule, UserModule, MemberModule],
})
export class AppModule {}
