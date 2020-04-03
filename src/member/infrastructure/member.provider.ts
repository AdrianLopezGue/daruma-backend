
import { Connection } from 'mongoose';
import { MEMBER_MODEL, MemberSchema } from './read-model/schema/member.schema';
import { MEMBERS } from '../domain/repository/index';
import { MemberEventStore } from './eventstore/members.event-store';

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
  }
];