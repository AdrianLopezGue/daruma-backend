import { Connection } from 'mongoose';

import { CHECK_UNIQUE_GROUP_NAME } from '../domain/services/check-unique-group-name.service';
import { GROUP_MODEL, GroupSchema } from './read-model/schema/group.schema';
import { CheckUniqueGroupNameFromReadModel } from './service/check-unique-group-name.service';

export const GroupProviders = [
  {
    provide: GROUP_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Group', GroupSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: CHECK_UNIQUE_GROUP_NAME,
    useClass: CheckUniqueGroupNameFromReadModel,
  },
];
