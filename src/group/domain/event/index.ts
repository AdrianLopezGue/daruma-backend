import { GroupWasCreated } from './group-was-created.event';
import { GroupNameWasChanged } from './group-name-was-changed.event';

export { GroupWasCreated, GroupNameWasChanged };

export const groupEventHandlers = {
  ScopeWasCreated: (id: string, name: string, groupname: string, groupcurrencycode: string) =>
    new GroupWasCreated(id, name, groupname, groupcurrencycode),
  ScopeWasRenamed: (id: string, name: string) => new GroupNameWasChanged(id, name),
};