import { Connection } from 'mongoose';
import {
  DepositTransactionSchema,
  DEPOSIT_TRANSACTION_MODEL,
} from './read-model/schema/deposit-transaction.schema';
import {
  DEBT_TRANSACTION_MODEL,
  DebtTransactionSchema,
} from './read-model/schema/debt-transaction.schema';
import { TRANSACTIONS } from '../domain/repository/index';
import { TransactionEventStore } from './eventstore/transaction.event-store';
import { CheckMemberMadeAnyTransactionFromReadModel } from './service/check-member-made-transaction.service';
import {
  TRANSFER_TRANSACTION_MODEL,
  TransferTransactionSchema,
} from './read-model/schema/transfer-transaction.schema';
import {
  BALANCE_MODEL,
  BalanceSchema,
} from './read-model/schema/balance.transaction.schema';
import { CHECK_MEMBER_MADE_ANY_TRANSACTION } from '../domain/services/check-member-made-transaction.service';

export const TransactionProviders = [
  {
    provide: DEBT_TRANSACTION_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('DebtTransactions', DebtTransactionSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: DEPOSIT_TRANSACTION_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('DepositTransactions', DepositTransactionSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: TRANSFER_TRANSACTION_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('TransferTransactions', TransferTransactionSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: BALANCE_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Balance', BalanceSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: TRANSACTIONS,
    useClass: TransactionEventStore,
  },
  {
    provide: CHECK_MEMBER_MADE_ANY_TRANSACTION,
    useClass: CheckMemberMadeAnyTransactionFromReadModel,
  },
];
