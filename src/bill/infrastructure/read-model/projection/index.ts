import { BillWasCreatedProjection } from './bill-was-created.projection';
import { BillWasRemovedProjection } from './bill-was-removed.projection';
import { BillCurrencyCodeWasChangedProjection } from './bill-currency-code-was-changed.projection';
import { BillNameWasChangedProjection } from './bill-name-was-changed.projection';
import { BillDateWasChangedProjection } from './bill-date-was-changed.projection';
import { BillPayerWasRemovedProjection } from './bill-payer-was-removed.projection';
import { BillDebtorWasRemovedProjection } from './bill-debtor-was-removed.projection';
import { BillPayerWasAddedProjection } from './bill-payer-was-added.projection';
import { BillDebtorWasAddedProjection } from './bill-debtor-was-added.projection';
import { BillMoneyWasChangedProjection } from './bill-money-was-changed.projection';

export const ProjectionHandlers = [
  BillWasCreatedProjection,
  BillWasRemovedProjection,
  BillCurrencyCodeWasChangedProjection,
  BillMoneyWasChangedProjection,
  BillNameWasChangedProjection,
  BillDateWasChangedProjection,
  BillPayerWasRemovedProjection,
  BillDebtorWasRemovedProjection,
  BillPayerWasAddedProjection,
  BillDebtorWasAddedProjection,
];
