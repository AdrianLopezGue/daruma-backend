import { MemberWasCreated } from './member-was-created.event';
import { MemberWasRegisteredAsUser } from './member-was-registered-as-user.event';
export { MemberWasCreated };

export const memberEventHandlers = {
  MemberWasCreated: (
    id: string,
    idGroup: string,
    name: string,
    email: string,
    idUser: string,
  ) => new MemberWasCreated(id, idGroup, name, email, idUser),
  MemberWasRegisteredAsUser: (id: string, idUser: string) =>
    new MemberWasRegisteredAsUser(id, idUser),
};