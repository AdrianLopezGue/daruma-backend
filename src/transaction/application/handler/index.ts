import { CreateDepositTransactionHandler } from './create-deposit-transaction.handler';
import { CreateDebtTransactionHandler } from './create-debt-transaction.handler';
import { CreateTransferTransactionHandler } from './create-transfer-transaction.handler';
import { RemoveDebtAndDepositTransactionsHandler } from './remove-debt-and-deposit-transactions.handler';
import { RemoveTransferTransactionsHandler } from './remove-transfer-transactions.handler';

export const CommandHandlers = [
  CreateDepositTransactionHandler,
  CreateDebtTransactionHandler,
  CreateTransferTransactionHandler,
  RemoveDebtAndDepositTransactionsHandler,
  RemoveTransferTransactionsHandler
];
