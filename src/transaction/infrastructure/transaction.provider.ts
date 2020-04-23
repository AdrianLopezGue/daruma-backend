import { Connection } from 'mongoose';
import { DepositTransactionSchema, DEPOSIT_TRANSACTION_MODEL } from './read-model/schema/deposit-transaction.schema';
import { DEBT_TRANSACTION_MODEL } from './read-model/schema/debt-transaction.schema';
import { TRANSACTIONS } from '../domain/repository/index';
import { TransactionEventStore } from './eventstore/transaction.event-store';

export const TransactionProviders = [
  {
    provide: DEBT_TRANSACTION_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('DebtTransactions', DepositTransactionSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: DEPOSIT_TRANSACTION_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('DepositTransactions', DepositTransactionSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: TRANSACTIONS,
    useClass: TransactionEventStore,
  },
];