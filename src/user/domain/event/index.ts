import { UserWasRegistered } from './user-was-registered.event';
import { UsernameWasChanged } from './username-was-changed.event';
import { UseremailWasChanged } from './useremail-was-changed.event';

export { UserWasRegistered, UsernameWasChanged, UseremailWasChanged };

export const userEventHandlers = {
  UserWasRegistered: (id: string, name: string, alias: string) =>
    new UserWasRegistered(id, name, alias),
  UsernameWasChanged: (id: string, name: string) =>
    new UsernameWasChanged(id, name),
  UseremailWasChanged: (id: string, mail: string) =>
    new UseremailWasChanged(id, mail),
};
