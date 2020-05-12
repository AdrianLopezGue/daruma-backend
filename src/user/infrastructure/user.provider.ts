import { Connection } from 'mongoose';
import { USER_MODEL, UserSchema } from './read-model/schema/user.schema';
import { UserEventStore } from './eventstore/user.event-store';
import { USERS } from '../domain/repository/users';
import { CHECK_UNIQUE_USER_EMAIL } from '../domain/services/check-unique-user-email.service';
import { CheckUniqueUserEmailFromReadModel } from './service/check-unique-user-email.service';
import { MemberEventStore } from '../../member/infrastructure/eventstore/members.event-store';
import { MEMBERS } from '../../member/domain/repository/index';
import {
  MEMBER_MODEL,
  MemberSchema,
} from '../../member/infrastructure/read-model/schema/member.schema';

export const UserProviders = [
  {
    provide: USER_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('User', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: MEMBER_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Member', MemberSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: USERS,
    useClass: UserEventStore,
  },
  {
    provide: MEMBERS,
    useClass: MemberEventStore,
  },
  {
    provide: CHECK_UNIQUE_USER_EMAIL,
    useClass: CheckUniqueUserEmailFromReadModel,
  },
];
