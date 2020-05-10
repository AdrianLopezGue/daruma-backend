import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BillModule } from './bill/infrastructure/bill.module';
import { BootstrapModule } from './bootstrap.module';
import { GroupModule } from './group/infrastructure/group.module';
import { MemberModule } from './member/infrastructure/member.module';
import { UserModule } from './user/infrastructure/user.module';
import { TransactionModule } from './transaction/infrastructure/transaction.module';
import { RecurringBillModule } from './recurringBill/infrastructure/recurring-bill.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `.env.${process.env.NODE_ENV}.local`,
        `.env.${process.env.NODE_ENV}`,
        '.env.local',
      ],
    }),
    BootstrapModule,
    GroupModule,
    UserModule,
    MemberModule,
    BillModule,
    TransactionModule,
    RecurringBillModule
  ],
})
export class AppModule {}
