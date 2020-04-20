import { BILLS } from '../domain/repository/index';
import { Connection } from 'mongoose';
import { BILL_MODEL, BillSchema } from './read-model/schema/bill.schema';
import { BillEventStore } from './eventstore/bill.event-store';
import { MEMBER_MODEL, MemberSchema } from '../../member/infrastructure/read-model/schema/member.schema';

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
    provide: BILLS,
    useClass: BillEventStore,
  },
];
