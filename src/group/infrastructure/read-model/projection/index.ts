import { GroupWasCreatedProjection } from './group-was-created.projection';
import { GroupWasRenamedProjection } from './group-was-renamed.projection';

export const ProjectionHandlers = [
  GroupWasCreatedProjection,
  GroupWasRenamedProjection,
];
