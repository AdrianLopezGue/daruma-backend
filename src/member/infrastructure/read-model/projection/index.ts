import { MemberWasCreatedProjection } from './member-was-created.projection';
import { RegisterMemberAsUserProjection } from './register-member-as-user.projection';
import { MemberWasRenamedProjection } from './member-was-renamed.projection';

export const ProjectionHandlers = [
  MemberWasCreatedProjection,
  RegisterMemberAsUserProjection,
  MemberWasRenamedProjection,
];
