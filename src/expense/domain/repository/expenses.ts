import { ExpenseId } from '../model/expense-id';
import { Expense } from '../model/expense';
export interface Expenses {
  find(expenseId: ExpenseId): Promise<Expense> | null;
  get(expenseId: ExpenseId): Promise<Expense>;
  save(expense: Expense): void;
}
