import { ExpenseId } from '../model/expense-id';
import { Expense } from '../model/expense';
export interface Expenses {
  find(groupId: ExpenseId): Promise<Expense> | null;
  get(groupId: ExpenseId): Promise<Expense>;
  save(group: Expense): void;
}