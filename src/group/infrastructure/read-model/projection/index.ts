import { GroupWasCreatedProjection } from './group-was-created.projection';
import { GroupWasRenamedProjection } from './group-was-renamed.projection';
import { GroupWasRemovedProjection } from './group-was-removed.projection';
import { GroupCurrencyCodeWasChangedProjection } from './group-currency-code-was-changed.projection';

export const ProjectionHandlers = [
  GroupWasCreatedProjection,
  GroupWasRenamedProjection,
  GroupCurrencyCodeWasChangedProjection,
  GroupWasRemovedProjection,
];
