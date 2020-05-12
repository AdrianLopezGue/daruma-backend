import { RecurringBillWasCreatedProjection } from './recurring-bill-was-created.projection';
import { RecurringBillWasRemovedProjection } from './recurring-bill-was-removed.projection';
import { RecurringBillPeriodWasChangedProjection } from './recurring-bill-period-was-changed.projection';

export const ProjectionHandlers = [
  RecurringBillWasCreatedProjection,
  RecurringBillWasRemovedProjection,
  RecurringBillPeriodWasChangedProjection,
];
