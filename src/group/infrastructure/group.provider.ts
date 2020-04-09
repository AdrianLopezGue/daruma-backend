import { CHECK_UNIQUE_GROUP_NAME } from '../domain/services/check-unique-group-name.service';
import { CheckUniqueGroupNameFromReadModel } from './service/check-unique-group-name.service';
import { GROUPS } from '../domain/repository/index';
import { GroupEventStore } from './eventstore/groups.event-store';
import { GROUP_MODEL, GroupSchema } from './read-model/schema/group.schema';
import { Connection } from 'mongoose';
import { MEMBER_MODEL, MemberSchema } from '../../member/infrastructure/read-model/schema/member.schema';

export const GroupProviders = [
  {
    provide: GROUP_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Group', GroupSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: MEMBER_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Member', MemberSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: GROUPS,
    useClass: GroupEventStore,
  },
  {
    provide: CHECK_UNIQUE_GROUP_NAME,
    useClass: CheckUniqueGroupNameFromReadModel,
  },
];
