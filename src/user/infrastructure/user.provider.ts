
import { Connection } from 'mongoose';
import { USER_MODEL, UserSchema } from './read-model/schema/user.schema';
import { UserEventStore } from './eventstore/user.event-store';
import { USERS } from '../domain/repository/users';

export const UserProviders = [
  {
    provide: USER_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('User', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: USERS,
    useClass: UserEventStore,
  }
];