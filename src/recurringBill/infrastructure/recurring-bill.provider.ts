import { Connection } from 'mongoose';
import { RecurringBillSchema, RECURRING_BILL_MODEL } from './read-model/schema/recurring-bill.schema';
import { GROUPS } from '../../group/domain/repository/index';
import { GroupEventStore } from '../../group/infrastructure/eventstore/groups.event-store';
import { RECURRING_BILLS } from '../domain/repository/recurring-bills';
import { RecurringBillEventStore } from './eventstore/recurring-bills.event-store';


export const RecurringBillProviders = [
  {
    provide: RECURRING_BILL_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('RecurringBill', RecurringBillSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: RECURRING_BILLS,
    useClass: RecurringBillEventStore,
  },
  {
    provide: GROUPS,
    useClass: GroupEventStore,
  },
];
