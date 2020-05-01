import { Connection } from 'mongoose';
import { MEMBER_MODEL, MemberSchema } from './read-model/schema/member.schema';
import { MEMBERS } from '../domain/repository/index';
import { MemberEventStore } from './eventstore/members.event-store';
import { CheckUniqueMemberNameFromReadModel } from './service/check-unique-member-name.service';
import { CHECK_UNIQUE_MEMBER_NAME } from '../domain/services/check-unique-member-name.service';
import { CHECK_USER_IN_GROUP } from '../domain/services/check-user-in-group.service';
import { CheckUserInGroupFromReadModel } from './service/check-user-in-group.service';

export const MemberProviders = [
  {
    provide: MEMBER_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Member', MemberSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: MEMBERS,
    useClass: MemberEventStore,
  },
  {
    provide: CHECK_UNIQUE_MEMBER_NAME,
    useClass: CheckUniqueMemberNameFromReadModel,
  },
  {
    provide: CHECK_USER_IN_GROUP,
    useClass: CheckUserInGroupFromReadModel,
  }
];
