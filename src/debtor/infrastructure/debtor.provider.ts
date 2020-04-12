import { DEBTORS } from '../domain/repository/index';
import { Connection } from 'mongoose';
import { DEBTOR_MODEL, DebtorSchema } from './read-model/schema/debtor.schema';
import { DebtorEventStore } from './eventstore/debtor.event-store';

export const DebtorProviders = [
  {
    provide: DEBTOR_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Debtor', DebtorSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: DEBTORS,
    useClass: DebtorEventStore,
  },
];
