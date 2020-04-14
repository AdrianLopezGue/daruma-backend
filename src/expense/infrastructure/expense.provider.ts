import { EXPENSES } from '../domain/repository/index';
import { Connection } from 'mongoose';
import {
  EXPENSE_MODEL,
  ExpenseSchema,
} from './read-model/schema/expense.schema';
import { ExpenseEventStore } from './eventstore/expense.event-store';
import { PAYER_MODEL, PayerSchema } from '../../payer/infrastructure/read-model/schema/payer.schema';
import { DEBTOR_MODEL, DebtorSchema } from '../../debtor/infrastructure/read-model/schema/debtor.schema';
import { RECEIPT_MODEL, ReceiptSchema } from '../../receipt/infrastructure/read-model/schema/receipt.schema';
import { PAYERS } from '../../payer/domain/repository/index';
import { PayerEventStore } from '../../payer/infrastructure/eventstore/payer.event-store';
import { DEBTORS } from '../../debtor/domain/repository/index';
import { DebtorEventStore } from '../../debtor/infrastructure/eventstore/debtor.event-store';

export const ExpenseProviders = [
  {
    provide: EXPENSE_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Expense', ExpenseSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: PAYER_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Payer', PayerSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: DEBTOR_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Debtor', DebtorSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: RECEIPT_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Receipt', ReceiptSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: EXPENSES,
    useClass: ExpenseEventStore,
  },
  {
    provide: PAYERS,
    useClass: PayerEventStore,
  },
  {
    provide: DEBTORS,
    useClass: DebtorEventStore,
  },
];
