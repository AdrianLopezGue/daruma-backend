import { UserWasCreated } from './user-was-created.event';
import { UserPaypalWasChanged } from './user-paypal-was-changed.event';
import { UserNameWasChanged } from './user-name-was-changed.event';

export { UserWasCreated };
export { UserNameWasChanged };
export { UserPaypalWasChanged };

export const userEventHandlers = {
  UserWasCreated: (id: string, name: string, email: string, paypal: string) =>
    new UserWasCreated(id, name, email, paypal),
  UserNameWasChanged: (id: string, username: string) =>
    new UserNameWasChanged(id, username),
  UserPaypalWasChanged: (id: string, userpaypal: string) =>
    new UserPaypalWasChanged(id, userpaypal),
};
