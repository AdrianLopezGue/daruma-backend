import { BillWasCreatedProjection } from './bill-was-created.projection';
import { BillWasRemovedProjection } from './bill-was-removed.projection';
import { BillCurrencyCodeWasChangedProjection } from './bill-currency-code-was-changed.projection';

export const ProjectionHandlers = [BillWasCreatedProjection, BillWasRemovedProjection, BillCurrencyCodeWasChangedProjection];
