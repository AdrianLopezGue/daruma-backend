import { Global, Module } from '@nestjs/common';

import { BootstrapModule } from './bootstrap.module';
import { GroupModule } from './group/infrastructure/group.module';
import { MemberModule } from './member/infrastructure/member.module';
import { UserModule } from './user/infrastructure/user.module';
import { ExpenseModule } from './expense/infrastructure/expense.module';

@Global()
@Module({
  imports: [BootstrapModule, GroupModule, UserModule, MemberModule, ExpenseModule],
})
export class AppModule {}
