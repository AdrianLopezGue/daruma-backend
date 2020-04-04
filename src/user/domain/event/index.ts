import { UserWasCreated } from './user-was-created.event';

export { UserWasCreated };

export const userEventHandlers = {
  UserWasCreated: (id: string, name: string, alias: string) =>
    new UserWasCreated(id, name, alias),
};
