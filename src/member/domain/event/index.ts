import { MemberWasCreated } from './member-was-created.event';
export { MemberWasCreated };

export const memberEventHandlers = {
  MemberWasCreated: (
    id: string,
    idGroup: string,
    name: string,
    email: string,
    idUser: string,
  ) => new MemberWasCreated(id, idGroup, name, email, idUser)
};