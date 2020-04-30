import { DepositTransactionWasCreatedProjection } from './deposit-transaction-was-created.projection';
import { DebtTransactionWasCreatedProjection } from './debt-transaction-was-created.projection';
import { TransferTransactionWasCreatedProjection } from './transfer-transaction-was-created.projection';
import { BalanceProjection } from './balance.projection';
import { DebtTransactionWasRemovedProjection } from './debt-transaction-was-removed.projection';
import { DepositTransactionWasRemovedProjection } from './deposit-transaction-was-removed.projection';
import { TransferTransactionWasRemovedProjection } from './transfer-transaction-was-removed.projection';

export const ProjectionHandlers = [
  DebtTransactionWasCreatedProjection,
  DebtTransactionWasRemovedProjection,
  DepositTransactionWasCreatedProjection,
  DepositTransactionWasRemovedProjection,
  TransferTransactionWasCreatedProjection,
  TransferTransactionWasRemovedProjection,
  BalanceProjection,
];
