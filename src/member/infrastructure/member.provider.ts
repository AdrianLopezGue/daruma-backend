import { Connection } from 'mongoose';
import { MEMBER_MODEL, MemberSchema } from './read-model/schema/member.schema';
import { MEMBERS } from '../domain/repository/index';
import { MemberEventStore } from './eventstore/members.event-store';
import { CheckUniqueMemberNameFromReadModel } from './service/check-unique-member-name.service';
import { CHECK_UNIQUE_MEMBER_NAME } from '../domain/services/check-unique-member-name.service';
import { CHECK_USER_IN_GROUP } from '../domain/services/check-user-in-group.service';
import { CheckUserInGroupFromReadModel } from './service/check-user-in-group.service';
import { CheckMemberMadeAnyTransactionFromReadModel } from '../../transaction/infrastructure/service/check-member-made-transaction.service';
import { CHECK_MEMBER_MADE_ANY_TRANSACTION } from '../../transaction/domain/services/check-member-made-transaction.service';
import { DEBT_TRANSACTION_MODEL, DebtTransactionSchema } from '../../transaction/infrastructure/read-model/schema/debt-transaction.schema';
import { DepositTransactionSchema, DEPOSIT_TRANSACTION_MODEL } from '../../transaction/infrastructure/read-model/schema/deposit-transaction.schema';
import { GroupEventStore } from '../../group/infrastructure/eventstore/groups.event-store';
import { GROUPS } from '../../group/domain/repository/index';
import { MEMBER_SERVICE, MemberService } from './service/member.service';

export const MemberProviders = [
  {
    provide: MEMBER_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Member', MemberSchema),
    inject: ['DATABASE_CONNECTION'],
  },
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
    provide: MEMBERS,
    useClass: MemberEventStore,
  },
  {
    provide: MEMBER_SERVICE,
    useValue: MemberService,
  },
  {
    provide: GROUPS,
    useClass: GroupEventStore,
  },
  {
    provide: CHECK_UNIQUE_MEMBER_NAME,
    useClass: CheckUniqueMemberNameFromReadModel,
  },
  {
    provide: CHECK_USER_IN_GROUP,
    useClass: CheckUserInGroupFromReadModel,
  },
  {
    provide: CHECK_MEMBER_MADE_ANY_TRANSACTION,
    useClass: CheckMemberMadeAnyTransactionFromReadModel,
  }
];
