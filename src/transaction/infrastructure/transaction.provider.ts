import { Connection } from 'mongoose';
import { GROUPS } from '../../group/domain/repository/index';
import { GroupEventStore } from '../../group/infrastructure/eventstore/groups.event-store';
import { GET_MEMBERS_BY_GROUP_ID } from '../../member/domain/services/get-members-by-group-id.service';
import { MemberSchema, MEMBER_MODEL } from '../../member/infrastructure/read-model/schema/member.schema';
import { GetMembersIdByGroupIdFromReadModel } from '../../member/infrastructure/service/get-members-by-group-id.service';
import { MemberService, MEMBER_SERVICE } from '../../member/infrastructure/service/member.service';
import { TRANSACTIONS } from '../domain/repository/index';
import { CHECK_MEMBER_MADE_ANY_TRANSACTION } from '../domain/services/check-member-made-transaction.service';
import { TransactionEventStore } from './eventstore/transaction.event-store';
import { BalanceSchema, BALANCE_MODEL } from './read-model/schema/balance.transaction.schema';
import { DebtTransactionSchema, DEBT_TRANSACTION_MODEL } from './read-model/schema/debt-transaction.schema';
import {
  DepositTransactionSchema,
  DEPOSIT_TRANSACTION_MODEL
} from './read-model/schema/deposit-transaction.schema';
import { TransferTransactionSchema, TRANSFER_TRANSACTION_MODEL } from './read-model/schema/transfer-transaction.schema';
import { CheckMemberMadeAnyTransactionFromReadModel } from './service/check-member-made-transaction.service';

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
    provide: MEMBER_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Member', MemberSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: MEMBER_SERVICE,
    useValue: MemberService,
  },
  {
    provide: TRANSACTIONS,
    useClass: TransactionEventStore,
  },
  {
    provide: CHECK_MEMBER_MADE_ANY_TRANSACTION,
    useClass: CheckMemberMadeAnyTransactionFromReadModel,
  },
  {
    provide: GROUPS,
    useClass: GroupEventStore,
  },
  {
    provide: GET_MEMBERS_BY_GROUP_ID,
    useClass: GetMembersIdByGroupIdFromReadModel,
  },
];
