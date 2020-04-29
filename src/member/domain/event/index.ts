import { MemberWasCreated } from './member-was-created.event';
import { MemberWasRegisteredAsUser } from './member-was-registered-as-user.event';
import { MemberNameWasChanged } from './member-name-was-changed.event';
import { MemberWasRemoved } from './member-was-removed.event';

export { MemberWasCreated };
export { MemberWasRegisteredAsUser };
export { MemberNameWasChanged };

export const memberEventHandlers = {
  MemberWasCreated: (
    id: string,
    idGroup: string,
    name: string,
    idUser: string,
  ) => new MemberWasCreated(id, idGroup, name, idUser),
  MemberWasRegisteredAsUser: (id: string, idUser: string) =>
    new MemberWasRegisteredAsUser(id, idUser),
  MemberNameWasChanged: (id: string, name: string) =>
    new MemberNameWasChanged(id, name),
  MemberWasRemoved: (id: string) =>
    new MemberWasRemoved(id),
};
