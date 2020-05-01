import { BILLS } from '../domain/repository/index';
import { Connection } from 'mongoose';
import { BILL_MODEL, BillSchema } from './read-model/schema/bill.schema';
import { BillEventStore } from './eventstore/bill.event-store';
import {
  MEMBER_MODEL,
  MemberSchema,
} from '../../member/infrastructure/read-model/schema/member.schema';
import { TRANSACTIONS } from '../../transaction/domain/repository/index';
import { TransactionEventStore } from '../../transaction/infrastructure/eventstore/transaction.event-store';
import { CHECK_USER_IN_GROUP } from '../../member/domain/services/check-user-in-group.service';
import { CheckUserInGroupFromReadModel } from '../../member/infrastructure/service/check-user-in-group.service';
export const BillProviders = [
  {
    provide: BILL_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Bills', BillSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: MEMBER_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Member', MemberSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: TRANSACTIONS,
    useClass: TransactionEventStore,
  },
  {
    provide: BILLS,
    useClass: BillEventStore,
  },
  {
    provide: CHECK_USER_IN_GROUP,
    useClass: CheckUserInGroupFromReadModel,
  }
];
