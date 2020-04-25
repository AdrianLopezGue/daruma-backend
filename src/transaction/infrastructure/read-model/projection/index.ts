import { DepositTransactionWasCreatedProjection } from './deposit-transaction-was-created.projection';
import { DebtTransactionWasCreatedProjection } from './debt-transaction-was-created.projection';
import { TransferTransactionWasCreatedProjection } from './transfer-transaction-was-created.projection';
import { BalanceProjection } from './balance.projection';

export const ProjectionHandlers = [
    DebtTransactionWasCreatedProjection,
    DepositTransactionWasCreatedProjection,
    TransferTransactionWasCreatedProjection,
    BalanceProjection,
];
