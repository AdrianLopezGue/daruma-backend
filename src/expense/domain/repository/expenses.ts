import { ExpenseId } from '../model/expense-id';
import { Expense } from '../model/expense';
import { Payer } from '../../../payer/domain/model/payer';
import { Debtor } from '../../../debtor/domain/model/debtor';
export interface Expenses {
  find(expenseId: ExpenseId): Promise<Expense> | null;
  get(expenseId: ExpenseId): Promise<Expense>;
  save(expense: Expense): void;
  payers(expense: ExpenseId): Promise<Payer>;
  debtors(expense: ExpenseId): Promise<Debtor>;
}
