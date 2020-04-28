import { CreateDepositTransactionHandler } from './create-deposit-transaction.handler';
import { CreateDebtTransactionHandler } from './create-debt-transaction.handler';
import { CreateTransferTransactionHandler } from './create-transfer-transaction.handler';

export const CommandHandlers = [
  CreateDepositTransactionHandler,
  CreateDebtTransactionHandler,
  CreateTransferTransactionHandler,
];
