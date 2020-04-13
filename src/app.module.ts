import { Global, Module } from '@nestjs/common';

import { BootstrapModule } from './bootstrap.module';
import { GroupModule } from './group/infrastructure/group.module';
import { MemberModule } from './member/infrastructure/member.module';
import { UserModule } from './user/infrastructure/user.module';
import { ExpenseModule } from './expense/infrastructure/expense.module';
import { ReceiptModule } from './receipt/infrastructure/receipt.module';
import { DebtorModule } from './debtor/infrastructure/debtor.module';
import { PayerModule } from './payer/infrastructure/payer.module';

@Global()
@Module({
  imports: [
    BootstrapModule,
    GroupModule,
    UserModule,
    MemberModule,
    ExpenseModule,
    ReceiptModule,
    PayerModule,
    DebtorModule,
    ReceiptModule
  ],
})
export class AppModule {}
