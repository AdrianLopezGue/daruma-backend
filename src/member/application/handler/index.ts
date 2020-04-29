import { CreateMemberHandler } from './create-member.handler';
import { RegisterMemberAsUserHandler } from './register-member-as-user.handler';
import { ChangeMembersNameHandler } from './change-members-name.handler';
import { RemoveMembersHandler } from './remove-members-name.handler';

export const CommandHandlers = [
  CreateMemberHandler,
  RegisterMemberAsUserHandler,
  ChangeMembersNameHandler,
  RemoveMembersHandler
];
