import { CreateDepositTransactionHandler } from './create-deposit-transaction.handler';
import { CreateDebtTransactionHandler } from './create-debt-transaction.handler';

export const CommandHandlers = [
  CreateDepositTransactionHandler,
  CreateDebtTransactionHandler,
];