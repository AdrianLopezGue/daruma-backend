import { CHECK_UNIQUE_GROUP_NAME } from '../domain/services/check-unique-group-name.service';
import { CheckUniqueGroupNameFromFirebase } from './service/check-unique-group-name.service';
import { GROUPS } from '../domain/repository/index';
import { GroupDatabase } from './database';

export const GroupProviders = [
  {
    provide: GROUPS,
    useClass: GroupDatabase,
  },
  {
    provide: CHECK_UNIQUE_GROUP_NAME,
    useClass: CheckUniqueGroupNameFromFirebase,
  },
];
