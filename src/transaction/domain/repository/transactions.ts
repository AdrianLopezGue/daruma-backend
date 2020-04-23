import { TransactionId } from '../model/transaction-id';
import { DebtTransaction } from '../model/debt-transaction';
import { DepositTransaction } from '../model/deposit-transaction';

export interface Transactions {
  findDepositTransaction(transactionId: TransactionId): Promise<DepositTransaction> | null;
  getDepositTransaction(transactionId: TransactionId): Promise<DepositTransaction>;
  saveDepositTransaction(depositTransaction: DepositTransaction): void;

  findDebtTransaction(transactionId: TransactionId): Promise<DebtTransaction> | null;
  getDebtTransaction(transactionId: TransactionId): Promise<DebtTransaction>;
  saveDebtTransaction(debtTransaction: DebtTransaction): void;
}
