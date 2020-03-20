import { GroupWasCreatedProjection } from './group-was-created.projection';
import { GroupNameWasChangedProjection } from './group-name-was-changed.projection';

export const ProjectionHandlers = [
  GroupWasCreatedProjection,
  GroupNameWasChangedProjection,
];
