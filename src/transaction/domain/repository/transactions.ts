import { TransactionId } from '../model/transaction-id';
import { DepositTransactionWasCreated } from '../event/deposit-transaction-was-created';
import { DebtTransaction } from '../model/debt-transaction';
import { DepositTransaction } from '../model/deposit-transaction';

export interface Transactions {
  findDepositTransaction(transactionId: TransactionId): Promise<DepositTransactionWasCreated> | null;
  getDepositTransaction(transactionId: TransactionId): Promise<DepositTransactionWasCreated>;
  saveDepositTransaction(depositTransaction: DepositTransaction): void;

  findDebtTransaction(transactionId: TransactionId): Promise<DebtTransaction> | null;
  getDebtTransaction(transactionId: TransactionId): Promise<DebtTransaction>;
  saveDebtTransaction(depositTransaction: DebtTransaction): void;
}
