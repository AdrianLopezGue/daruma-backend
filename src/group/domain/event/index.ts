import { GroupWasCreated } from './group-was-created.event';
import { GroupNameWasChanged } from './group-name-was-changed.event';
import { GroupWasRemoved } from './group-was-removed.event';
import { GroupCurrencyCodeWasChanged } from './group-currency-code-was-changed.event';

export { GroupWasCreated, GroupNameWasChanged };

export const groupEventHandlers = {
  GroupWasCreated: (
    id: string,
    name: string,
    groupname: string,
    groupcurrencycode: string,
  ) => new GroupWasCreated(id, name, groupname, groupcurrencycode),
  GroupNameWasChanged: (id: string, name: string) =>
    new GroupNameWasChanged(id, name),
  GroupCurrencyCodeWasChanged: (id: string, currencyCode: string) =>
    new GroupCurrencyCodeWasChanged(id, currencyCode),
  GroupWasRemoved: (id: string) => new GroupWasRemoved(id),
};
