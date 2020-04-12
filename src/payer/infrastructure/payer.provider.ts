import { PAYERS } from '../domain/repository/index';
import { Connection } from 'mongoose';
import { PAYER_MODEL, PayerSchema } from './read-model/schema/payer.schema';
import { PayerEventStore } from './eventstore/payer.event-store';

export const PayerProviders = [
  {
    provide: PAYER_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Payer', PayerSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: PAYERS,
    useClass: PayerEventStore,
  }
];