import { RECEIPTS } from '../domain/repository/index';
import { Connection } from 'mongoose';
import {
  RECEIPT_MODEL,
  ReceiptSchema,
} from './read-model/schema/receipt.schema';
import { ReceiptEventStore } from './eventstore/receipt.event-store';

export const ReceiptProviders = [
  {
    provide: RECEIPT_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Receipt', ReceiptSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: RECEIPTS,
    useClass: ReceiptEventStore,
  },
];